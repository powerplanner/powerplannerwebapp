import * as React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import * as moment from "moment";
import InfiniteSwipeableViews from "components/InfiniteSwipeableViews";
import { Moment } from "moment";

const useStyles = makeStyles(theme => ({
  month: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default
  },
  monthTopSection: {
    padding: theme.spacing(2),
    display: "flex"
  },
  monthTitle: {
    flexGrow: 1
  },
  days: {
    flexGrow: 1,
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    background: theme.palette.background.paper,
    gridGap: "2px",
    borderTopColor: theme.palette.background.paper,
    borderTopStyle: "solid",
    borderTopWidth: "2px"
  },
  dayHeaders: {
    display: "flex",
    "&> *": {
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      overflowX: "hidden"
    }
  },
  dayHeader: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  dayViewHost: {
    display: "grid",
    gridTemplateColumns: "1fr",
    backgroundColor: theme.palette.background.default
  }
}));

const firstDayOfWeek = moment().startOf('week');
const dayLabels:string[] = [];
for (var i = 0; i < 7; i++) {
  dayLabels.push(firstDayOfWeek.format('dddd'));
  firstDayOfWeek.add(1, 'day');
}

export interface DayViewProps {
  day: Moment,
  isCurrentMonth: boolean,
  isToday: boolean,
  isMouseHover: boolean,
  isMouseDown: boolean
}

const GenericDayView = (props:DayViewProps) => {
  const classes = useStyles();

  let background = "transparent";
  if (props.isMouseDown) {
    background = "#cccccc";
  } else if (props.isMouseHover) {
    background = "#dddddd";
  }

  return (
    <div style={{backgroundColor: background}}>
      <Typography>{props.day.format('D')}</Typography>
    </div>
  )
}

const GenericDayViewHost = (props:{
  day: Moment,
  isCurrentMonth: boolean,
  isToday: boolean,
  dayViewRenderer?: (props:DayViewProps) => React.ReactNode
}) => {

  const classes = useStyles();
  const [mouseHover, setMouseHover] = React.useState(false);
  const [mouseDown, setMouseDown] = React.useState(false);

  const dayViewProps:DayViewProps = {
    day: props.day,
    isCurrentMonth: props.isCurrentMonth,
    isToday: props.isToday,
    isMouseDown: mouseDown,
    isMouseHover: mouseHover
  };

  return (
    <div
      className={classes.dayViewHost}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => {setMouseHover(false); setMouseDown(false)}}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}>
      {props.dayViewRenderer ? props.dayViewRenderer(dayViewProps) : GenericDayView(dayViewProps)}
    </div>
  );
}

const GenericMonthView = (props:{
  month: Moment,
  padding?: number,
  dayViewRenderer?: (props:DayViewProps) => React.ReactNode,
  topRightItems?: () => React.ReactNode
}) => {

  const classes = useStyles();

  const days:Moment[] = [];
  const firstDay = props.month.clone().subtract(props.month.weekday(), 'day');
  for (var i = 0; i < 42; i++) {
    days.push(firstDay.clone().add(i, 'days'));
  }

  const today = moment().startOf('day');

  const additionalMonthStyles:React.CSSProperties = {

  };
  if (props.padding) {
    additionalMonthStyles.padding = props.padding;
  }

  return (
    <div className={classes.month} style={additionalMonthStyles}>
      <div className={classes.monthTopSection}>
        <Typography className={classes.monthTitle} variant="h6">{props.month.format('MMMM YYYY')}</Typography>
        {props.topRightItems && props.topRightItems()}
      </div>
      <div className={classes.dayHeaders}>
        {dayLabels.map(d => (
          <Typography key={d} className={classes.dayHeader}>{d}</Typography>
        ))}
      </div>
      <div className={classes.days}>
        {days.map(d => (
          <GenericDayViewHost
            key={d.toISOString()}
            day={d}
            isCurrentMonth={d.isSame(props.month, 'month')}
            isToday={d.isSame(today, 'day')}
            dayViewRenderer={props.dayViewRenderer}/>
        ))}
      </div>
    </div>
  );
}

const startMonth = moment().startOf('month');

const GenericCalendarView = (props:{
  month: Moment,
  onMonthChanged: (newMonth:Moment) => void,
  dayViewRenderer?: (props:DayViewProps) => React.ReactNode,
  topRightItems?: () => React.ReactNode
}) => {

  const relativeIndex = props.month.diff(startMonth, 'months');
  const classes = useStyles();

  const slideRenderer = (relativeToStart: number) => {
    const month = startMonth.clone().add(relativeToStart, 'months').startOf('month');
    return <GenericMonthView month={month} dayViewRenderer={props.dayViewRenderer} topRightItems={props.topRightItems}/>
  }

  const onRelativeIndexChanged = (relativeIndex:number) => {
    props.onMonthChanged(startMonth.clone().add(relativeIndex, 'months'));
  }

  return (
    <InfiniteSwipeableViews relativeIndex={relativeIndex} onRelativeIndexChanged={onRelativeIndexChanged} slideRenderer={slideRenderer}/>
  );
}

export default GenericCalendarView;