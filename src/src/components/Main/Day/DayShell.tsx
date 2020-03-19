import * as React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { ViewItemMegaItem } from "models/viewItems";
import { Moment } from "moment";
import TaskList from "../TaskList";
import * as moment from "moment";
import InfiniteSwipeableViews from "components/InfiniteSwipeableViews";
import FloatingAddButton from "../FloatingAddButton";
import { observer } from "mobx-react";
import { IDayState, ISingleDayState } from "models/dayState";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  singleDay: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  title: {
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  tasksList: {
    position: "relative",
    flexGrow: 1
  }
}));

const SingleDay = observer((props:{
  singleDayState: ISingleDayState,
  date: Moment
}) => {

  const classes = useStyles();

  return (
    <div className={classes.singleDay}>
      <Typography variant="h6" className={classes.title}>{props.date.calendar(undefined, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd, MMMM D',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd, MMMM D',
    sameElse: 'dddd, MMMM D'
})}</Typography>
      <div className={classes.tasksList}>
        <TaskList tasks={props.singleDayState.tasks}/>
      </div>
    </div>
  );
});

const centerDate = moment().startOf('day');

const DayShell = (props:{
  date: Moment,
  onDateChanged: (date:Moment) => void,
  dayState: IDayState
}) => {

  const classes = useStyles();

  const singleDayRenderer = (relativeToStart:number) => {
    const date = centerDate.clone().add(relativeToStart, 'days');

    return <SingleDay singleDayState={props.dayState.getSingleDay(date)} date={date}/>;
  }

  const onRelativeIndexChanged = (index:number) => {
    props.onDateChanged(centerDate.clone().add(index, 'days'));
  }

  return (
    <div className={classes.root}>
      <InfiniteSwipeableViews
        relativeIndex={props.date.diff(centerDate, 'days')}
        onRelativeIndexChanged={onRelativeIndexChanged}
        slideRenderer={singleDayRenderer}/>
      <FloatingAddButton date={props.date}/>
    </div>
  );
};

export default DayShell;