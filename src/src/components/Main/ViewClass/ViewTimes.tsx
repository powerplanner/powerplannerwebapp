import * as React from "react";
import { ViewItemSchedule } from "models/viewItems";
import { Typography, makeStyles } from "@material-ui/core";
import { observer } from "mobx-react";
import { DayOfWeek, DayOfWeekHelper } from "api/enums";

const useStyles = makeStyles(theme => ({
  groupedDay: {
    marginBottom: theme.spacing(2)
  },
  timeEntry: {
    marginBottom: theme.spacing(1)
  }
}));

class GroupedDay {
  dayOfWeek: DayOfWeek;
  schedules: ViewItemSchedule[];
  constructor(allSchedules:ViewItemSchedule[], dayOfWeek:DayOfWeek) {
    this.dayOfWeek = dayOfWeek;
    this.schedules = allSchedules.filter(i => i.dayOfWeek === dayOfWeek).sort((a, b) => a.compareTo(b));
  }
}

const ViewTimes = observer((props:{
  schedules?: ViewItemSchedule[]
}) => {

  const classes = useStyles();

  if (props.schedules === undefined || props.schedules.length === 0) {
    return (
      <div>
        <Typography variant="h5">No times</Typography>
        <Typography>Use the native Android, iOS, or Windows apps to edit times.</Typography>
      </div>
    );
  }

  const groupedDays = [
    new GroupedDay(props.schedules, DayOfWeek.Monday),
    new GroupedDay(props.schedules, DayOfWeek.Tuesday),
    new GroupedDay(props.schedules, DayOfWeek.Wednesday),
    new GroupedDay(props.schedules, DayOfWeek.Thursday),
    new GroupedDay(props.schedules, DayOfWeek.Friday),
    new GroupedDay(props.schedules, DayOfWeek.Saturday),
    new GroupedDay(props.schedules, DayOfWeek.Sunday),
  ];

  return (
    <>
      {groupedDays.filter(i => i.schedules.length > 0).map(g => (
        <div className={classes.groupedDay}>
          <Typography variant="h6">{DayOfWeekHelper.toString(g.dayOfWeek)}</Typography>
          {g.schedules.map(s => (
            <div className={classes.timeEntry}>
              <Typography>{s.startDateTime.format("LT")} to {s.endDateTime.format("LT")}</Typography>
              {s.room.length > 0 && <Typography>{s.room}</Typography>}
            </div>
          ))}
        </div>
      ))}
    </>
  );
});

export default ViewTimes;