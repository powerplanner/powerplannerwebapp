import * as React from 'react';

import { storiesOf } from '@storybook/react';

import { ViewItemClass, ViewItemSchedule } from 'models/viewItems';
import { Guid } from 'guid-typescript';
import { Duration } from 'moment';
import * as moment from 'moment';
import { DayOfWeek, PowerScheduleWeek } from 'api/enums';
import ScheduleShell from './ScheduleShell';

const classes:ViewItemClass[] = [];

const csc436 = new ViewItemClass({
  identifier: Guid.create(),
  name: 'CSC 436',
  color: '#A200FF',
  semesterId: Guid.create(),
  schedules: []
});
classes.push(csc436);

const anth = new ViewItemClass({
  identifier: Guid.create(),
  name: 'ANTH 160D2',
  color: '#e671b8',
  semesterId: Guid.create(),
  schedules: []
});
classes.push(anth);

const tar160 = new ViewItemClass({
  identifier: Guid.create(),
  name: 'TAR 160',
  color: '#f09609',
  semesterId: Guid.create(),
  schedules: []
});
classes.push(tar160);

const tar100 = new ViewItemClass({
  identifier: Guid.create(),
  name: 'TAR 100',
  color: '#a200ff',
  semesterId: Guid.create(),
  schedules: []
});
classes.push(tar100);

const addSchedule = (c: ViewItemClass, dayOfWeeks: DayOfWeek[], startTime: Duration, endTime: Duration, room?:string) => {
  dayOfWeeks.forEach(dayOfWeek => {
    var s = new ViewItemSchedule({
      identifier: Guid.create(),
      startTime: moment().startOf('day').add(startTime),
      endTime: moment().startOf('day').add(endTime),
      dayOfWeek: dayOfWeek,
      class: c,
      scheduleWeek: PowerScheduleWeek.BothWeeks,
      name: "",
      room: room ?? ""
    });
    c.schedules!.push(s);
  });
}

addSchedule(csc436, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], moment.duration(9, 'hours'), moment.duration({hours:9, minutes:50}), "Saguaro Hall 202");
addSchedule(anth, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], moment.duration(10, 'hours'), moment.duration({hours:10, minutes:50}), "ILC 130");
addSchedule(tar160, [DayOfWeek.Tuesday, DayOfWeek.Thursday], moment.duration(9.5, 'hours'), moment.duration({hours:10, minutes:45}), "Harvill 305");
addSchedule(tar100, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Friday], moment.duration(11, 'hours'), moment.duration({hours:11, minutes:50}), "Drama Audition 206");

storiesOf("Schedule", module)
  .add("normal", () => <ScheduleShell classes={classes}/>)
  // .add("custom", () => <ColorPicker selectedColor="#b58500"/>);