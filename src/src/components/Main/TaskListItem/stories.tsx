import React from 'react';

import { storiesOf } from '@storybook/react';

import TaskListItem from './index';
import { ViewItemTask, ViewItemClass, ViewItemMegaItem } from "models/viewItems";
import { Guid } from 'guid-typescript';
import { BrowserRouter } from "react-router-dom";
import * as moment from "moment";
import { MegaItemType, DateValues } from 'api/enums';

const TestTaskListItem = (props: {task:ViewItemMegaItem}) => {
  return (
    <BrowserRouter>
      <TaskListItem task={props.task}/>
    </BrowserRouter>
  );
}

storiesOf("TaskListItem", module)
  .add("incomplete task", () => <TestTaskListItem task={new ViewItemMegaItem({
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
  })}/>)
  .add("completed task", () => <TestTaskListItem task={new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "A completed task",
    details: "This is a complete task",
    percentComplete: 1,
    date: moment(),
    class: new ViewItemClass({
      identifier: Guid.create(),
      name: "Spanish",
      color: "blue",
      semesterId: Guid.create()
    }),
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  })}/>)
  .add("no details", () => <TestTaskListItem task={new ViewItemMegaItem({
    identifier: Guid.create(),
    name: "A task without details",
    percentComplete: 0,
    date: moment(),
    class: new ViewItemClass({
      identifier: Guid.create(),
      name: "Spanish",
      color: "blue",
      semesterId: Guid.create()
    }),
    megaItemType: MegaItemType.Homework,
    endTime: DateValues.UNASSIGNED
  })}/>);;
