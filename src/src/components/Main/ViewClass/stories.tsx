import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { ViewItemClass, ViewItemSchedule, ViewItemMegaItem } from 'models/viewItems';
import { Guid } from 'guid-typescript';
import ViewClassShell from './ViewClassShell';
import { DayOfWeek, PowerScheduleWeek, MegaItemType, DateValues } from 'api/enums';
import * as moment from 'moment';
import { BrowserRouter } from 'react-router-dom';

const c = new ViewItemClass({
  identifier: Guid.create(),
  name: "Math",
  color: "blue",
  details: "Here's some details.\n\nThey even span multiple lines.",
  semesterId: Guid.create()
});

c.schedules = [
  new ViewItemSchedule({
    identifier: Guid.create(),
    class: c,
    dayOfWeek: DayOfWeek.Monday,
    startTime: moment([2020, 1, 1, 11, 0, 0]),
    endTime: moment([2020, 1, 1, 11, 50]),
    room: "Modern Languages 302",
    scheduleWeek: PowerScheduleWeek.BothWeeks,
    name: ''
  }),
  new ViewItemSchedule({
    identifier: Guid.create(),
    class: c,
    dayOfWeek: DayOfWeek.Monday,
    startTime: moment([2020, 1, 1, 9, 0, 0]),
    endTime: moment([2020, 1, 1, 9, 50]),
    room: "Modern Languages 302",
    scheduleWeek: PowerScheduleWeek.BothWeeks,
    name: ''
  }),
  new ViewItemSchedule({
    identifier: Guid.create(),
    class: c,
    dayOfWeek: DayOfWeek.Wednesday,
    startTime: moment([2020, 1, 1, 9, 0, 0]),
    endTime: moment([2020, 1, 1, 9, 50]),
    room: "Modern Languages 302",
    scheduleWeek: PowerScheduleWeek.BothWeeks,
    name: ''
  })
];

c.megaItems = [
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "An overdue incomplete task",
    details: "This is an incomplete task that's overdue",
    percentComplete: 0.3,
    date: moment([2020, 1, 1]),
    class: c,
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  }),
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "A current incomplete task",
    details: "This is normal task that's due today",
    percentComplete: 0.3,
    date: moment().startOf('day'),
    class: c,
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  }),
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "An old completed task",
    details: "This shouldn't appear since it's completed",
    percentComplete: 1,
    date: moment([2020, 1, 1]),
    class: c,
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  }),
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "An old event",
    details: "This shouldn't appear since it's old",
    percentComplete: 0,
    date: moment([2020, 1, 1]),
    class: c,
    megaItemType: MegaItemType.Exam,
    endTime: DateValues.UNASSIGNED
  }),
  new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "A current event",
    details: "This should appear",
    percentComplete: 0,
    date: moment().startOf('day'),
    class: c,
    megaItemType: MegaItemType.Exam,
    endTime: DateValues.UNASSIGNED
  })
];

const cNoSchedules = new ViewItemClass({
  identifier: Guid.create(),
  name: "Math",
  color: "blue",
  details: "Here's some details.\n\nThey even span multiple lines.",
  semesterId: Guid.create()
});

storiesOf("ViewClass", module)
  .add("details", () => <ViewClassShell class={c} selectedPage="details"/>)
  .add("times", () => <ViewClassShell class={c} selectedPage="times"/>)
  .add("no times", () => <ViewClassShell class={cNoSchedules} selectedPage="times"/>)
  .add("tasks", () => <BrowserRouter><ViewClassShell class={c} selectedPage="tasks"/></BrowserRouter>)
  .add("no tasks", () => <ViewClassShell class={cNoSchedules} selectedPage="tasks"/>)
  .add("events", () => <BrowserRouter><ViewClassShell class={c} selectedPage="events"/></BrowserRouter>)
  .add("no events", () => <ViewClassShell class={cNoSchedules} selectedPage="events"/>);