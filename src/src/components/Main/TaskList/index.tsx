import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TaskListItem from "../TaskListItem";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import { BaseViewItemTaskEvent, ViewItemMegaItem } from 'models/viewItems';

const styles = (theme: Theme) => createStyles({
  root: {
    // ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: "flex",
    position: 'relative',
    borderLeftWidth: '12px',
    borderLeftStyle: 'solid'
  },
  contents: {
    flexGrow: 1
  },
  listContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: "auto",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(10),
    boxSizing: "border-box",
  },
  task: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
  nothing: {
    margin: theme.spacing(3)
  }
});

export interface TaskListProps extends WithStyles<typeof styles> {
  tasks: ViewItemMegaItem[]
}


// The {} represents the state
class TaskList extends React.Component<TaskListProps, {}> {

  constructor(props: TaskListProps) {
    super(props);
  }

  private getTask(index: number) : ViewItemMegaItem {
    return this.props.tasks[index];
  }

  private getItemSize = (index: number) : number => {
    var task = this.getTask(index);
    if (task.hasDetails) {
      return 80 + 12; // When I fix this to display description, it should be bigger
    } else {
      return 56 + 12;
    }
  }

  private renderRow(index: number, style: any) {
    var task = this.getTask(index);
    return (
      <div style={style} className={this.props.classes.task}>
        <TaskListItem
          task={task}/>
      </div>
    );
  }

  render() {
    const { classes, tasks } = this.props;

    if (tasks.length === 0) {
      return (
        <Typography variant="h5" className={classes.nothing}>Nothing due!</Typography>
      )
    }

    const Row = (props: any) => {
      return this.renderRow(props.index, props.style);
    }

    // return (
    //   <List
    //         height={500}
    //         width={300}
    //         itemCount={tasks.length}
    //         itemSize={this.getItemSize}
    //       >
    //       {Row}
    //       </List>
    // );

    return (
      <div className={classes.listContainer}>
        {tasks.map(task => (
          <div className={classes.task} key={task.identifier.toString()}>
            <TaskListItem
              task={task}/>
          </div>
        ))}
      </div>
    );

    // return (
    //   <AutoSizer>
    //     {({ height, width }) => (
    //   <List
    //         height={height}
    //         width={width}
    //         itemCount={tasks.length}
    //         itemSize={this.getItemSize}
    //       >
    //       {Row}
    //       </List>
    //       )}
    //     </AutoSizer>
    // );
  }
}

export default withStyles(styles)(TaskList);
