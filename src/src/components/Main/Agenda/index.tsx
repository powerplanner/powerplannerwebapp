import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AgendaComposer from "./AgendaComposer";
import Api from "api";
import { Guid } from 'guid-typescript';
import { PowerItemType } from 'api/enums';
import { ViewItemTask, BaseViewItemTaskEvent } from 'models/viewItems';
import { SemesterState } from 'models/SemesterState';
import { StatefulComponent, IStatefulComponentState } from "components/StatefulComponent";
import { observer } from "mobx-react";
import GlobalState from "models/globalState";
import AgendaState from "models/agendaState";

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
    height: '100%'
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
  contents: {
    flexGrow: 1
  }
});

export interface AgendaProps extends WithStyles<typeof styles> {
}

// The {} represents the state
@observer
class Agenda extends React.Component<AgendaProps, {}> {

  private agendaState:AgendaState;

  constructor(props:Readonly<AgendaProps>) {
    super(props);
    this.agendaState = GlobalState.currSemesterState!.agendaState;
  }

  render() {
    const { classes } = this.props;

    return (
      <AgendaComposer
        tasks={this.agendaState.tasks}
        loading={this.agendaState.loading}/>
    );
  }
}

export default withStyles(styles)(Agenda);
