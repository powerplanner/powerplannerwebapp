import { Guid } from "guid-typescript";
import { IPowerBasicClassInfoWithSchedules, IGuid, IPowerListItemTaskOrEvent } from "api/items";
import Api from "api";
import { PowerItemType } from "api/enums";
// import { cache, cacheWithId, CachedItems, CachedIdItems } from "./CachedItems";
import { BaseViewItemTaskEvent, ViewItemClass, ViewItemTask, ViewItemEvent } from "./viewItems";
import { IPowerGetTaskEventResponse } from "api/responses";
import { CachedItems, CachedItem } from "./CachedItems";
import { observable, computed } from "mobx";
import AgendaState from "./agendaState";
import DayState from "./dayState";

export class SemesterState {
  @observable private _loading: boolean = true;
  @computed get loading() { return this._loading; }

  @observable private _semesterId: Guid;
  @observable private _classes: ViewItemClass[] = [];
  @computed get semesterId() { return this._semesterId; }
  @computed get classes() { return this._classes.filter(i => true).sort((a, b) => a.compareTo(b)); }

  constructor(semesterId: Guid, classes: ViewItemClass[]) {
    this._semesterId = semesterId;
    this._classes = observable.array(classes);
  }

  addClass(c:ViewItemClass) {
    this._classes.push(c);
  }

  removeClass(c:ViewItemClass) {
    const index = this._classes.indexOf(c);
    if (index !== -1) {
      this._classes.splice(index, 1);
    }
  }

  @observable private _agendaState?: AgendaState;
  @computed get agendaState() {
    if (!this._agendaState) {
      this._agendaState = new AgendaState(this);
    }
    return this._agendaState;
  }

  private _dayState?: DayState;
  get dayState() {
    if (!this._dayState) {
      this._dayState = new DayState(this);
    }
    return this._dayState;
  }

  getOrCreateTaskOrEventFromPartial(partial: IPowerListItemTaskOrEvent, c: ViewItemClass) : CachedItem<BaseViewItemTaskEvent> {
    const id:Guid = IGuid.toGuid(partial.Identifier);

    if (partial.ItemType === PowerItemType.Homework) {
      const cached = this._cachedTasks.get(id);
      if (cached) {
        if (!cached.hasItem) {
          cached.populateFromPartial(<ViewItemTask>BaseViewItemTaskEvent.fromListItemTaskOrEvent(partial, c));
        }
        return cached;
      } else {
        const viewItem = <ViewItemTask>BaseViewItemTaskEvent.fromListItemTaskOrEvent(partial, c);
        return this._cachedTasks.cachePartial(id, viewItem);
      }
    } else {
      const cached = this._cachedEvents.get(id);
      if (cached) {
        if (!cached.hasItem) {
          cached.populateFromPartial(<ViewItemEvent>BaseViewItemTaskEvent.fromListItemTaskOrEvent(partial, c));
        }
        return cached;
      } else {
        const viewItem = <ViewItemEvent>BaseViewItemTaskEvent.fromListItemTaskOrEvent(partial, c);
        return this._cachedEvents.cachePartial(id, viewItem);
      }
    }
  }

  findClass(classId: IGuid) {
    var guid = IGuid.toGuid(classId);
    return this._classes.find((c) => c.identifier.equals(guid));
  }

  private _cachedTasks = new CachedItems<ViewItemTask>(this.loadTask.bind(this));
  getTask(id: Guid) {
    var item = this._cachedTasks.getOrCreate(id);
    item.loadIfNeededAsync();
    return item;
  }

  private _cachedEvents = new CachedItems<ViewItemEvent>(this.loadEvent.bind(this));
  getEvent(id:Guid) {
    var item = this._cachedEvents.getOrCreate(id);
    item.loadIfNeededAsync();
    return item;
  }

  getTaskOrEvent(id: Guid) {
    return this.allTasksAndEvents.find(i => i.identifier.equals(id));
  }

  @computed get allTasksAndEvents() {
    return this.classes.map(i => i.megaItems).reduce((prev, el) => prev.concat(el));
  }

  private async loadTask(id:Guid) : Promise<ViewItemTask> {
    return <ViewItemTask>await this.loadTaskEvent(id, PowerItemType.Homework);
  }

  private async loadEvent(id:Guid) : Promise<ViewItemEvent> {
    return <ViewItemEvent>await this.loadTaskEvent(id, PowerItemType.Exam);
  }

  private async loadTaskEvent(id:Guid, type:PowerItemType) {
    var taskResponse = await (type == PowerItemType.Homework ? Api.getTaskAsync(id) : Api.getEventAsync(id));
    var c = this.findClass(taskResponse.ClassIdentifier);
    if (c) {
      var actualItem = BaseViewItemTaskEvent.fromGetTaskEvent(taskResponse, type, c);
      return actualItem;
    }
    throw new Error("Class not found");
  }

  async deleteTaskAsync(task: BaseViewItemTaskEvent) {
    await Api.modifyAsync({
      deletes: [task.identifier]
    });

    // if (this._agendaState) {
    //   this._agendaState.removeTask(task);
    // }
  }
}