import * as React from "react";
import { ViewItemClass, ViewItemSchedule } from "models/viewItems";
import DayScheduleItemsArranger from "models/dayScheduleItemsArranger";
import * as moment from "moment";
import ArrayHelpers from "helpers/arrayHelpers";
import { Typography, makeStyles } from "@material-ui/core";

const heightOfHour = 120;
const width = 200;

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "auto",
    backgroundColor: "#dedede"
  },
  schedule: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start"
  },
  timesColumn: {
    flexShrink: 0,
    backgroundColor: "#dedede",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  scheduleColumn: {
    width: width,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  columnItems: {
    position: "relative"
  },
  scheduleItem: {
    width: "100%",
    position: "absolute",
    color: "white",
    padding: theme.spacing(1),
    boxSizing: "border-box",
    overflow: "hidden"
  }
}));

const ScheduleShell = (props:{
  classes: ViewItemClass[]
}) => {

  const classes = useStyles();

  const DayHeader = (props:{children:string}) => {
    return <Typography variant="h6">{props.children}</Typography>
  }

  const ScheduleItem = (props:{schedule:ViewItemSchedule, height:number, topOffset:number}) => {
    const s = props.schedule;
    const timeString = `${s.startDateTime.format("LT")} to ${s.endDateTime.format("LT")}`;
    const textVariant = "body2";

    return (
      <div className={classes.scheduleItem} style={{backgroundColor: s.class.color, height: props.height, top: props.topOffset}}>
        <Typography variant={textVariant}>{s.class.name}</Typography>
        <Typography variant={textVariant}>{timeString}</Typography>
        {s.room.length > 0 && (
          <Typography variant={textVariant}>{s.room}</Typography>
        )}
      </div>
    )
  }

  const startOfWeek = moment().startOf('week');

  const arrangers:DayScheduleItemsArranger[] = [];
  for (let i = 0; i < 7; i++) {
    arrangers.push(new DayScheduleItemsArranger({
      classes: props.classes,
      date: startOfWeek.clone().add(i, 'days'),
      heightOfHour: heightOfHour,
      spacingWhenNoAdditionalItems: 0,
      spacingWithAdditionalItems: 0,
      widthOfCollapsed: 40
    }));
  }

  if (arrangers.find(i => i.isValid) === undefined) {
    return <p>Add schedules using the iOS, Windows, or Android apps</p>
  }

  const min = ArrayHelpers.min(arrangers.filter(i => i.isValid), i => i.startTime)!.startTime;
  const max = ArrayHelpers.max(arrangers.filter(i => i.isValid), i => i.endTime)!.endTime;
  const minHour = min.hours();
  const maxHour = max.hours();
  const hours:number[] = [];
  for (let h = minHour; h <= maxHour; h++) {
    hours.push(h);
  }

  arrangers.forEach(a => {
    a.startTime = min;
    a.endTime = max;
    a.calculateOffsets();
  });


  return (
    <div className={classes.root}>
      {/* Times */}
      <div className={classes.timesColumn}>
        <DayHeader>&nbsp;</DayHeader>
        {hours.map(h => (
          <Typography key={h} variant="h6" style={{height: heightOfHour}}>{moment().startOf('day').add(h, 'hour').format('LT')}</Typography>
        ))}
      </div>
      <div className={classes.schedule}>
        {arrangers.filter(i => (i.date.weekday() !== 0 && i.date.weekday() !== 6) || i.isValid).map((a, i) => (
          <div key={i} className={classes.scheduleColumn} style={{backgroundColor: i % 2 == 0 ? "#eeeeee" : "#dedede"}}>
            <DayHeader>{a.date.format('dddd')}</DayHeader>
            <div className={classes.columnItems} style={{height: (maxHour - minHour + 1) * heightOfHour}}>
              {a.scheduleItems.map(s => (
                <ScheduleItem key={s.item.identifier.toString()} schedule={s.item} height={s.height} topOffset={s.topOffset}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleShell;