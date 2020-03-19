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
import { IconButton, Grid, Slider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import GlobalState from 'models/globalState';
import DeleteButtonWithQuickConfirm from '../DeleteButtonWithQuickConfirm';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme: Theme) => createStyles({
  loadingProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  percentCompleteSlider: {
    marginTop: theme.spacing(3)
  },
  completeButton: {
    colorPrimary: "green"
  }
});

export interface ViewTaskDialogShellProps extends PopupDialogBaseProps, WithStyles<typeof styles> {
  task?: ViewItemMegaItem,
  loaded: boolean,
  taskType: PowerItemType,
  handleDelete?: () => void,
  savePercentComplete?: (newPercentComplete:number) => Promise<boolean>
}

interface ViewTaskDialogShellState extends PopupDialogBaseState {
  percentComplete?: number,
  saving?: boolean
}

// The {} represents the state
@observer
class ViewTaskDialogShell extends PopupDialogBase<ViewTaskDialogShellProps, ViewTaskDialogShellState> {
  constructor(props: Readonly<ViewTaskDialogShellProps>) {
    super(props);

    if (props.taskType === PowerItemType.Homework && props.task) {
      this.state = {
        percentComplete: props.task.percentComplete
      };
    } else {
      this.state = {};
    }
  }

  getTitle() {
    return "VIEW " + (this.props.taskType == PowerItemType.Exam ? "EVENT" : "TASK");
  }

  handleDelete = () => {
    if (this.props.handleDelete) {
      this.props.handleDelete();
    }
  }

  getAdditionalIcons() {
    return (
      <>
        <IconButton color="inherit" disabled={this.disabled || this.props.task === undefined} component={Link} to={`${this.props.task?.identifier}/edit`}>
          <EditIcon />
        </IconButton>
        <DeleteButtonWithQuickConfirm disabled={this.disabled || this.props.task === undefined} onDelete={this.handleDelete}/>
      </>
    );
  }

  onPercentCompleteChange = (event:any, newValue:any) => {
    this.setState({
      percentComplete: newValue / 100
    });
  }

  onPercentCompleteChangeCommitted = async (event:any, newValue:any) => {
    if (this.props.task) {
      const newPercentComplete = newValue / 100;
      if (this.props.task.percentComplete !== newPercentComplete) {
        this.setState({
          saving: true
        });

        if (this.props.savePercentComplete) {
          if (!await this.props.savePercentComplete(newPercentComplete)) {
            this.setState({
              percentComplete: this.props.task.percentComplete
            });
          }
        }

        this.setState({
          saving: false
        });
      }
    }
  }

  setPercentComplete = (newValue:number) => {
    this.setState({
      percentComplete: newValue
    });
    this.onPercentCompleteChangeCommitted(undefined, newValue * 100);
  }

  renderContent() {
    const { classes, task } = this.props;

    return (
      <div style={{
        minHeight: 36
      }}>
        {task && (
          <div style={{opacity: this.props.loaded || !this.state.saving ? 1 : 0.5}}>
          <Typography variant="h6">
            {task.name}
          </Typography>
          <Typography component="p" style={{
                color: task.class.color,
                fontWeight: 'bold'
              }}>
                {task.subtitle}
              </Typography>
          {task.hasDetails && (
          <Typography component="p" style={{whiteSpace: "pre-wrap"}}>
            {task.details}
          </Typography>
          )}
          {this.state.percentComplete !== undefined && (
            <Grid container spacing={1} className={classes.percentCompleteSlider}>
              <Grid item>
                <IconButton size="small" style={{color: this.state.percentComplete <= 0 ? "red" : undefined}} onClick={() => this.setPercentComplete(0)}>
                  <CancelIcon/>
                </IconButton>
              </Grid>
              <Grid item xs>
                <Slider disabled={this.state.saving} value={this.state.percentComplete * 100} onChange={this.onPercentCompleteChange} onChangeCommitted={this.onPercentCompleteChangeCommitted}/>
              </Grid>
              <Grid item>
                <IconButton size="small" style={{color: this.state.percentComplete >= 1 ? "green" : undefined}} onClick={() => this.setPercentComplete(1)}>
                  <CheckCircleIcon/>
                </IconButton>
              </Grid>
            </Grid>
          )}
          </div>
        )}
        {!this.props.loaded || this.state.saving && <CircularProgress size={24} className={classes.loadingProgress} />}
      </div>
    );
  }
}
  
export default withStyles(styles)(ViewTaskDialogShell);