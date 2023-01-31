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
  results: {
    marginTop: '12px'
  }
});

export interface ForgotPasswordDialogProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
}

interface ForgotPasswordDialogState extends PopupDialogBaseState {
  username: string,
  email: string,
  resetting: boolean,
  successMessage?: string,
  error: string | null
}

// The {} represents the state
class ForgotPasswordDialog extends PopupDialogBase<ForgotPasswordDialogProps, ForgotPasswordDialogState> {
  state: ForgotPasswordDialogState = {
    username: "",
    email: "",
    resetting: false,
    error: null
  };
  
  constructor(props: Readonly<ForgotPasswordDialogProps>) {
    super(props);
    this.reset = this.reset.bind(this);
  }

  async reset() {
    if (this.state.username.length == 0) {
      this.goToErrorState("You must enter your username!");
      return;
    }

    if (this.state.email.length == 0) {
      this.goToErrorState("You must enter your email address!");
      return;
    }

    this.goToResettingState();

    try
    {
      var response = await Api.resetPasswordAsync(this.state.username, this.state.email);
      if (response.Error) {
        this.goToErrorState(response.Error);
      } else {
        // Success!
        this.goToResetState(response.Message);
      }
    } catch (err: any) {
      this.goToErrorState(err.toString());
    }
  }

  goToResettingState() {
    this.setState({
      resetting: true,
      error: null,
      disabled: true
    });
  }

  goToResetState(message:string) {
    this.setState({
      resetting: false,
      successMessage: message,
      error: null,
      disabled: false
    });
  }

  goToErrorState(error: string) {
    this.setState({
      resetting: false,
      error: error,
      disabled: false
    });
  }

  getTitle() {
    return "FORGOT PASSWORD";
  }

  renderContent() {
    const { classes } = this.props;

    if (this.state.successMessage) {
      return <Typography style={{whiteSpace: "pre-wrap"}}>{this.state.successMessage}</Typography>
    }

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
          disabled={this.state.resetting}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <TextField
          id="email"
          label="Email"
          className={classes.textField}
          margin="normal"
          fullWidth={true}
          disabled={this.state.resetting}
          onKeyPress={TextFieldHelpers.onEnter.bind(this, this.reset)}
          onChange={(e) => this.setState({ email: e.target.value })}
        />
      </form>
    );
  }

  renderActions() {
    if (this.state.successMessage) {
      return null;
    }
    return (
      <LoadingButton onClick={this.reset} loading={this.state.resetting}>Reset password</LoadingButton>
    );
  }
}
  
export default withStyles(styles)(ForgotPasswordDialog);