import { Guid } from "guid-typescript";
import { PowerItemType, DayOfWeek, PowerScheduleWeek, TimeOption, MegaItemType, DateValues } from "api/enums";
import * as moment from "moment";
import { Moment } from "moment";
import { IBaseSendingItem } from "api/sendingItems";
import { IDate, IPowerBasicClassInfoWithSchedules, IPowerBasicScheduleInfo, IGuid, IPowerListItemTaskOrEvent, IPowerBasicClassInfo, IPowerListItemMegaItem } from "api/items";
import { checkPropTypes } from "prop-types";
import { IPowerGetTaskEventResponse, IPowerGetClassesSchedulesAndMegaItemsResponse } from "api/responses";
import { observable, computed } from "mobx";
import Api from "api";

interface IBaseViewItemProps {
  identifier: Guid;
  dateCreated?: Moment;
  updated?: Moment;
}

export abstract class BaseViewItem<T extends IBaseViewItemProps> {
  private _identifier: Guid;
  get identifier() { return this._identifier; }

  abstract get itemType() : PowerItemType;

  private _dateCreated?: Moment;
  get dateCreated() { return this._dateCreated; }

  @observable updated?: Moment;

  constructor(props:T) {
    this._identifier = props.identifier;
    this._dateCreated = props.dateCreated;
    this.updated = props.updated;
  }

  compareTo(other:any) {
    if (this.dateCreated! < other.dateCreated!) {
      return -1;
    } else if (this.dateCreated! > other.dateCreated!) {
      return 1;
    } else {
      return 0;
    }
  }
}

interface IBaseViewItemWithNameProps extends IBaseViewItemProps {
  name: string
}

export abstract class BaseViewItemWithName<T extends IBaseViewItemWithNameProps> extends BaseViewItem<T> {
  @observable name: string;

  constructor(props:T) {
    super(props);
    this.name = props.name;
  }
}

interface IBaseViewItemWithDetailsProps extends IBaseViewItemWithNameProps {
  details?: string
}

export abstract class BaseViewItemWithDetails<T extends IBaseViewItemWithDetailsProps> extends BaseViewItemWithName<T> {
  @observable details?: string;

  constructor(props:T) {
    super(props);
    this.details = props.details;
  }

  @computed get hasDetails() : boolean {
    return this.details != undefined && this.details.length > 0;
  }
}

interface IBaseViewItemWithImagesProps extends IBaseViewItemWithDetailsProps {
  imageNames?: string[]
}

export abstract class BaseViewItemWithImages<T extends IBaseViewItemWithImagesProps> extends BaseViewItemWithDetails<T> {
  @observable imageNames?: string[];

  constructor(props:T) {
    super(props);
    this.imageNames = props.imageNames;
  }
}

interface IBaseViewItemTaskEventGradeProps extends IBaseViewItemWithImagesProps {
  date?: Moment;
}

export abstract class BaseViewItemTaskEventGrade<T extends IBaseViewItemTaskEventGradeProps> extends BaseViewItemWithImages<T> {
  @observable date?: Moment;

  constructor(props:T) {
    super(props);
    this.date = props.date;
  }

  compareTo(otherAny:any) {
    let other:BaseViewItemTaskEventGrade<T>;
    if (otherAny instanceof BaseViewItemTaskEventGrade) {
      other = <BaseViewItemTaskEventGrade<T>>otherAny;
    } else {
      return 0;
    }

    if (this.date! < other.date!) {
      return -1;
    } else if (this.date! > other.date!) {
      return 1;
    } else {
      return super.compareTo(other);
    }
  }
}

interface IViewItemMegaItemProps extends IBaseViewItemTaskEventGradeProps {
  endTime: Moment;
  class: ViewItemClass;
  megaItemType: MegaItemType;
  percentComplete: number;
  isFullyLoaded?: boolean;
}

export class ViewItemMegaItem extends BaseViewItemTaskEventGrade<IViewItemMegaItemProps> {
  @observable class: ViewItemClass;
  @observable megaItemType: MegaItemType;
  @observable endTime: Moment;
  @observable percentComplete: number;
  private isFullyLoaded: boolean;
  @observable isLoading: boolean = false;
  @observable failedLoadingFullError?: string;

  constructor(props:IViewItemMegaItemProps) {
    super(props);
    this.class = props.class;
    this.megaItemType = props.megaItemType;
    this.endTime = props.endTime;
    this.percentComplete = props.percentComplete;
    this.isFullyLoaded = props.isFullyLoaded ?? false;
  }

