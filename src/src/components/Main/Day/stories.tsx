import * as React from 'react';

import { storiesOf } from '@storybook/react';

import { ViewItemMegaItem, ViewItemClass } from 'models/viewItems';
import * as moment from "moment";
import { MegaItemType, DateValues } from 'api/enums';
import { Guid } from 'guid-typescript';
import DayShell from './DayShell';
import { BrowserRouter } from 'react-router-dom';
import { IDayState, ISingleDayState } from 'models/dayState';
import { Moment } from 'moment';

const allItems = [
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "An incomplete task",
    details: "This is an incomplete task",
    percentComplete: 0.3,
    date: moment(),
    class: new ViewItemClass({
      identifier: Guid.create(),
      name: "Spanish",
      color: "blue",
      semesterId: Guid.create()
    }),
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  }),
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "A completed task",
    details: "This is a complete task",
    percentComplete: 1,
    date: moment(),
    class: new ViewItemClass({
      identifier: Guid.create(),
      name: "English",
      color: "green",
      semesterId: Guid.create()
    }),
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  }),
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "A task without details",
    percentComplete: 0,
    date: moment(),
    class: new ViewItemClass({
      identifier: Guid.create(),
      name: "History",
      color: "purple",
      semesterId: Guid.create()
    }),
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  }),
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "One last task",
    percentComplete: 0,
    date: moment(),
    class: new ViewItemClass({
      identifier: Guid.create(),
      name: "Science",
      color: "green",
      semesterId: Guid.create()
    }),
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  })
];

const dayState:IDayState = {
  getSingleDay: (day:Moment):ISingleDayState => {
    return {
      tasks: allItems,
      activeTasks: allItems
    }
  }
};

storiesOf("Day", module)
  .add("normal", () => <BrowserRouter><DayShell date={moment()} onDateChanged={() => {}} dayState={dayState} /></BrowserRouter>);