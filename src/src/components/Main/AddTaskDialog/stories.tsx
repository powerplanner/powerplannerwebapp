import React from 'react';

import { storiesOf } from '@storybook/react';
import { ViewItemTask, ViewItemClass, ViewItemMegaItem } from "models/viewItems";
import { Guid } from "guid-typescript";

import AddTaskDialogShell from './AddTaskDialogShell';
import { PowerItemType, DateValues, MegaItemType } from 'api/enums';
import * as moment from "moment";

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

const semesterId = Guid.create();

const semesterClasses = [
  new ViewItemClass({
    identifier: Guid.create(),
    name: "Math",
    semesterId: semesterId,
    color: "blue"
  }),
  new ViewItemClass({
    identifier: task.class.identifier,
    name: "Spanish",
    semesterId: semesterId,
    color: "red"
  })
];

storiesOf("AddTaskDialogShell", module)
  .add("new task", () => (<AddTaskDialogShell
    open={true}
    taskType={PowerItemType.Homework}
    availableClasses={semesterClasses}/>))
  .add("edit task", () => (<AddTaskDialogShell
    open={true}
    taskType={PowerItemType.Homework}
    availableClasses={semesterClasses}
    itemToEdit={task}/>));
  // .add("loading from blank", () => <AddTaskDialogShell open={true} loaded={false} taskType={PowerItemType.Homework} />)
  // .add("loading/refreshing", () => <AddTaskDialogShell open={true} task={task} loaded={false} taskType={PowerItemType.Homework} />)
  // .add("loaded", () => <AddTaskDialogShell open={true} task={task} loaded={true} taskType={PowerItemType.Homework} />);