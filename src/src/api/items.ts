import { Guid } from "guid-typescript";
import { PowerItemType, DayOfWeek, PowerScheduleWeek, MegaItemType } from "./enums";
import * as moment from "moment";
import { Moment } from "moment";

export class IDate {
  // Just a string
  static toMoment(value: IDate) : Moment {
    return moment(value as string);
  }
}

export class IGuid {
  // Just a string
  static toGuid(value: IGuid) : Guid {
    return Guid.parse(value as string);
  }
}

export interface IPowerListItemTaskOrEvent {
  ItemType: PowerItemType
  Identifier: IGuid,
  Name: string,
  ShortDetails: string,
  Date: IDate,
  DateCreated: IDate,
  ClassIdentifier: IGuid,
  PercentComplete?: number
};

export interface IPowerListItemMegaItem {
  MegaItemType: MegaItemType,
  Identifier: IGuid,
  Name: string,
  ShortDetails: string,
  Date: IDate,
  EndTime: IDate,
  DateCreated: IDate,
  UpperIdentifier: IGuid,
  PercentComplete: number
}

export interface IPowerBasicClassInfo {
  Identifier: IGuid,
  Name: string,
  Color: string
};

export interface IPowerBasicScheduleInfo {
  UpperIdentifier: IGuid,
  Identifier: IGuid,
  Room: string,
  StartTime: IDate,
  EndTime: IDate,
  DayOfWeek: DayOfWeek,
  ScheduleWeek: PowerScheduleWeek
}

export interface IPowerBasicClassInfoWithSchedules extends IPowerBasicClassInfo {
  Schedules: IPowerBasicScheduleInfo[]
}