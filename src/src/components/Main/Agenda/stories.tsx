import React from 'react';

import { storiesOf } from '@storybook/react';

import AgendaComposer from './AgendaComposer';
import { ViewItemMegaItem, ViewItemClass } from 'models/viewItems';
import { Guid } from 'guid-typescript';
import { MegaItemType, DateValues } from 'api/enums';
import * as moment from "moment";
import { BrowserRouter } from 'react-router-dom';

var lotsOfTasks:ViewItemMegaItem[] = [];
for (var i = 0; i < 80; i++) {
  lotsOfTasks.push(new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "Incomplete task #" + (i + 1),
    details: "This is an incomplete task",
    date: moment(),
    percentComplete: i / 100,
    class: new ViewItemClass({
      identifier: Guid.create(),
      name: "Spanish",
      color: "blue",
      semesterId: Guid.create()
    }),
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  }))
}

storiesOf("AgendaComposer", module)
  .add("view agenda", () => (
    <BrowserRouter>
    <div style={{height: '100%', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
  <AgendaComposer tasks={[
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
    })]}/>
  </div></BrowserRouter>))
  .add("lots of tasks", () => (
    <BrowserRouter><div style={{height: '100%', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
  <AgendaComposer tasks={lotsOfTasks}/>
  </div></BrowserRouter>))
  .add("loading", () => (
    <BrowserRouter><div style={{height: '100%', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
  <AgendaComposer tasks={[]} loading={true}/>
  </div></BrowserRouter>));