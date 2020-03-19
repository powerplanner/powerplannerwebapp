import * as React from "react";
import { ViewItemMegaItem } from "models/viewItems";
import { observer } from "mobx-react";
import TaskList from "components/Main/TaskList";
import FloatingAddButton from "../FloatingAddButton";

const ViewTasksOrEvents = observer((props:{
  tasks: ViewItemMegaItem[],
  type: "task" | "event"
}) => {

  const sorted = props.tasks.filter(i => !i.isOld).sort();

  return (
    <div>
      <TaskList tasks={sorted}/>
      <FloatingAddButton type={props.type}/>
    </div>
  );
});

export default ViewTasksOrEvents;