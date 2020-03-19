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
import { BaseViewItemTaskEvent, ViewItemMegaItem } from 'models/viewItems';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PowerItemType } from 'api/enums';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import GlobalState from 'models/globalState';
import DeleteButtonWithQuickConfirm from '../DeleteButtonWithQuickConfirm';
import DeleteItemDialog from '../DeleteItemDialog';



// The {} represents the state
class MyAccount extends PopupDialogBase<PopupDialogBaseProps, PopupDialogBaseState & {
  confirmDeleteOpen: boolean
}> {
  
  constructor(props: Readonly<PopupDialogBaseProps>) {
    super(props);
    this.state = {
      confirmDeleteOpen: false
    };
  }

  getTitle() {
    return "MY ACCOUNT";
  }

  logOut() {
    GlobalState.logOut();
  }

  async handleDelete() {
    try {
      const resp = await Api.deleteAccountAsync();
      if (resp.Error) {
        alert(resp.Error);
        return false;
      }
      GlobalState.logOut();
      return true;
    } catch {
      alert("Unknown error");
      return false;
    }
  }

  renderContent() {

    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.logOut}>Log out</Button>
        <Button variant="contained" color="primary" onClick={() => this.setState({confirmDeleteOpen: true})} style={{display: "block", marginTop: "12px"}}>Delete account</Button>
        
        <DeleteItemDialog
          title="Delete account?"
          body="Are you sure you want to delete your account? This action is permanent."
          open={this.state.confirmDeleteOpen}
          onClose={() => this.setState({confirmDeleteOpen: false})}
          onDelete={this.handleDelete}/>
      </div>
    );
  }
}
  
export default MyAccount;