import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { PopupDialogBase, PopupDialogBaseProps, PopupDialogBaseState } from '../../PopupDialog/PopupDialogBase';
import TextField from '@material-ui/core/TextField';
import Select from "@material-ui/core/Select";
import LoadingButton from '../../LoadingButton';
import Api from 'api';
import AccountHelper from "helpers/accountHelper";
import NavigationHelper from "helpers/navigationHelper";
import { BaseViewItemTaskEvent, ViewItemClass, ViewItemMegaItem } from 'models/viewItems';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PowerItemType } from 'api/enums';
import { Moment } from 'moment';
import { MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { AddEditDialog } from '../AddEditDialog';
import * as moment from "moment";
import { computed } from 'mobx';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { observer } from 'mobx-react';
import ColorPicker from 'components/ColorPicker';
import TextFieldHelpers from 'helpers/textFieldHelpers';

const styles = (theme: Theme) => createStyles({
  loadingProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
});

export interface AddClassDialogShellProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
  onSave?: (data:AddClassDialogShellFormState) => Promise<boolean>;
}

export interface AddClassDialogShellFormState {
  name: string;
  color?: string;
}

// The {} represents the state
@observer
class AddClassDialogShell extends AddEditDialog<ViewItemClass, AddClassDialogShellProps, AddClassDialogShellFormState> {

  getItemTitle() {
    return "CLASS";
  }

  createDefaultFormState() : AddClassDialogShellFormState {
    if (this.props.itemToEdit) {
      return {
        name: this.props.itemToEdit.name,
        color: this.props.itemToEdit.color
      };
    } else {
      return {
        name: "",
        color: undefined
      };
    }
  }

  renderForm = () => {
    return (
      <>
        <TextField
          autoComplete="off"
          autoFocus={this.props.itemToEdit === undefined}
          id="name"
          label="Name"
          margin="normal"
          value={this.formState.name}
          fullWidth={true}
          disabled={this.disabled}
          onKeyPress={TextFieldHelpers.onEnter.bind(this, this.handleSave)}
          onChange={e => this.setFormState({name: e.target.value})}
        />

        <ColorPicker
          selectedColor={this.formState.color}
          onChange={c => this.setFormState({color: c})}/>
      </>
    );
  }

  get loading() {
    return false;
  }

  async saveAsync() {
    if (this.formState.name.length === 0) {
      alert("You must enter a name");
      return false;
    }
    if (this.formState.color === undefined) {
      alert("You must select a color");
      return false;
    }

    if (this.props.onSave) {
      return await this.props.onSave(this.formState);
    }

    await new Promise((resolve) => setTimeout(resolve,2000));
    return false;
  }
}
  
export default withStyles(styles)(AddClassDialogShell);