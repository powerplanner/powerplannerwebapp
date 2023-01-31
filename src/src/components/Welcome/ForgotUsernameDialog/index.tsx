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

export interface ForgotUsernameDialogProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
}

interface ForgotUsernameDialogState extends PopupDialogBaseState {
  email: string,
  checking: boolean,
  usernames: string[],
  error: string | null
}

// The {} represents the state
class ForgotUsernameDialog extends PopupDialogBase<ForgotUsernameDialogProps, ForgotUsernameDialogState> {
  state: ForgotUsernameDialogState = {
    email: "",
    checking: false,
    usernames: [],
    error: null
  };
  
  constructor(props: Readonly<ForgotUsernameDialogProps>) {
    super(props);
    this.recover = this.recover.bind(this);
  }

  async recover() {
    if (this.state.email.length == 0) {
      this.goToErrorState("You must enter an email address!");
      return;
    }

    this.goToCheckingState();

    try
    {
      var response = await Api.forgotUsernameAsync(this.state.email);
      if (response.Error) {
        this.goToErrorState(response.Error);
      } else {
        // Success!
        this.goToCheckedState(response.Usernames);
      }
    } catch (err: any) {
      this.goToErrorState(err.toString());
    }
  }

  goToCheckingState() {
    this.setState({
      checking: true,
      error: null,
      disabled: true
    });
  }

  goToCheckedState(usernames:string[]) {
    this.setState({
      checking: false,
      usernames: usernames,
      error: null,
      disabled: false
    });
  }

  goToErrorState(error: string) {
    this.setState({
      checking: false,
      usernames: [],
      error: error,
      disabled: false
    });
  }

  getTitle() {
    return "FORGOT USERNAME";
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
          id="email"
          label="Email"
          className={classes.textField}
          margin="normal"
          fullWidth={true}
          disabled={this.state.checking}
          onKeyPress={TextFieldHelpers.onEnter.bind(this, this.recover)}
          onChange={(e) => this.setState({ email: e.target.value })}
        />
        <div className={classes.results}>
          {this.state.usernames.map((u, i) => (
            <Typography key={i}>{u}</Typography>
          ))}
        </div>
      </form>
    );
  }

  renderActions() {
    return (
      <LoadingButton onClick={this.recover} loading={this.state.checking}>Recover</LoadingButton>
    );
  }
}
  
export default withStyles(styles)(ForgotUsernameDialog);