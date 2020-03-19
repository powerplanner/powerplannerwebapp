import React from 'react';

import { storiesOf } from '@storybook/react';

import TaskList from './index';
import { ViewItemTask, ViewItemClass, ViewItemMegaItem } from "models/viewItems";
import { Guid } from 'guid-typescript';
import * as moment from "moment";
import { BrowserRouter } from "react-router-dom";
import { MegaItemType, DateValues } from "api/enums";

storiesOf("TaskList", module)
  .add("sample list", () => (
    <BrowserRouter>
    <div style={{height: '100%', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
  <TaskList tasks={[
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
  ]}/>
  </div></BrowserRouter>));