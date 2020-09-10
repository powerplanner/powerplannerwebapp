import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TaskCompletionBar from "./TaskCompletionBar";
import { BaseViewItemTaskEvent, ViewItemMegaItem } from 'models/viewItems';
import NavigationHelper from 'helpers/navigationHelper';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingLeft: 12,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: "flex",
    position: 'relative',
    borderLeftWidth: '12px',
    borderLeftStyle: 'solid'
  },
  contents: {
    flexGrow: 1,
    width: "100%"
  }
});

export interface TaskListItemProps extends WithStyles<typeof styles> {
  task: ViewItemMegaItem
}

// The {} represents the state
@observer
class TaskListItem extends React.Component<TaskListItemProps, {}> {

  render() {
    const { classes, task } = this.props;

    return (
      <Link to={location => `${location.pathname}/${task.identifier}`} style={{ textDecoration: 'none' }}>
        <Paper className={classes.root} elevation={1} style={{
          borderLeftColor: task.percentComplete == 1 ? "#AAAAAA" : task.class.color
        }}>
          {/* For now, not using the completion bar since it doesn't clip correctly on the nice paper edges */}
          {/* <TaskCompletionBar
            color="#FF0000"
            percentComplete={0.3}/> */}
          <div className={classes.contents}>
            <Typography component="p" noWrap={true} style={{
              fontWeight: 'bold',
              textDecoration: task.percentComplete == 1 ? 'line-through' : 'initial'
            }}>
              {task.name}
            </Typography>
            <Typography component="p" noWrap={true} style={{
              color: task.class.color,
              fontWeight: 'bold'
            }}>
              {task.subtitle}
            </Typography>
            {task.hasDetails && (
              <Typography component="p" noWrap={true}>
                {task.details}
              </Typography>
            )}
          </div>
        </Paper>
      </Link>
    );
  }
}
  
export default withStyles(styles)(TaskListItem);
  