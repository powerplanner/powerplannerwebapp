import * as React from "react";
import CalendarShell from "./CalendarShell";
import GlobalState from "models/globalState";
import { Switch, Route, useParams, useHistory } from "react-router-dom";
import * as moment from "moment";
import { Moment } from "moment";

const Calendar = () => {
  const [month, setMonth] = React.useState(moment().startOf('month'));

  const onMonthChanged = (newMonth:Moment) => {
    setMonth(newMonth);
  }

  return <CalendarShell month={month} onMonthChanged={onMonthChanged} allItems={GlobalState.currSemesterState!.allTasksAndEvents}/>;
}

export default Calendar;