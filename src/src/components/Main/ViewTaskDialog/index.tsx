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
import { BaseViewItemTaskEvent, ViewItemTask, ViewItemMegaItem } from 'models/viewItems';
import { Guid } from 'guid-typescript';
import ViewTaskDialogShell from "./ViewTaskDialogShell";
import { RouteComponentProps } from 'react-router';
import { PowerItemType } from 'api/enums';
import { SemesterState } from 'models/SemesterState';
import { IStatefulWithIdComponentProps, StatefulWithIdComponent } from "components/StatefulComponent";
import { observer } from 'mobx-react';
import GlobalState from "models/globalState";

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

export interface ViewTaskDialogProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
  task: ViewItemMegaItem;
}

// The {} represents the state
@observer
class ViewTaskDialog extends React.Component<ViewTaskDialogProps> {
  
  constructor(props: ViewTaskDialogProps) {
    super(props);
    props.task.loadFullIfNeeded();
  }

  handleDelete = async () => {
    this.props.task.class.removeMegaItem(this.props.task);
    NavigationHelper.goBack();

    var resp = await Api.modifyAsync({
      deletes: [this.props.task.identifier]
    });
    if (resp.Error) {
      alert(resp.Error);
      // Add it back
      this.props.task.class.megaItems.push(this.props.task);
    }
  }

  savePercentComplete = async (newPercentComplete:number) => {
    try {
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: this.props.task.identifier,
          itemType: PowerItemType.MegaItem,
          percentComplete: newPercentComplete
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      } else {
        this.props.task.percentComplete = newPercentComplete;
        if (newPercentComplete >= 1) {
          NavigationHelper.goBack();
        }
        return true;
      }
    } catch {
      return false;
    }
  }
  
  render() {
    return (
      <ViewTaskDialogShell
        task={this.props.task}
        loaded={true}
        taskType={this.props.task.isTask ? PowerItemType.Homework : PowerItemType.Exam}
        open={this.props.open}
        handleDelete={this.handleDelete}
        savePercentComplete={this.savePercentComplete}/>
    );
  }
}
  
export default withStyles(styles)(ViewTaskDialog);