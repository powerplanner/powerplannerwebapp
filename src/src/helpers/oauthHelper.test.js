import { createAuthorizationRedirect, loadAuthorizationRequest } from './oauthHelper';

const clientId = 'https://client.example/oauth/metadata.json';
const redirectUri = 'https://client.example/callback?existing=1';
const metadata = {
  client_id: clientId,
  client_name: 'Example Client',
  redirect_uris: [redirectUri],
  token_endpoint_auth_method: 'none'
};
const search = (overrides = {}) => '?' + new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  state: 'original +&=state',
  ...overrides
});
const load = query => loadAuthorizationRequest(query, new AbortController().signal);
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    json: async () => metadata
  });
});

afterAll(() => {
  global.fetch = originalFetch;
});

it('loads client identity through the server and preserves the exact callback and state without sending credentials', async () => {
  const request = await load(search({ scope: 'tasks.read' }));
  expect(request).toEqual({
    clientId,
    clientName: 'Example Client',
    redirectUri,
    state: 'original +&=state',
    scope: 'tasks.read'
  });
  expect(global.fetch).toHaveBeenCalledWith(
    'https://powerplanner.net/api/oauthclientmetadata?client_id=' + encodeURIComponent(clientId),
    expect.objectContaining({
      credentials: 'omit',
      redirect: 'error',
      referrerPolicy: 'no-referrer'
    })
  );
});

it('encodes client ID query parameters without forwarding authorization state or credentials', async () => {
  const queriedClientId = clientId + '?client=example&value=a+b';
  global.fetch.mockResolvedValue({
    status: 200,
    json: async () => ({ ...metadata, client_id: queriedClientId })
  });
  await load(search({ client_id: queriedClientId }));
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(url.origin + url.pathname).toBe('https://powerplanner.net/api/oauthclientmetadata');
  expect(Array.from(url.searchParams.entries())).toEqual([['client_id', queriedClientId]]);
});

it('requests raw metadata text instead of the API JSON-encoding the document string', async () => {
  global.fetch.mockImplementation(async (_url, options) => ({
    status: 200,
    json: async () => options.headers.Accept === 'text/plain' ? metadata : JSON.stringify(metadata)
  }));
  await expect(load(search())).resolves.toMatchObject({ clientId, clientName: 'Example Client' });
});

it('uses the client hostname when the optional name is absent', async () => {
  global.fetch.mockResolvedValue({
    status: 200,
    json: async () => ({ client_id: clientId, redirect_uris: [redirectUri] })
  });
  expect((await load(search())).clientName).toBe('client.example');
});

it.each([
  [['none', 'private_key_jwt']],
  [['none']]
])('accepts supported methods %j despite a private_key_jwt legacy preference', async methods => {
  global.fetch.mockResolvedValue({
    status: 200,
    json: async () => ({
      ...metadata,
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_methods_supported: methods
    })
  });
  await expect(load(search())).resolves.toMatchObject({ clientId, clientName: 'Example Client' });
});

it.each([
  [[], 'public clients'],
  [['private_key_jwt'], 'public clients'],
  ['none', 'array of strings'],
  [null, 'array of strings'],
  [['none', 5], 'array of strings']
])('rejects unsupported or malformed method lists %j without falling back to the singular field', async (methods, error) => {
  global.fetch.mockResolvedValue({
    status: 200,
    json: async () => ({ ...metadata, token_endpoint_auth_methods_supported: methods })
  });
  await expect(load(search())).rejects.toThrow(error);
});

it.each([
  [{ response_type: 'token' }, 'response_type'],
  [{ response_mode: 'fragment' }, 'response_mode'],
  [{ client_id: '' }, 'required'],
  [{ redirect_uri: '' }, 'required'],
  [{ client_id: 'http://client.example/metadata.json' }, 'HTTPS'],
  [{ client_id: 'https://user:pass@client.example/metadata.json' }, 'credentials'],
  [{ client_id: 'https://client.example/metadata.json#fragment' }, 'fragment'],
  [{ client_id: 'https://client.example/' }, 'document path'],
  [{ client_id: 'https://client.example/a/%2e%2e/metadata.json' }, 'dot segments'],
  [{ redirect_uri: 'javascript:alert(1)' }, 'HTTPS'],
  [{ redirect_uri: 'https://client.example/callback#fragment' }, 'fragment']
])('rejects invalid authorization parameters %j before fetching metadata', async (overrides, error) => {
  await expect(load(search(overrides))).rejects.toThrow(error);
  expect(global.fetch).not.toHaveBeenCalled();
});

it('rejects duplicate parameters', async () => {
  await expect(load(search() + '&redirect_uri=https%3A%2F%2Fother.example%2Fcallback'))
    .rejects.toThrow('Duplicate');
  expect(global.fetch).not.toHaveBeenCalled();
});

it.each([
  [null, 'client_id'],
  [{ ...metadata, client_id: clientId + '?other' }, 'client_id'],
  [{ ...metadata, redirect_uris: ['https://client.example/callback'] }, 'exactly match'],
  [{ ...metadata, redirect_uris: [redirectUri, 5] }, 'redirect_uris'],
  [{ ...metadata, client_name: 5 }, 'client_name'],
  [{ ...metadata, token_endpoint_auth_method: 'client_secret_basic' }, 'public clients'],
  [{ ...metadata, token_endpoint_auth_method: 'private_key_jwt' }, 'public clients'],
  [{ ...metadata, token_endpoint_auth_methods_supported: ['none'], client_secret: 'not-allowed' }, 'public clients']
])('rejects invalid client metadata %j', async (document, error) => {
  global.fetch.mockResolvedValue({ status: 200, json: async () => document });
  await expect(load(search())).rejects.toThrow(error);
});

it('reports HTTP, server connection, and invalid JSON failures', async () => {
  global.fetch.mockResolvedValueOnce({ status: 404 });
  await expect(load(search())).rejects.toThrow('HTTP 404');
  global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
  await expect(load(search())).rejects.toThrow('Power Planner server');
  global.fetch.mockResolvedValueOnce({
    status: 200,
    json: async () => { throw new SyntaxError('Invalid JSON'); }
  });
  await expect(load(search())).rejects.toThrow('Invalid JSON');
});

it('returns the legacy code and original state while preserving callback query parameters', () => {
  const redirect = new URL(createAuthorizationRedirect(redirectUri, 'original +&=state', 'user+name', 'session;&='));
  expect(redirect.origin + redirect.pathname).toBe('https://client.example/callback');
  expect(redirect.searchParams.get('existing')).toBe('1');
  expect(redirect.searchParams.get('code')).toBe('user+name;session;&=');
  expect(redirect.searchParams.get('state')).toBe('original +&=state');
});

it('keeps the existing ChatGPT code/state response format, including an absent state', () => {
  const redirect = new URL(createAuthorizationRedirect('https://chat.openai.com/callback', '', 'user', 'session'));
  expect(redirect.search).toBe('?code=user%3Bsession&state=');
});
