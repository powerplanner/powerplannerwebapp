import { observable, computed } from "mobx";
import { BaseViewItemTaskEvent, ViewItemMegaItem } from "./viewItems";
import { SemesterState } from "./SemesterState";
import Api from "api";

export default class AgendaState {
  private semesterState:SemesterState;
  // @observable private _cachedTasks: CachedItem<BaseViewItemTaskEvent>[] = [];
  @computed get tasks() {
    let megaItems = this.semesterState.allTasksAndEvents.filter(this.filter);
    megaItems = megaItems.sort((a, b) => a.compareTo(b));
    return megaItems;
  }
  @observable loading = false;

  constructor(semesterState:SemesterState) {
    this.semesterState = semesterState;
    // this.initializeAsync();
  }

  private filter(task:ViewItemMegaItem) {
    return !task.isComplete;
  }

  async initializeAsync() {
    // try {
    //   var getAgendaResponse = await Api.getAgendaAsync(this.semesterState.semesterId);
    //   for (var i = 0; i < getAgendaResponse.Items.length; i++) {
    //     var sentItem = getAgendaResponse.Items[i];
    //     var c = this.semesterState.findClass(sentItem.ClassIdentifier);
    //     if (c) {
    //       this.addTaskHelper(this.semesterState.getOrCreateTaskOrEventFromPartial(sentItem, c));
    //     }
    //   }

    //   this._cachedTasks = this._cachedTasks;
    // } catch {}

    // this.loading = false;
  }
}