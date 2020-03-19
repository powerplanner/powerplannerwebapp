import * as React from "react";
import DayShell from "./DayShell";
import GlobalState from "models/globalState";
import { Switch, Route, useParams, useHistory, Redirect } from "react-router-dom";
import * as moment from "moment";
import { Moment } from "moment";
import { observer } from "mobx-react";

let initialDate:Moment = moment();

const Day = () => {

  const [date, setDate] = React.useState(initialDate);

  const RouteDay = (props:{
    setDate: (date:Moment) => void
  }) => {
    const { date } = useParams();
    const dateVal = moment(date);

    props.setDate(dateVal);

    return <Redirect to="/day"/>
  }

  return (
    <Switch>
      <Route path="/day/:date(\d\d\d\d-\d\d-\d\d)">
        <RouteDay setDate={setDate}/>
      </Route>
      <Route path="/day">
      <DayShell
      date={date}
      onDateChanged={setDate}
      dayState={GlobalState.currSemesterState!.dayState}/>
      </Route>
    </Switch>
  )
};

export default Day;