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
  redirect?: string
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

    if (this.props.redirect) {
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
    return "LOG IN";
  }

  renderContent() {
    const { classes } = this.props;

    return (
      <form className={classes.root}>
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
          <Button color="primary" disabled={this.state.signingIn} component={RouteLink} to="/login/login/forgot-username">Forgot Username</Button> |
          <Button color="primary"disabled={this.state.signingIn} component={RouteLink} to="/login/login/forgot-password">Forgot Password</Button>
        </div>
      </form>
    );
  }

  renderActions() {
    return (
      <LoadingButton onClick={this.logIn} loading={this.state.signingIn} success={this.state.signedIn}>Log In</LoadingButton>
    );
  }
}
  
export default withStyles(styles)(LogInDialog);