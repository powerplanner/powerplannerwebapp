import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { PopupDialogBase, PopupDialogBaseProps, PopupDialogBaseState } from '../../PopupDialog/PopupDialogBase';
import TextField from '@material-ui/core/TextField';
import LoadingButton from '../../LoadingButton';
import Api from 'api';
import AccountHelper from "helpers/accountHelper";
import NavigationHelper from "helpers/navigationHelper";
import GlobalState from 'models/globalState';
import TextFieldHelpers from 'helpers/textFieldHelpers';
import { Link as RouteLink } from "react-router-dom";
import { AuthorizationRequest, createAuthorizationRedirect } from 'helpers/oauthHelper';

const styles = (theme: Theme) => createStyles({
  root: {
  },
  textField: {
  },
  forgotContainer: {
    textAlign: 'right',
    marginTop: '12px'
  }
});

export interface LogInDialogProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
  redirect?: string,
  state?: string,
  authorization?: AuthorizationRequest
}

interface LogInDialogState extends PopupDialogBaseState {
  username: string,
  password: string,
  signingIn: boolean,
  signedIn: boolean,
  error: string | null
}

// The {} represents the state
class LogInDialog extends PopupDialogBase<LogInDialogProps, LogInDialogState> {
  state: LogInDialogState = {
    username: "",
    password: "",
    signingIn: false,
    signedIn: false,
    error: null
  };
  
  constructor(props: Readonly<LogInDialogProps>) {
    super(props);
    this.navigateBackOnClose = false;
    this.logIn = this.logIn.bind(this);
  }

  async logIn() {
    if (this.state.username.length == 0) {
      this.goToErrorState("You must enter a username!");
      return;
    }
    
    if (this.state.password.length == 0) {
      this.goToErrorState("You must enter a password!");
      return;
    }

    this.goToSigningInState();

    try
    {
      var username = this.state.username;
      var response = await Api.logInAsync(username, this.state.password);
      if (response.Error) {
        this.goToErrorState(response.Error);
      } else {
        // Success!
        this.goToSignedInState();

        // Set the cookies
        AccountHelper.setLoginCookies(
          response.AccountId,
          username,
          response.Session
        );

        this.finishLogin();
      }
    } catch (err: any) {
      this.goToErrorState(err.toString());
    }
  }

  finishLogin() {

    if (this.props.authorization) {
      const request = this.props.authorization;
      const acct = AccountHelper.getAccountCredentials();
      const redirect = new URL(createAuthorizationRedirect(request.redirectUri, request.state, acct.username, acct.session));
      redirect.searchParams.set("iss", "https://powerplanner.net");
      window.location.href = redirect.href;
      return;
    }

    if (this.props.redirect) {
      if (this.props.redirect.startsWith("https://chat.openai.com/")) {
        var acct = AccountHelper.getAccountCredentials();
        window.location.href = createAuthorizationRedirect(this.props.redirect, this.props.state ?? "", acct.username, acct.session);
        return;
      }
      window.location.href = this.props.redirect;
      return;
    }

    // And navigate to the main app!
    GlobalState.updateMainState();
    NavigationHelper.goToMain();
  }

  goToDefaultState() {
    this.setState({
      signingIn: false,
      signedIn: false,
      error: null,
      disabled: false
    });
  }

  goToSigningInState() {
    this.setState({
      signingIn: true,
      signedIn: false,
      error: null,
      disabled: true
    });
  }

  goToSignedInState() {
    this.setState({
      signingIn: false,
      signedIn: true,
      error: null,
      disabled: true
    });
  }

  goToErrorState(error: string) {
    this.setState({
      signingIn: false,
      signedIn: false,
      error: error,
      disabled: false
    });
  }

  getTitle() {
    return this.props.authorization ? "POWER PLANNER: AUTHORIZE APP" : "LOG IN";
  }

  renderContent() {
    const { classes } = this.props;
    const authorization = this.props.authorization;
    const recoveryLink = (page: string) => authorization
      ? { pathname: "/authorize/" + page, search: window.location.search }
      : { pathname: "/login/login/" + page };

    return (
      <form className={classes.root}>
        {authorization &&
          <div>
            <Typography paragraph>
              <strong>{authorization.clientName} ({new URL(authorization.clientId).hostname})</strong> is requesting access to your Power Planner account.
              Log in and authorize only if you trust {authorization.clientName} and want it to receive access to your Power Planner account data.
            </Typography>
          </div>
        }
        {this.state.error &&
          <Typography variant="body1" color="error">
            {this.state.error}
          </Typography>
        }
        <TextField
          autoFocus
          id="username"
          label="Username"
          className={classes.textField}
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          className={classes.textField}
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onKeyPress={TextFieldHelpers.onEnter.bind(this, this.logIn)}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <div className={classes.forgotContainer}>
          <Button color="primary" disabled={this.state.signingIn} component={RouteLink} to={recoveryLink("forgot-username")}>Forgot Username</Button> |
          <Button color="primary"disabled={this.state.signingIn} component={RouteLink} to={recoveryLink("forgot-password")}>Forgot Password</Button>
        </div>
      </form>
    );
  }

  renderActions() {
    return (
      <>
        {this.props.authorization &&
          <Button onClick={this.onClose} disabled={this.state.signingIn}>Cancel</Button>
        }
        <LoadingButton onClick={this.logIn} loading={this.state.signingIn} success={this.state.signedIn}>
          {this.props.authorization ? "Log In and Authorize" : "Log In"}
        </LoadingButton>
      </>
    );
  }
}
  
export default withStyles(styles)(LogInDialog);