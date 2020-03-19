import { Moment, Duration } from "moment";
import * as moment from "moment";
import { ViewItemSchedule, ViewItemClass } from "./viewItems";
import ArrayHelpers from "helpers/arrayHelpers";

class BaseScheduleItem {
  topOffset: number = 0;
  leftOffset: number = 0;
  height: number = 0;
  column: number = 0;
  numOfColumns: number = 1;
  arranger: DayScheduleItemsArranger;

  // Note that the StartTime is for rendering layout purposes only, and might not correspond to the actual start time of the event.
  startTime: Duration = moment.duration(0);

  // Note that the EndTime is for rendering layout purposes only, and might not correspond to the actual end time of the event.
  endTime: Duration = moment.duration(0);

  constructor(arranger:DayScheduleItemsArranger) {
    this.arranger = arranger;
  }

  calculateOffsets() {
    this.topOffset = this.arranger.heightOfHour * (this.startTime.clone().subtract(this.arranger.startTime)).asHours();
    this.height = this.arranger.heightOfHour * (this.endTime.clone().subtract(this.startTime)).asHours();
  }
}

class ScheduleItem extends BaseScheduleItem {
  item:ViewItemSchedule;
  constructor(arranger:DayScheduleItemsArranger, viewItem:ViewItemSchedule) {
    super(arranger);
    this.item = viewItem;

    this.startTime = viewItem.startTime;
    this.endTime = viewItem.endTime;
  }
}

export default class DayScheduleItemsArranger {
  heightOfHour: number;
  date: Moment;

  // The overall start time
  startTime: Duration = moment.duration(0);

  // The overall end time
  endTime: Duration = moment.duration(0);

  minDuration: Duration;
  scheduleItems: ScheduleItem[];

  constructor(props:{
    classes: ViewItemClass[],
    date: Moment,
    heightOfHour: number,
    spacingWhenNoAdditionalItems: number,
    spacingWithAdditionalItems: number,
    widthOfCollapsed: number
  }) {
    this.heightOfHour = props.heightOfHour;
    this.date = props.date;
    this.minDuration = moment.duration(props.widthOfCollapsed / props.heightOfHour, "hours");

    const dayOfWeek = props.date.weekday();

    const schedules = props.classes.map(i => i.schedules!).reduce((prev, el) => prev.concat(el)).filter(i => i.dayOfWeek === dayOfWeek);

    const scheduleItemsCopy = schedules.filter(i => i.endTime > i.startTime).map(i => new ScheduleItem(this, i));
    this.scheduleItems = scheduleItemsCopy.filter(i => true);

    // Handle schedule collisions
    // while (scheduleItems.length > 0) {
    //   const collidingSchedules:ScheduleItem[] = [scheduleItems[0]];
    //   scheduleItems.splice(0, 1);

    // }

    if (this.scheduleItems.length > 0) {
      this.startTime = ArrayHelpers.min(this.scheduleItems, i => i.startTime)!.startTime;
      this.endTime = ArrayHelpers.max(this.scheduleItems, i => i.endTime)!.endTime;
    }

    this.calculateOffsets();
  }

  get isValid() {
    return this.scheduleItems.length > 0;
  }

  calculateOffsets() {
    this.scheduleItems.forEach(s => s.calculateOffsets());
  }

  private static addColliding<T extends BaseScheduleItem>(copiedList:T[], into:T[]) {
    for (let i = 0; i < copiedList.length; i++) {
      // if ()
    }
  }

  private static addCollidingItem<T extends BaseScheduleItem>(incoming: T, into:T[]) {
    for (let i = 0; i < into.length; i++) {
      const existing = into[i];
    }
  }
}