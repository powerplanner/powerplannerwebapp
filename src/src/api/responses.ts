import { IPowerListItemTaskOrEvent, IPowerBasicClassInfoWithSchedules, IGuid, IDate, IPowerBasicClassInfo, IPowerListItemMegaItem, IPowerBasicScheduleInfo } from "./items";
import { Guid } from "guid-typescript";

export interface IPowerPlainResponse {
  Error?: string
}

export interface IPowerGetAgendaResponse extends IPowerPlainResponse {
  Items: IPowerListItemTaskOrEvent[],
  Classes: IPowerBasicClassInfo[] // I'm purposefully omitting the schedule portion, that info should come from a different API
};

export interface IPowerLoginModernResponse extends IPowerPlainResponse {
  AccountId: number,
  Session: string
}

export interface IPowerCreateAccountResponse extends IPowerPlainResponse {
  AccountId: number,
  Session: string
}

export interface IPowerForgotUsernameResponse extends IPowerPlainResponse {
  Usernames: string[]
}

export interface IPowerResetPasswordResponse extends IPowerPlainResponse {
  Message: string
}

export interface IPowerSelectedSemesterIdResponse extends IPowerPlainResponse {
  SelectedSemesterId: IGuid
}

export interface IPowerGetClassesAndScheduleResponse extends IPowerPlainResponse {
  WeekOneStartsOn: IDate,
  Classes: IPowerBasicClassInfoWithSchedules[]
}

export interface IPowerGetClassesSchedulesAndMegaItemsResponse extends IPowerPlainResponse {
  WeekOneStartsOn: IDate,
  Classes: IPowerBasicClassInfo[],
  Schedules: IPowerBasicScheduleInfo[],
  MegaItems: IPowerListItemMegaItem[]
}

export interface IPowerGetYearsAndSemestersResponse extends IPowerPlainResponse {
  Years: {
    Identifier: IGuid,
    Name: string,
    Semesters: {
      Identifier: IGuid,
      Name: string,
      Classes: {
        Name: string
      }[]
    }[]
  }[]
}

// Technically our API has two different types for this, but they're identical enough might as well have it in one
export interface IPowerGetTaskEventResponse extends IPowerPlainResponse {
  Identifier: IGuid,
  Name: string,
  Details: string,
  Date: IDate,
  PercentComplete: number,
  ImageNames: string[],
  ClassIdentifier: IGuid
}

export interface IPowerGetFullMegaItemResponse extends IPowerPlainResponse {
  Details: string,
  ImageNames: string[]
}

export interface IPowerGetFullClassResponse extends IPowerPlainResponse {
  Details: string,
  ImageNames: string[]
}