  get itemType() {
    return PowerItemType.MegaItem;
  }

  @computed get subtitle() {
    // Math - Tue, 10/21 (at 9:00 AM)
    return `${this.class.name} - ${this.isTask ? 'due' : 'on'} ${this.date!.format("ddd, M/D")}`;
  }

  @computed get isTask() {
    return this.megaItemType === MegaItemType.Task || this.megaItemType === MegaItemType.Homework;
  }

  async loadFullIfNeeded() {
    if (this.isFullyLoaded || this.isLoading) {
      return;
    }
    try {
      this.isLoading = true;

      var resp = await Api.getFullMegaItemAsync(this.identifier);
      if (resp.Error) {
        this.failedLoadingFullError = resp.Error;
      } else {
        this.details = resp.Details;
        this.imageNames = resp.ImageNames;
        this.isFullyLoaded = true;
      }
    } catch {
      this.failedLoadingFullError = "Network error";
    }

    this.isLoading = false;
  }

  urlPathType() {
    return this.megaItemType === MegaItemType.Exam || this.megaItemType === MegaItemType.Event ? "event" : "task";
  }

  @computed get isComplete() {
    if (this.isTask) {
      return this.percentComplete >= 1;
    } else {
      return this.date!.clone().startOf('day') < moment().startOf('day');
    }
  }

  @computed get isOld() {
    if (this.isTask) {
      return this.isComplete && this.date!.clone().startOf('day') < moment().startOf('day');
    } else {
      return this.isComplete;
    }
  }

  static fromListItem(from:IPowerListItemMegaItem, c:ViewItemClass) {
    return new ViewItemMegaItem({
      identifier: IGuid.toGuid(from.Identifier),
      name: from.Name,
      class: c,
      details: from.ShortDetails,
      date: IDate.toMoment(from.Date),
      endTime: IDate.toMoment(from.EndTime),
      dateCreated: IDate.toMoment(from.DateCreated),
      megaItemType: from.MegaItemType,
      percentComplete: from.PercentComplete,
      isFullyLoaded: false
    });
  }
}

interface IBaseViewItemTaskEventProps extends IBaseViewItemTaskEventGradeProps {
  endTime?: Moment;
  class: ViewItemClass;
  megaItemType: MegaItemType;
}

export abstract class BaseViewItemTaskEvent extends BaseViewItemTaskEventGrade<IBaseViewItemTaskEventProps> {
  @observable class: ViewItemClass;
  
  @observable endTime?: Moment;

  @observable megaItemType: MegaItemType;

  abstract get percentComplete() : number | undefined;

  constructor(props:IBaseViewItemTaskEventProps) {
    super(props);
    this.class = props.class;
    this.endTime = props.endTime;
    this.megaItemType = props.megaItemType;
  }

  @computed get isComplete() {
    if (this.percentComplete == undefined) {
      return undefined;
    }
    return this.percentComplete! >= 1;
  }

  @computed get timeOption() : TimeOption {
    const second = this.date!.second();
    switch (this.megaItemType) {
      case MegaItemType.Homework:
        switch (second) {
          case 0:
            return TimeOption.StartOfClass;
          case 1:
            return TimeOption.BeforeClass;
          case 2:
            return TimeOption.DuringClass;
          case 3:
            return TimeOption.EndOfClass;
          case 4:
            return TimeOption.Custom;
          default:
            return TimeOption.AllDay;
        }

      case MegaItemType.Task:
        switch (second) {
          case 4:
            return TimeOption.Custom;
          default:
            return TimeOption.AllDay;
        }

      case MegaItemType.Exam:
        if (this.endTime! === DateValues.UNASSIGNED) {
          return TimeOption.DuringClass;
        } else if (this.endTime!.second() === 59) {
          return TimeOption.AllDay;
        } else {
          return TimeOption.Custom;
        }

      case MegaItemType.Event:
        if (this.endTime!.second() === 59) {
          return TimeOption.AllDay;
        }
        return TimeOption.Custom;
    }

    return TimeOption.AllDay;
  }

  urlPathType() {
    return this.itemType == PowerItemType.Exam ? "event" : "task";
  }

  getSubtitle() {
    // Math - Tue, 10/21 (at 9:00 AM)
    return `${this.class.name} - ${this.date!.format("ddd, M/D")}`;
  }

