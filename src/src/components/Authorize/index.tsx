import * as React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import PopupDialog from 'components/PopupDialog';
import LogInDialog from 'components/Welcome/LogInDialog';
import ForgotUsernameDialog from 'components/Welcome/ForgotUsernameDialog';
import ForgotPasswordDialog from 'components/Welcome/ForgotPasswordDialog';
import { AuthorizationRequest, loadAuthorizationRequest } from 'helpers/oauthHelper';

const Authorize = () => {
  const location = useLocation();
  const history = useHistory();
  const [result, setResult] = React.useState<{
    search: string;
    request?: AuthorizationRequest;
    error?: string;
  }>();

  React.useEffect(() => {
    const controller = new AbortController();
    loadAuthorizationRequest(location.search, controller.signal).then(
      request => {
        if (!controller.signal.aborted) {
          setResult({ search: location.search, request });
        }
      },
      error => {
        if (!controller.signal.aborted) {
          setResult({ search: location.search, error: error instanceof Error ? error.message : String(error) });
        }
      }
    );
    return () => controller.abort();
  }, [location.search]);

  if (!result || result.search !== location.search) {
    return (
      <PopupDialog open title="AUTHORIZE APPLICATION">
        <CircularProgress size={24} />
        <Typography>Loading client information...</Typography>
      </PopupDialog>
    );
  }
  if (!result.request) {
    return (
      <PopupDialog open title="UNABLE TO AUTHORIZE" onClose={() => history.push("/login")}>
        <Typography color="error" role="alert">{result.error}</Typography>
      </PopupDialog>
    );
  }

  const request = result.request;
  const cancel = () => {
    const redirect = new URL(request.redirectUri);
    redirect.searchParams.set("error", "access_denied");
    redirect.searchParams.set("state", request.state);
    redirect.searchParams.set("iss", "https://powerplanner.net");
    window.location.href = redirect.href;
  };
  if (location.pathname === "/authorize/forgot-username") {
    return <ForgotUsernameDialog open />;
  }
  if (location.pathname === "/authorize/forgot-password") {
    return <ForgotPasswordDialog open />;
  }
  return <LogInDialog key={location.search} open authorization={request} onClose={cancel} />;
};

export default Authorize;
