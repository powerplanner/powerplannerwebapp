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
import GlobalState from 'models/globalState';
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

export interface AddTaskDialogShellProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
  taskType: PowerItemType;
  availableClasses: ViewItemClass[];
  onSave?: (data:AddTaskDialogShellFormState) => Promise<boolean>;
}

export interface AddTaskDialogShellFormState {
  name: string;
  details: string;
  selectedDate: Moment;
  selectedClass: ViewItemClass;
}

// The {} represents the state
@observer
class AddTaskDialogShell extends AddEditDialog<ViewItemMegaItem, AddTaskDialogShellProps, AddTaskDialogShellFormState> {

  getItemTitle() {
    return this.props.taskType === PowerItemType.Homework ? "TASK" : "EVENT";
  }

  createDefaultFormState() : AddTaskDialogShellFormState {
    if (this.props.itemToEdit) {
      return {
        name: this.props.itemToEdit.name,
        details: this.props.itemToEdit.details!,
        selectedDate: this.props.itemToEdit.date!,
        selectedClass: this.props.itemToEdit.class
      };
    } else {
      return {
        name: "",
        details: "",
        selectedDate: GlobalState.getNewTaskDate(),
        selectedClass: this.semesterState.classes[0]
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

        <DatePicker
          fullWidth
          disabled={this.disabled}
          margin="normal"
          label="Date"
          value={this.formState.selectedDate}
          onChange={d => this.setFormState({selectedDate: d!})}/>

        <FormControl fullWidth margin="normal">
          <InputLabel id="classLabel">Class</InputLabel>
          <Select
            id="class"
            labelId="classLabel"
            margin="none"
            disabled={this.disabled}
            value={this.formState.selectedClass.identifier.toString()}
            onChange={e => this.setFormState({selectedClass: this.props.availableClasses.find(i => i.identifier.toString() === e.target.value)!})}>
            {this.props.availableClasses.map(i => (
              <MenuItem key={i.identifier.toString()} value={i.identifier.toString()}>{i.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoComplete="off"
          id="details"
          label="Details"
          margin="normal"
          value={this.formState.details}
          fullWidth={true}
          disabled={this.disabled}
          multiline
          onChange={e => this.setFormState({details: e.target.value})}
        />
      </>
    );
  }

  @computed get loading() {
    if (this.props.itemToEdit) {
      return this.props.itemToEdit.isLoading;
    } else {
      return false;
    }
  }

  async saveAsync() {
    if (this.formState.name.length === 0) {
      alert("You must enter a name");
      return false;
    }
    if (this.props.onSave) {
      return await this.props.onSave(this.formState);
    }

    await new Promise((resolve) => setTimeout(resolve,2000));
    return false;
  }
}
  
export default withStyles(styles)(AddTaskDialogShell);