  static getMegaItemType(itemType: PowerItemType, c:ViewItemClass) {
    // TODO: This doesn't support semester tasks/events
    if (itemType === PowerItemType.Homework) {
      return MegaItemType.Homework;
    } else {
      return MegaItemType.Exam;
    }
  }

  static fromListItemTaskOrEvent(from:IPowerListItemTaskOrEvent, c:ViewItemClass) {
    var baseProps: IBaseViewItemTaskEventProps = {
      identifier: IGuid.toGuid(from.Identifier),
      name: from.Name,
      class: c,
      details: from.ShortDetails,
      date: IDate.toMoment(from.Date),
      dateCreated: IDate.toMoment(from.DateCreated),
      megaItemType: this.getMegaItemType(from.ItemType, c)
    };

    if (from.ItemType == PowerItemType.Homework) {
      return new ViewItemTask({
        ...baseProps,
        percentComplete: from.PercentComplete!
      });
    } else {
      return new ViewItemEvent(baseProps);
    }
  }

  static fromGetTaskEvent(from:IPowerGetTaskEventResponse, type:PowerItemType, c:ViewItemClass) {
    var baseProps: IBaseViewItemTaskEventProps = {
      identifier: IGuid.toGuid(from.Identifier),
      name: from.Name,
      details: from.Details,
      date: IDate.toMoment(from.Date),
      imageNames: from.ImageNames,
      class: c,
      megaItemType: this.getMegaItemType(type, c)
    };

    if (type == PowerItemType.Homework) {
      return new ViewItemTask({
        ...baseProps,
        percentComplete: from.PercentComplete
      });
    } else {
      return new ViewItemEvent(baseProps);
    }
  }

  async editAsync(props:{
    name: string
  }) {
    try {
      Api.modifyAsync({
        updates: [{
          identifier: this.identifier,
          itemType: this.itemType,
          name: props.name
        }]
      });

      this.name = props.name;
    } catch {}
  }

  compareTo(otherAny:any) : -1|0|1 {
    let other:BaseViewItemTaskEvent;
    if (otherAny instanceof BaseViewItemTaskEvent) {
      other = <BaseViewItemTaskEvent>otherAny;
    } else {
      return super.compareTo(otherAny);
    }
    // Desired sort order:
    //
    // - Anything on a different day obviously goes earlier/later
    //
    // - Within the same day, items that are completed drop to the bottom
    //
    // - Items that have times (or class times) should go first and appear in chronological order
    //
    // - After the items with times, everything else should appear afterwards
    //
    // - Anything that collides at the same time (or at the bottom, or don't have times) are sorted in the following order
    //   - Exam
    //   - Homework
    //   - Task
    //   - Event
    
    // If earlier date, goes first
    if (this.date!.date < other.date!.date) {
      return -1;
    }

    // If later date, goes last
    if (this.date!.date > other.date!.date) {
      return 1;
    }

    // Otherwise, same date, need to sort based on behaviors

    // Within same day, items that are complete drop to bottom
    let comp:-1|0|1 = this.tryCompareByCompletionStatus(other);
    if (comp != 0) {
      return comp;
    }

    // Place items in chronological order
    const thisDueDateWithTime = this.getDueDateWithTime();
    const otherDueDateWithTime = other.getDueDateWithTime();
    if (thisDueDateWithTime < otherDueDateWithTime) {
      return -1;
    } else if (thisDueDateWithTime > otherDueDateWithTime) {
      return 1;
    }

    // Otherwise, items collide at same tiem (or didn't have time)

    // Compare by type
    comp = this.tryCompareByType(other);
    if (comp != 0) {
      return comp;
    }

    // Otherwise, compare by class if present
    var class1 = this.class;
    var class2 = this.class;

    comp = class1.compareTo(class2);
    if (comp != 0) {
      return comp;
    }

    // Otherwise, compare by date created
    if (this.dateCreated! < other.dateCreated!) {
      return -1;
    } else if (this.dateCreated! > other.dateCreated!) {
      return 1;
    } else {
      return 0;
    }
  }

  private tryCompareByType(other:BaseViewItemTaskEvent) {
    if (other instanceof ViewItemTask && this instanceof ViewItemTask) {
      return 0;
    }
    if (other instanceof ViewItemEvent && this instanceof ViewItemEvent) {
      return 0;
    }

    if (this instanceof ViewItemEvent) {
      // Events go ahead
      return -1;
    } else if (other instanceof ViewItemEvent) {
      return 1;
    }

    if (this instanceof ViewItemTask) {
      return -1;
    } else if (other instanceof ViewItemTask) {
      return 1;
    }

    return 0;
  }

