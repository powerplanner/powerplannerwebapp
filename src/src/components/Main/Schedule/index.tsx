import * as React from "react";
import ScheduleShell from "./ScheduleShell";
import GlobalState from "models/globalState";
import { observer } from "mobx-react";


const Schedule = observer(() => {
  return (
    <ScheduleShell classes={GlobalState.currSemesterState!.classes}/>
  );
});

export default Schedule;