import * as React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Authorize from './index';
import Api from '../../api';
import AccountHelper from '../../helpers/accountHelper';
import NavigationHelper from '../../helpers/navigationHelper';

jest.mock('../../api', () => ({
  __esModule: true,
  default: { logInAsync: jest.fn() }
}));
jest.mock('../../models/globalState', () => ({
  __esModule: true,
  default: { updateMainState: jest.fn() }
}));
jest.mock('../../helpers/accountHelper', () => ({
  __esModule: true,
  default: {
    setLoginCookies: jest.fn(),
    getAccountCredentials: () => ({ username: 'test-user', session: 'test-session' })
  }
}));

const clientId = 'https://client.example/metadata.json';
const redirectUri = 'https://client.example/callback?existing=1';
const search = '?' + new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  state: 'original +&=state'
});
const originalLocation = window.location;
const originalFetch = global.fetch;
const originalMatchMedia = window.matchMedia;
let container;
let history;

const clickButton = async label => {
  const button = Array.from(document.querySelectorAll('button')).find(b => b.textContent === label);
  expect(button).toBeDefined();
  await act(async () => { Simulate.click(button); });
};

beforeEach(() => {
  jest.clearAllMocks();
  delete window.location;
  window.location = { href: 'https://app.powerplanner.net/authorize' + search, search };
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: true,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }));
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    json: async () => ({ client_id: clientId, client_name: 'Example Client', redirect_uris: [redirectUri] })
  });
  Api.logInAsync.mockResolvedValue({ AccountId: 1, Session: 'test-session' });
  container = document.createElement('div');
  document.body.appendChild(container);
  history = createMemoryHistory({ initialEntries: ['/authorize' + search] });
  jest.spyOn(NavigationHelper, 'goBack').mockImplementation(() => history.goBack());
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.restoreAllMocks();
  window.location = originalLocation;
  global.fetch = originalFetch;
  window.matchMedia = originalMatchMedia;
});

const render = async () => {
  await act(async () => {
    ReactDOM.render(<Router history={history}><Authorize /></Router>, container);
  });
};

it('shows client identity and requires login before returning the existing code and exact state', async () => {
  await render();
  expect(document.body.textContent).toContain('Example Client');
  expect(document.body.textContent).toContain('client.example');
  expect(document.body.textContent).toContain('access to your Power Planner account');
  expect(Api.logInAsync).not.toHaveBeenCalled();

  act(() => {
    Simulate.change(document.getElementById('username'), { target: { value: 'test-user' } });
    Simulate.change(document.getElementById('password'), { target: { value: 'test-password' } });
  });
  await clickButton('Log In and Authorize');
  expect(Api.logInAsync).toHaveBeenCalledWith('test-user', 'test-password');
  expect(AccountHelper.setLoginCookies).toHaveBeenCalledWith(1, 'test-user', 'test-session');
  const redirect = new URL(window.location.href);
  expect(redirect.searchParams.get('existing')).toBe('1');
  expect(redirect.searchParams.get('code')).toBe('test-user;test-session');
  expect(redirect.searchParams.get('state')).toBe('original +&=state');
  expect(redirect.searchParams.get('iss')).toBe('https://app.powerplanner.net');
});

it('returns access_denied and state to the validated callback when canceled', async () => {
  await render();
  await clickButton('Cancel');
  const redirect = new URL(window.location.href);
  expect(redirect.searchParams.get('error')).toBe('access_denied');
  expect(redirect.searchParams.get('state')).toBe('original +&=state');
  expect(redirect.searchParams.get('iss')).toBe('https://app.powerplanner.net');
  expect(redirect.searchParams.has('code')).toBe(false);
  expect(Api.logInAsync).not.toHaveBeenCalled();
});

it('displays invalid metadata locally without exposing a login form or redirecting', async () => {
  global.fetch.mockResolvedValue({ status: 200, json: async () => ({
    client_id: clientId,
    redirect_uris: ['https://different.example/callback']
  }) });
  await render();
  expect(document.querySelector('[role="alert"]').textContent).toContain('exactly match');
  expect(document.getElementById('username')).toBeNull();
  expect(new URL(window.location.href).hostname).toBe('app.powerplanner.net');
});

it('keeps failed logins on the authorization page and does not redirect', async () => {
  Api.logInAsync.mockResolvedValue({ Error: 'Invalid username or password' });
  await render();
  act(() => {
    Simulate.change(document.getElementById('username'), { target: { value: 'test-user' } });
    Simulate.change(document.getElementById('password'), { target: { value: 'wrong-password' } });
  });
  await clickButton('Log In and Authorize');
  expect(document.body.textContent).toContain('Invalid username or password');
  expect(AccountHelper.setLoginCookies).not.toHaveBeenCalled();
  expect(new URL(window.location.href).hostname).toBe('app.powerplanner.net');
});

it('preserves the authorization request through account recovery', async () => {
  await render();
  const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent === 'Forgot Password');
  expect(link.getAttribute('href')).toBe('/authorize/forgot-password' + search);
  await act(async () => { history.push(link.getAttribute('href')); });
  expect(document.body.textContent).toContain('FORGOT PASSWORD');
  await act(async () => { NavigationHelper.goBack(); });
  expect(document.body.textContent).toContain('Example Client');
  expect(history.location.search).toBe(search);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