  private tryCompareByCompletionStatus(other:BaseViewItemTaskEvent) {
    var thisIsComplete = this.isComplete!;
    var otherIsComplete = other.isComplete!;

    // If other is complete and this isn't, we send this to front
    if (otherIsComplete && !thisIsComplete) {
      return -1;
    }

    // If this is complete and other isn't, we send this to back
    if (thisIsComplete && !otherIsComplete) {
      return 1;
    }

    // Otherwise, continue to use normal sorting behavior
    return 0;
  }

  getDueDateWithTime() : Moment {
    const answer = this.tryGetDueDateWithTime();
    if (answer) {
      return answer;
    }

    // Act like it's an all-day item
    if (this instanceof ViewItemTask) {
      return this.date!; // TODO: Make this end of day
    } else {
      return this.date!; // TODO: Strip time from day
    }
  }

  tryGetDueDateWithTime() : Moment | undefined {
    switch (this.timeOption) {
      case TimeOption.AllDay:
        return DateValues.MINIMUM;
      case TimeOption.Custom:
        return BaseViewItemTaskEvent.stripSeconds(this.date!);
    }

    // Otherwise need to obtain the class schedule
    const schedule = this.findSchedule();
    if (schedule) {
      switch (this.timeOption) {
        // TODO
      }
      // Remove this after completed todo
      return this.date!;
    } else {
      return undefined;
    }
  }

  private findSchedule() : ViewItemSchedule | undefined {
    // TODO
    return undefined;
  }

  static stripSeconds(date:Moment) {
    const clone = moment(date);
    clone.set('second', 0);
    return clone;
  }
}

interface IViewItemTaskProps extends IBaseViewItemTaskEventProps {
  percentComplete?: number;
}

export class ViewItemTask extends BaseViewItemTaskEvent {
  @observable _percentComplete?: number;
  @computed get percentComplete() { return 0; }
  set percentComplete(value:number) { this._percentComplete = value; }

  get itemType() {
    return PowerItemType.Homework;
  }

  constructor(props:IViewItemTaskProps) {
    super(props);
    if (props.percentComplete) {
      this.percentComplete = props.percentComplete;
    }
  }
}

export class ViewItemEvent extends BaseViewItemTaskEvent {
  // TODO: Base that off of date
  @computed get percentComplete() { return 0; }

  get itemType() {
    return PowerItemType.Exam;
  }

  constructor(props:IViewItemTaskProps) {
    super(props);
  }
}

export class ViewItemYear extends BaseViewItemWithName<IBaseViewItemWithNameProps> {
  get itemType(): PowerItemType {
    return PowerItemType.Year;
  }

  @observable semesters: ViewItemSemester[] = [];

  constructor(props:IBaseViewItemWithNameProps) {
    super(props);
  }

  removeSemester(s:ViewItemSemester) {
    const index = this.semesters.indexOf(s);
    if (index !== -1) {
      this.semesters.splice(index, 1);
    }
  }
}

export class ViewItemSemester extends BaseViewItemWithName<IBaseViewItemWithNameProps> {
  get itemType(): PowerItemType {
    return PowerItemType.Semester;
  }

  @observable classes: ViewItemClass[] = [];

  constructor(props:IBaseViewItemWithNameProps) {
    super(props);
  }
}

export interface IViewItemClassProps extends IBaseViewItemWithImagesProps {
  schedules?: ViewItemSchedule[];
  semesterId: Guid;
  color: string;
  isFullyLoaded?: boolean;
}

export class ViewItemClass extends BaseViewItemWithImages<IViewItemClassProps> {
  get itemType() { return PowerItemType.Class; }
  @observable schedules?: ViewItemSchedule[];
  @observable semesterId: Guid;
  @observable color: string;
  @observable megaItems: ViewItemMegaItem[] = [];
  private isFullyLoaded: boolean;
  @observable isLoading: boolean = false;
  @observable failedLoadingFullError?: string;

  constructor(props:IViewItemClassProps) {
    super(props);
    this.schedules = props.schedules;
    this.semesterId = props.semesterId;
    this.color = props.color;
    this.isFullyLoaded = props.isFullyLoaded ?? false;
  }

  removeMegaItem(item:ViewItemMegaItem) {
    const index = this.megaItems.indexOf(item);
    if (index !== -1) {
      this.megaItems.splice(index, 1);
    }
  }

