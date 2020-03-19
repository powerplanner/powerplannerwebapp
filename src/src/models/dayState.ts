import { SemesterState } from "./SemesterState";
import { Moment } from "moment";
import { computed } from "mobx";
import { ViewItemMegaItem } from "./viewItems";
import ArrayHelpers from "helpers/arrayHelpers";
import GlobalState from "./globalState";

export interface ISingleDayState {
  tasks: ViewItemMegaItem[],
  activeTasks: ViewItemMegaItem[]
}

export class SingleDayState implements ISingleDayState {
  private semesterState: SemesterState;
  private day: Moment;

  constructor(semesterState: SemesterState, day: Moment) {
    this.semesterState = semesterState;
    this.day = day;
  }

  @computed get tasks() {
    return this.semesterState.allTasksAndEvents.filter(i => i.date!.isSame(this.day, 'day')).sort((a, b) => a.compareTo(b));
  }

  @computed get activeTasks() {
    return this.tasks.filter(i => !i.isComplete);
  }
}

export interface IDayState {
  getSingleDay: (day:Moment) => ISingleDayState;
}

export default class DayState implements IDayState {
  
  private semesterState:SemesterState;
  constructor(semesterState:SemesterState) {
    this.semesterState = semesterState;
  }

  private singleDays = new Map<string, SingleDayState>();
  getSingleDay(day:Moment) {
    const dayStr = day.format("YYYY-MM-DD");
    if (this.singleDays.has(dayStr)) {
      return this.singleDays.get(dayStr)!;
    } else {
      const newSingleDay = new SingleDayState(this.semesterState, day);
      this.singleDays.set(dayStr, newSingleDay);
      return newSingleDay;
    }
  }
}