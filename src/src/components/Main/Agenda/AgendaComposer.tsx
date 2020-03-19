import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TaskList from "../TaskList";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BaseViewItemTaskEvent, ViewItemMegaItem } from 'models/viewItems';
import FloatingAddButton from '../FloatingAddButton';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  list: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  listProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
  },
  contents: {
    flexGrow: 1
  }
});

export interface AgendaComposerProps extends WithStyles<typeof styles> {
  tasks: ViewItemMegaItem[],
  loading?: boolean,
  onAddTask?: () => void,
  onAddEvent?: () => void
}


// The {} represents the state
class AgendaComposer extends React.Component<AgendaComposerProps, {}> {

  constructor(props: AgendaComposerProps) {
    super(props);
    // this.getItemSize = this.getItemSize.bind(this);
  }

  // private getTask(index: number) : BaseViewItemTaskEvent {
  //   return this.props.tasks[index];
  // }

  

  render() {
    const { classes, tasks } = this.props;

    return (
      <div className={classes.root}>
        <div 
          className={classes.list}>
          <TaskList
            tasks={tasks}/>
          {this.props.loading &&
            <CircularProgress size={48} className={classes.listProgress}/>
          }
        </div>
        <FloatingAddButton/>
      </div>
    );
  }
}

export default withStyles(styles)(AgendaComposer);
