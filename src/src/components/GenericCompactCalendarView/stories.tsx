import * as React from 'react';

import { storiesOf } from '@storybook/react';

import GenericCompactCalendarView from ".";
import { Moment } from 'moment';
import * as moment from "moment";

const fill:React.CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

const getItems = (day:Moment) : string[] => {
  if (day.isSame(moment(), 'day')) {
    return ["#1ba1e2", "#1ba1e2", "#e51400"]
  }
  if (day.isSame(moment().add(1, 'day'), 'day')) {
    return ["#339933"];
  }
  if (day.isSame(moment().add(3, 'day'), 'day')) {
    return ["#339933", "#1ba1e2", "#1ba1e2", "#e51400", "#339933", "#1ba1e2", "#1ba1e2", "#339933", "#1ba1e2", "#1ba1e2", "#e51400", "#339933", "#1ba1e2", "#1ba1e2", "#339933", "#1ba1e2", "#1ba1e2", "#e51400", "#339933", "#1ba1e2", "#1ba1e2", "#339933", "#1ba1e2", "#1ba1e2", "#e51400", "#339933", "#1ba1e2", "#1ba1e2"];
  }
  return [];
}

storiesOf("CompactCalendarView", module)
  .add("default", () => <div style={fill}><GenericCompactCalendarView month={moment()} onMonthChanged={() => {}} getItems={getItems}/></div>);