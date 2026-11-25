import { observable, computed } from "mobx";
import { BaseViewItemTaskEvent, ViewItemMegaItem } from "./viewItems";
import { SemesterState } from "./SemesterState";
import Api from "api";

export default class AgendaState {
  private semesterState:SemesterState;
  @computed get tasks() {
    let megaItems = this.semesterState.allTasksAndEvents.filter(this.filter);
    megaItems = megaItems.sort((a, b) => a.compareTo(b));
    return megaItems;
  }
  @observable loading = false;

  constructor(semesterState:SemesterState) {
    this.semesterState = semesterState;
  }

  private filter(task:ViewItemMegaItem) {
    return !task.isComplete;
  }
}