  async loadFullIfNeeded() {
    if (this.isFullyLoaded || this.isLoading) {
      return;
    }
    try {
      this.isLoading = true;

      var resp = await Api.getFullClassAsync(this.identifier);
      if (resp.Error) {
        this.failedLoadingFullError = resp.Error;
      } else {
        this.details = resp.Details;
        this.imageNames = resp.ImageNames;
        this.isFullyLoaded = true;
      }
    } catch {
      this.failedLoadingFullError = "Network error";
    }

    this.isLoading = false;
  }

  compareTo(otherAny:any) {
    if (otherAny instanceof ViewItemClass) {
      const other = otherAny as ViewItemClass;
      const thisName = this.name.toLowerCase();
      const otherName = other.name.toLowerCase();

      if (thisName < otherName) {
        return -1;
      } else if (thisName > otherName) {
        return 1;
      }
    }

    return super.compareTo(otherAny);
  }

  static fromBasicClassInfoWithSchedules(from:IPowerBasicClassInfoWithSchedules, semesterId:Guid) {
    var c = new ViewItemClass({
      identifier: IGuid.toGuid(from.Identifier),
      name: from.Name,
      color: from.Color,
      semesterId: semesterId,
      schedules: []
    });
    for (var i = 0; i < from.Schedules.length; i++) {
      var s = ViewItemSchedule.fromBasicScheduleInfo(from.Schedules[i], c);
      c.schedules!.push(s);
    }
    return c;
  }

  static fromBasicClassInfoWithSemesterInfo(from:IPowerBasicClassInfo, semesterId:Guid, semesterInfo:IPowerGetClassesSchedulesAndMegaItemsResponse) {
    var c = new ViewItemClass({
      identifier: IGuid.toGuid(from.Identifier),
      name: from.Name,
      color: from.Color,
      semesterId: semesterId
    });
    c.schedules = semesterInfo.Schedules.filter(i => i.UpperIdentifier === from.Identifier).map(i => ViewItemSchedule.fromBasicScheduleInfo(i, c));
    c.megaItems = semesterInfo.MegaItems.filter(i => i.UpperIdentifier === from.Identifier).map(i => ViewItemMegaItem.fromListItem(i, c));

    return c;
  }
}

export interface IViewItemScheduleProps extends IBaseViewItemWithImagesProps {
  class: ViewItemClass,
  dayOfWeek: DayOfWeek,
  startTime: Moment,
  endTime: Moment,
  room: string,
  scheduleWeek: PowerScheduleWeek
}

export class ViewItemSchedule extends BaseViewItemWithImages<IViewItemScheduleProps> {
  get itemType() { return PowerItemType.Schedule; }
  @observable class: ViewItemClass;
  @observable dayOfWeek: DayOfWeek;
  @observable startDateTime: Moment;
  @observable endDateTime: Moment;
  @computed get startTime() { return moment.duration(this.startDateTime.clone().diff(this.startDateTime.clone().startOf('day'))); }
  @computed get endTime() { return moment.duration(this.endDateTime.clone().diff(this.endDateTime.clone().startOf('day'))); }
  @observable room: string;
  @observable scheduleWeek: PowerScheduleWeek;

  constructor(props:IViewItemScheduleProps) {
    super(props);
    this.class = props.class;
    this.dayOfWeek = props.dayOfWeek;
    this.startDateTime = props.startTime;
    this.endDateTime = props.endTime;
    this.room = props.room;
    this.scheduleWeek = props.scheduleWeek;
  }

  static fromBasicScheduleInfo(from:IPowerBasicScheduleInfo, c:ViewItemClass) {
    return new ViewItemSchedule({
      identifier: IGuid.toGuid(from.Identifier),
      name: "",
      dayOfWeek: from.DayOfWeek,
      startTime: IDate.toMoment(from.StartTime),
      endTime: IDate.toMoment(from.EndTime),
      room: from.Room,
      scheduleWeek: from.ScheduleWeek,
      class: c
    });
  }

  compareTo(otherAny:any) {
    if (otherAny instanceof ViewItemSchedule) {
      const other = otherAny as ViewItemSchedule;
      const thisStart = this.startTime.asMilliseconds();
      const otherStart = other.startTime.asMilliseconds();
      if (thisStart < otherStart) {
        return -1;
      } else if (thisStart > otherStart) {
        return 1;
      } else {
        return super.compareTo(other);
      }
    } else {
      return super.compareTo(otherAny);
    }
  }
}