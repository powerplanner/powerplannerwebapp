import PopupDialog from '../PopupDialog';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import * as React from 'react';
import NavigationHelper from 'helpers/navigationHelper';

export interface PopupDialogBaseProps {
  open: boolean,
  onClose?: Function
}

export interface PopupDialogBaseState {
  disabled?: boolean
}

export abstract class PopupDialogBase<P extends PopupDialogBaseProps, S extends PopupDialogBaseState> extends React.Component<P, S> {
  
  abstract getTitle() : string;
  abstract renderContent() : React.ReactNode;
  renderActions() : React.ReactNode {
    return null;
  }

  get disabled() : boolean {
    if (this.state.disabled) {
      return true;
    }
    return false;
  }

  set disabled(value: boolean) {
    this.setState({ disabled: value });
  }

  navigateBackOnClose:boolean = true;

  onClose = () => {
    if (this.navigateBackOnClose) {
      NavigationHelper.goBack();
    }
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  getAdditionalIcons() : React.ReactNode | undefined {
    return undefined;
  }
  
  render() {
    const { open } = this.props;

    return (
      <PopupDialog
        title={this.getTitle()}
        open={open}
        onClose={this.onClose}
        actions={this.renderActions()}
        disabled={this.state.disabled}
        additionalIcons={this.getAdditionalIcons()}>
        <div style={{
          position: "relative"
        }}>
          {this.renderContent()}
        </div>
      </PopupDialog>
    )
  }
}