export interface AuthorizationRequest {
  clientId: string;
  clientName: string;
  redirectUri: string;
  state: string;
  scope: string | null;
}

function requireHttpsUrl(value: string, name: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || value.indexOf("#") !== -1) {
    throw new Error(name + " must be an HTTPS URL without credentials or a fragment.");
  }
  return url;
}

export async function loadAuthorizationRequest(search: string, signal: AbortSignal): Promise<AuthorizationRequest> {
  const params = new URLSearchParams(search);
  ["client_id", "redirect_uri", "response_type", "state", "scope", "response_mode"].forEach(name => {
    if (params.getAll(name).length > 1) {
      throw new Error("Duplicate authorization parameter: " + name);
    }
  });
  if (params.get("response_type") !== "code") {
    throw new Error("Only response_type=code is supported.");
  }
  if (params.has("response_mode") && params.get("response_mode") !== "query") {
    throw new Error("Only response_mode=query is supported.");
  }

  const clientId = params.get("client_id");
  const redirectUri = params.get("redirect_uri");
  if (!clientId || !redirectUri) {
    throw new Error("client_id and redirect_uri are required.");
  }
  const clientUrl = requireHttpsUrl(clientId, "client_id");
  const rawPath = clientId.substring(clientId.indexOf("/", 8)).split("?")[0];
  if (clientId.indexOf("\\") !== -1 || clientUrl.pathname === "/" || rawPath.split("/").some(part => {
    const decoded = decodeURIComponent(part);
    return decoded === "." || decoded === "..";
  })) {
    throw new Error("client_id must include a document path without dot segments.");
  }
  requireHttpsUrl(redirectUri, "redirect_uri");

  const metadataUrl = new URL("https://powerplanner.net/api/oauthclientmetadata");
  metadataUrl.searchParams.set("client_id", clientId);

  let response: Response;
  try {
    response = await fetch(metadataUrl.href, {
      signal,
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
      headers: { Accept: "text/plain" }
    });
  } catch (error) {
    if (signal.aborted) {
      throw error;
    }
    throw new Error("Unable to load client metadata from the Power Planner server. Please try again.");
  }
  if (response.status !== 200) {
    throw new Error("Unable to load client metadata (HTTP " + response.status + ").");
  }

  const metadata: unknown = await response.json();
  if (typeof metadata !== "object" || metadata === null ||
      !("client_id" in metadata) || metadata.client_id !== clientId) {
    throw new Error("Client metadata must contain a client_id matching the requested URL exactly.");
  }
  if (!("redirect_uris" in metadata) || !Array.isArray(metadata.redirect_uris) ||
      !metadata.redirect_uris.every((uri: unknown) => typeof uri === "string") ||
      metadata.redirect_uris.indexOf(redirectUri) === -1) {
    throw new Error("redirect_uri must exactly match a registered redirect_uris entry.");
  }
  let supportsPublicClient = !("token_endpoint_auth_method" in metadata) || metadata.token_endpoint_auth_method === "none";
  if ("token_endpoint_auth_methods_supported" in metadata) {
    const methods = metadata.token_endpoint_auth_methods_supported;
    if (!Array.isArray(methods) || !methods.every((method: unknown) => typeof method === "string")) {
      throw new Error("Client metadata token_endpoint_auth_methods_supported must be an array of strings.");
    }
    supportsPublicClient = methods.indexOf("none") !== -1;
  }
  if (!supportsPublicClient || "client_secret" in metadata || "client_secret_expires_at" in metadata) {
    throw new Error("Only public clients using token_endpoint_auth_method=none are supported.");
  }
  let clientName = clientUrl.hostname;
  if ("client_name" in metadata) {
    if (typeof metadata.client_name !== "string" || !metadata.client_name.trim()) {
      throw new Error("Client metadata client_name must be a non-empty string.");
    }
    clientName = metadata.client_name;
  }
  return {
    clientId,
    clientName,
    redirectUri,
    state: params.get("state") ?? "",
    scope: params.get("scope")
  };
}

export function createAuthorizationRedirect(redirectUri: string, state: string, username: string, session: string) {
  const url = new URL(redirectUri);
  url.searchParams.set("code", username + ";" + session);
  url.searchParams.set("state", state);
  return url.href;
}
