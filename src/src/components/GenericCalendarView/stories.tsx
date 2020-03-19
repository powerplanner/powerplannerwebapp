import * as React from 'react';

import { storiesOf } from '@storybook/react';
import * as moment from "moment";

import GenericCalendarView from ".";

const fill:React.CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

storiesOf("GenericCalendarView", module)
  .add("default", () => <div style={fill}><GenericCalendarView month={moment()} onMonthChanged={() => {}}/></div>);