import { IGuid, IDate } from "api/items";
import { PowerItemType } from "api/enums";

export interface IBaseSendingItem {
  Identifier: IGuid,
  ItemType?: PowerItemType,
  UpperIdentifier?: IGuid,
  DateCreated?: IDate,
  Updated?: IDate
}

export interface IBaseSendingItemWithName extends IBaseSendingItem {
  Name?: string
}

export interface IBaseSendingItemWithDetails extends IBaseSendingItemWithName {
  Details?: string
}

export interface IBaseSendingItemWithImages extends IBaseSendingItemWithDetails {
  ImageNames?: string[]
}

export interface IBaseSendingItemTaskEventGrade extends IBaseSendingItemWithImages {
  Date?: IDate;
  GradeReceived?: number;
  GradeTotal?: number;
  IsDropped?: boolean;
  IndividualWeight?: number;
}

export interface IBaseSendingItemTaskEvent extends IBaseSendingItemTaskEventGrade {
  EndTime?: IDate;
  Reminder?: IDate;
  WeightCategoryIdentifier?: IGuid;
}

export interface IViewItemHomework extends IBaseSendingItemTaskEvent {
  PercentComplete?: number;
}

export interface IViewItemClass extends IBaseSendingItemWithImages {
  IsNoClassClass: boolean;
}