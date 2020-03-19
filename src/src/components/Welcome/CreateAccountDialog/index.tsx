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

export interface CreateAccountDialogProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
  redirect?: string
}

interface CreateAccountDialogState extends PopupDialogBaseState {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  creatingAccount: boolean,
  createdAccount: boolean,
  error: string | null
}

const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

// The {} represents the state
class CreateAccountDialog extends PopupDialogBase<CreateAccountDialogProps, CreateAccountDialogState> {
  state: CreateAccountDialogState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    creatingAccount: false,
    createdAccount: false,
    error: null
  };
  
  constructor(props: Readonly<CreateAccountDialogProps>) {
    super(props);
    this.navigateBackOnClose = false;
    this.createAccount = this.createAccount.bind(this);
  }

  async createAccount() {
    if (this.state.username.length == 0) {
      this.goToErrorState("You must enter a username!");
      return;
    }
    
    if (this.state.email.length == 0) {
      this.goToErrorState("You must enter an email!");
      return;
    }

    if (!emailRegex.test(this.state.email)) {
      this.goToErrorState("Invalid email address");
      return;
    }
    
    if (this.state.password.length == 0) {
      this.goToErrorState("You must enter a password!");
      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.goToErrorState("Your confirm password did not match your password");
    }

    this.goToCreatingAccountState();

    try
    {
      var username = this.state.username;
      var response = await Api.createAccountAsync(username, this.state.email, this.state.password);
      if (response.Error) {
        this.goToErrorState(response.Error);
      } else {
        // Success!
        this.goToCreatedAccountState();

        // Set the cookies
        AccountHelper.setLoginCookies(
          response.AccountId,
          username,
          response.Session
        );

        // And navigate to the main app!
        this.finishCreateAccount();
      }
    } catch (err) {
      this.goToErrorState(err.toString());
    }
  }

  finishCreateAccount() {

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
      creatingAccount: false,
      createdAccount: false,
      error: null,
      disabled: false
    });
  }

  goToCreatingAccountState() {
    this.setState({
      creatingAccount: true,
      createdAccount: false,
      error: null,
      disabled: true
    });
  }

  goToCreatedAccountState() {
    this.setState({
      creatingAccount: false,
      createdAccount: true,
      error: null,
      disabled: true
    });
  }

  goToErrorState(error: string) {
    this.setState({
      creatingAccount: false,
      createdAccount: false,
      error: error,
      disabled: false
    });
  }

  getTitle() {
    return "CREATE ACCOUNT";
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
          fullWidth
          disabled={this.state.creatingAccount}
          onChange={(e) => this.setState({ username: e.target.value })}/>
        <TextField
          id="email"
          label="Email"
          type="email"
          className={classes.textField}
          margin="normal"
          fullWidth
          disabled={this.state.creatingAccount}
          onChange={(e) => this.setState({ email: e.target.value })}/>
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          className={classes.textField}
          margin="normal"
          fullWidth
          disabled={this.state.creatingAccount}
          onChange={(e) => this.setState({ password: e.target.value })}/>
        <TextField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          className={classes.textField}
          margin="normal"
          fullWidth
          onKeyPress={TextFieldHelpers.onEnter.bind(this, this.createAccount)}
          disabled={this.state.creatingAccount}
          onChange={(e) => this.setState({ confirmPassword: e.target.value })}/>
      </form>
    );
  }

  renderActions() {
    return (
      <LoadingButton onClick={this.createAccount} loading={this.state.creatingAccount} success={this.state.createdAccount}>Create account</LoadingButton>
    );
  }
}
  
export default withStyles(styles)(CreateAccountDialog);