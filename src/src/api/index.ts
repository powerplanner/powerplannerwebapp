import * as Responses from "./responses";
import { Guid } from "guid-typescript";
import Util from "./util";
import { Moment } from "moment";
import { PowerItemType, DayOfWeek, PowerScheduleWeek, MegaItemType } from "./enums";
import * as moment from "moment";

export default class Api {

  static logOutHandler?: () => void;

  static async logInAsync(username: string, password: string) {
    return await Util.postSilentRequestAsync<Responses.IPowerLoginModernResponse>("/LoginWeb", {
      Username: username,
      Password: password
    });
  }

  static async createAccountAsync(username: string, email: string, password: string) {
    return await Util.postSilentRequestAsync<Responses.IPowerCreateAccountResponse>("/CreateAccountWeb", {
      Username: username,
      Email: email,
      Password: password
    });
  }

  static async forgotUsernameAsync(email: string) {
    return await Util.postSilentRequestAsync<Responses.IPowerForgotUsernameResponse>("/ForgotUsernameModern", {
      Email: email
    });
  }

  static async resetPasswordAsync(username: string, email: string) {
    return await Util.postSilentRequestAsync<Responses.IPowerResetPasswordResponse>("/ResetPasswordModern", {
      Username: username,
      Email: email
    });
  }

  static async deleteAccountAsync() {
    return await this.postRequestAsync("/DeleteAccountModern", {});
  }

  static async getAgendaAsync(semesterId: Guid) : Promise<Responses.IPowerGetAgendaResponse> {
    return await this.postRequestAsync("/GetAgenda", {
      SemesterIdentifier: semesterId.toString(),
      CurrentTime: new Date().toISOString()
    });
  }

  static async getSelectedSemesterId() {
    return await this.postRequestAsync<Responses.IPowerSelectedSemesterIdResponse>("/GetSelectedSemesterId", {});
  }

  static async getClassesAndSchedulesAsync(semesterId: Guid) {
    return await this.postRequestAsync<Responses.IPowerGetClassesAndScheduleResponse>("/GetClassesAndSchedules", {
      SemesterIdentifier: semesterId.toString()
    });
  }

  static async getClassesSchedulesAndMegaItemsAsync(semesterId: Guid) {
    return await this.postRequestAsync<Responses.IPowerGetClassesSchedulesAndMegaItemsResponse>("/GetClassesSchedulesAndMegaItems", {
      SemesterIdentifier: semesterId.toString()
    });
  }

  static async getYearsAndSemestersAsync() {
    return await this.postRequestAsync<Responses.IPowerGetYearsAndSemestersResponse>("/GetYearsAndSemesters", {});
  }

  static async getTaskAsync(taskId: Guid) : Promise<Responses.IPowerGetTaskEventResponse> {
    return await this.postRequestAsync("/GetHomework", {
      Identifier: taskId.toString()
    });
  }

  static async getEventAsync(taskId: Guid) : Promise<Responses.IPowerGetTaskEventResponse> {
    return await this.postRequestAsync("/GetExam", {
      Identifier: taskId.toString()
    });
  }

  static async getFullMegaItemAsync(id: Guid) : Promise<Responses.IPowerGetFullMegaItemResponse> {
    return await this.postRequestAsync("/GetFullMegaItem", {
      Identifier: id.toString()
    });
  }

  static async getFullClassAsync(id: Guid) : Promise<Responses.IPowerGetFullClassResponse> {
    return await this.postRequestAsync("/GetFullClass", {
      Identifier: id.toString()
    });
  }

  private static dateToString(date?:Moment) {
    if (!date) {
      return undefined;
    }
    const answer = moment.utc().set({
      year: date.year(),
      month: date.month(),
      day: date.day(),
      hour: date.hour(),
      minute: date.minute(),
      second: date.second(),
      millisecond: date.millisecond()
    }).toISOString();
    return answer;
  }

  static async modifyAsync(request:{
    updates?: {
      identifier: Guid,
      itemType: PowerItemType,
      name?: string,
      details?: string,
      date?: Moment,
      endTime?: Moment,
      percentComplete?: number,
      start?: Moment,
      end?: Moment,
      startDate?: Moment,
      endDate?: Moment,
      credits?: number,
      color?: string,
      dayOfWeek?: DayOfWeek,
      startTime?: Moment,
      room?: string,
      scheduleWeek?: PowerScheduleWeek,
      yearIdentifier?: Guid,
      semesterIdentifier?: Guid,
      classIdentifier?: Guid,
      megaItemType?: MegaItemType
    }[],
    deletes?: Guid[]
  }) {
    let Updates:any[] | undefined = undefined;
    if (request.updates) {
      Updates = request.updates.map(i => {
        return {
          Identifier: i.identifier.toString(),
          ItemType: i.itemType,
          Name: i.name,
          Details: i.details,
          Date: Api.dateToString(i.date),
          EndTime: Api.dateToString(i.endTime),
          PercentComplete: i.percentComplete,
          Start: Api.dateToString(i.start),
          End: Api.dateToString(i.end),
          StartDate: Api.dateToString(i.startDate),
          EndDate: Api.dateToString(i.endDate),
          Credits: i.credits,
          Color: i.color,
          DayOfWeek: i.dayOfWeek,
          StartTime: Api.dateToString(i.startTime),
          Room: i.room,
          ScheduleWeek: i.scheduleWeek,
          YearIdentifier: i.yearIdentifier?.toString(),
          SemesterIdentifier: i.semesterIdentifier?.toString(),
          ClassIdentifier: i.classIdentifier?.toString(),
          MegaItemType: i.megaItemType
        };
      });
    }

    let Deletes:string[] | undefined = undefined;
    if (request.deletes) {
      Deletes = request.deletes.map(d => d.toString());
    }

    return await this.postRequestAsync("/Modify", {
      Updates: Updates,
      Deletes: Deletes,
      SyncVersion: 4
    });
  }

  private static _pendingRequests: 0;

  private static async postRequestAsync<T extends Responses.IPowerPlainResponse>(relativeUrl: string, additionalRequestData: any) : Promise<T> {
    // TODO: Notify loading
    if (this._pendingRequests < 0) {
      this._pendingRequests = 0;
    }

    this._pendingRequests++;

    var requestData = {
      ...Util.generateBaseRequestData(),
      ...additionalRequestData
    };

    try {
      var responseData = await Util.postSilentRequestAsync<T>(relativeUrl, requestData);
      this.onRequestFinished();

      if (responseData.Error) {
        if (responseData.Error === "Incorrect credentials.") {
          if (Api.logOutHandler) {
            Api.logOutHandler();
          }
          throw new Error(responseData.Error);
        }
        // TODO: Set failed message
        throw new Error(responseData.Error);
      }

      // TODO: If we haven't reported our current semester, we'll do that here
            // We do this to cover the following case...
            // User opened app on another browser, selected a different semester, but then stopped using that browser
            // Now on their normal browser, since we don't re-request selected semester from server, it'll still be displaying their previous semester
            // Since they're actively using that browser, we need to make sure we send up that semester, so future new browsers will pick it up
            // if (!PowerPlanner.Home.hasReportedSelectedSemesterToServer)
            //     PowerPlanner.Home.reportCurrentSemesterToServer();

      return responseData;

    } catch (err) {
      this.onRequestFinished();
      // TODO: Set failed message
      throw err;
    }
  }

  private static onRequestFinished() {
    this._pendingRequests--;
    // TODO: Notify done
  }
}