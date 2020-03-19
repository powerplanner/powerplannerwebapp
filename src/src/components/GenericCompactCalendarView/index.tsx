import * as React from "react";
import { Moment } from "moment";
import { makeStyles, Typography } from "@material-ui/core";
import GenericCalendarView, { DayViewProps } from "components/GenericCalendarView";
import { Link } from "react-router-dom";
import StylelessLink from "components/StylelessLink";

const useStyles = makeStyles(theme => ({
  dayView: {
    position: "relative",
    height: "100%"
  },
  dayViewContent: {
    display: "grid",
    height: "100%",
    boxSizing: "border-box",
    gridTemplateColumns: "1fr auto",
    padding: theme.spacing(1),
    alignItems: "end"
  },
  dayViewToday: {
    backgroundColor: theme.palette.action.active,
    color: "white"
  },
  dayViewOtherMonth: {
    backgroundColor: theme.palette.action.selected
  },
  dayViewOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  dayViewHover: {
    backgroundColor: "rgba(0,0,0,0.07)"
  },
  dayViewMouseDown: {
    backgroundColor: "rgba(0,0,0,0.2)"
  },

  dayViewColorCircles: {
    overflowX: "hidden",
    whiteSpace: "nowrap",
    marginRight: theme.spacing(1),
    "& *": {
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      display: "inline-block",
      marginRight: theme.spacing(0.5)
    }
  }
}));

const GenericCompactCalendarView = (props:{
  month: Moment,
  onMonthChanged: (newMonth:Moment) => void,
  getItems: (day:Moment) => string[],
  linkGenerator?: (day:Moment) => string,
  topRightItems?: () => React.ReactNode
}) => {

  const classes = useStyles();
  
  const DayView = (dayProps:DayViewProps) => {

    const classNames = [classes.dayViewContent];
    if (dayProps.isToday) {
      classNames.push(classes.dayViewToday);
    } else if (!dayProps.isCurrentMonth) {
      classNames.push(classes.dayViewOtherMonth);
    }

    const overlayClassName = dayProps.isMouseDown ? classes.dayViewMouseDown : (dayProps.isMouseHover ? classes.dayViewHover : undefined);

    // Note we don't use Material Button, since performance is quite terrible with it
    const content = (
      <div className={classes.dayView}>
        <div className={classNames.join(' ')}>
          <div className={classes.dayViewColorCircles}>
            {props.getItems(dayProps.day).map((c, i) => (
              <span key={i} style={{backgroundColor: c}}/>
            ))}
          </div>
          <Typography>{dayProps.day.format('D')}</Typography>
        </div>
        <div className={`${classes.dayViewOverlay} ${overlayClassName}`}/>
      </div>
    )

    if (props.linkGenerator) {
      return (
        <StylelessLink to={props.linkGenerator(dayProps.day)}>
          {content}
        </StylelessLink>
      );
    }

    return content;
  }

  return (
    <GenericCalendarView
      month={props.month}
      onMonthChanged={props.onMonthChanged}
      dayViewRenderer={DayView}
      topRightItems={props.topRightItems}/>
  );
}

export default GenericCompactCalendarView;