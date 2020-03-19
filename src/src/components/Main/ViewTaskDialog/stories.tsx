import React from 'react';

import { storiesOf } from '@storybook/react';
import { ViewItemTask, ViewItemClass, ViewItemMegaItem } from "models/viewItems";
import { Guid } from "guid-typescript";

import ViewTaskDialogShell from './ViewTaskDialogShell';
import { PowerItemType, MegaItemType, DateValues } from 'api/enums';
import * as moment from "moment";
import { BrowserRouter } from 'react-router-dom';

const task = new ViewItemMegaItem({
  identifier: Guid.create(),
  name: "An incomplete task",
  details: "This is an incomplete task",
  percentComplete: 0.3,
  date: moment(),
  class: new ViewItemClass({
    identifier: Guid.create(),
    name: "Spanish",
    semesterId: Guid.create(),
    color: "blue"
  }),
  megaItemType: MegaItemType.Homework,
  endTime: DateValues.UNASSIGNED
});

storiesOf("ViewTaskDialogShell", module)
  .add("loading from blank", () => <BrowserRouter><ViewTaskDialogShell open={true} loaded={false} taskType={PowerItemType.Homework} /></BrowserRouter>)
  .add("loading/refreshing", () => <BrowserRouter><ViewTaskDialogShell open={true} task={task} loaded={false} taskType={PowerItemType.Homework} /></BrowserRouter>)
  .add("loaded", () => <BrowserRouter><ViewTaskDialogShell open={true} task={task} loaded={true} taskType={PowerItemType.Homework} /></BrowserRouter>);