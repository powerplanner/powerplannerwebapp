import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { PopupDialogBaseProps } from '../../PopupDialog/PopupDialogBase';
import TextField from '@material-ui/core/TextField';
import { ViewItemSemester } from 'models/viewItems';
import { AddEditDialog } from '../AddEditDialog';
import { observer } from 'mobx-react';
import DeleteItemDialog from '../DeleteItemDialog';
import TextFieldHelpers from 'helpers/textFieldHelpers';

export interface AddSemesterDialogShellProps extends PopupDialogBaseProps {
  onSave?: (data:AddSemesterDialogShellFormState) => Promise<boolean>;
  onDeleteSemester?: () => Promise<boolean>;
}

export interface AddSemesterDialogShellFormState {
  name: string;
  confirmDeleteOpen: boolean;
}

// The {} represents the state
@observer
class AddSemesterDialogShell extends AddEditDialog<ViewItemSemester, AddSemesterDialogShellProps, AddSemesterDialogShellFormState> {

  getItemTitle() {
    return "SEMESTER";
  }

  createDefaultFormState() : AddSemesterDialogShellFormState {
    if (this.props.itemToEdit) {
      return {
        name: this.props.itemToEdit.name,
        confirmDeleteOpen: false
      };
    } else {
      return {
        name: "",
        confirmDeleteOpen: false
      };
    }
  }

  getMoreActions = () => {
    if (this.props.itemToEdit) {
      return [{
        title: "Delete semester",
        action: () => this.setFormState({confirmDeleteOpen: true})
      }];
    } else {
      return [];
    }
  }
  
  handleDeleteSemester = async () => {
    if (this.props.onDeleteSemester) {
      return await this.props.onDeleteSemester();
    }
    return false;
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

        <DeleteItemDialog
          title="Delete semester?"
          body="Are you sure you want to delete this semester and all of its classes, tasks, events, and grades?"
          open={this.formState.confirmDeleteOpen}
          onClose={() => this.setFormState({confirmDeleteOpen: false})}
          onDelete={this.handleDeleteSemester}/>
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

    if (this.props.onSave) {
      return await this.props.onSave(this.formState);
    }

    await new Promise((resolve) => setTimeout(resolve,2000));
    return false;
  }
}
  
export default AddSemesterDialogShell;