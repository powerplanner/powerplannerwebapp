import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '12px',
    backgroundColor: "#AAAAAA"
  },
  percentComplete: {
  }
});

export interface TaskCompletionBarProps extends WithStyles<typeof styles> {
  color: any,
  percentComplete: number
}

// The {} represents the state
class TaskCompletionBar extends React.Component<TaskCompletionBarProps, {}> {

  render() {
    const { classes, color, percentComplete } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.percentComplete} style={{
          backgroundColor: color,
          height: (percentComplete * 100) + "%"
        }}/>
      </div>
    );
  }
}
  
export default withStyles(styles)(TaskCompletionBar);
  