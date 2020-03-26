import AccountHelper from "helpers/accountHelper";
import Api from "api";
import { Guid } from "guid-typescript";
import { IPowerBasicClassInfoWithSchedules, IGuid, IDate } from "api/items";
import { ViewItemClass } from "models/viewItems";
import { SemesterState } from "./SemesterState";
import * as moment from "moment";
import { Moment } from "moment";
import { observable, computed } from "mobx";
import YearsState from "./yearsState";

export class MainState {
  @observable private _loadingSemester = true;
  @computed get loadingSemester() { return this._loadingSemester; }

  @observable private _currSemesterState: SemesterState | null = null;
  @computed get currSemesterState() { return this._currSemesterState; }

  private _yearsState?: YearsState;
  get yearsState() {
    if (this._yearsState === undefined) {
      this._yearsState = new YearsState();
    }
    return this._yearsState;
  }

  private _weekOneStartsOn: Moment = moment();
  private _premiumAccountExpiresOn: Moment = moment();

  get hasPremium() {
    return this._premiumAccountExpiresOn.isAfter(moment());
  }

  @computed get hasSemesterAndClasses() : boolean {
    return (this.hasSemester && this.currSemesterState!.classes.length > 0) ? true : false;
  }

  @computed get hasSemester() : boolean {
    return this.currSemesterState != null;
  }

  async loadSemesterAsync(semesterId: Guid) {
    this._loadingSemester = true;
    this._currSemesterState = null;
    try {
      var semesterContent = await Api.getClassesSchedulesAndMegaItemsAsync(semesterId);
      var classes = semesterContent.Classes.map(function (c) {
        return ViewItemClass.fromBasicClassInfoWithSemesterInfo(c, semesterId, semesterContent);
      });
      this._currSemesterState = new SemesterState(semesterId, classes);
      this._weekOneStartsOn = IDate.toMoment(semesterContent.WeekOneStartsOn);
    } catch (err) {
      console.log(err.toString());
    }
    this._loadingSemester = false;
  }

  constructor() {
    this.initialize();
  }

  private async initialize() {

    try {
      let semesterId = AccountHelper.getCurrentSemesterId();

      if (semesterId == null) {
        // Try loading current semester from online
        var currSemesterIdResponse = await Api.getSelectedSemesterId();
        semesterId = Guid.parse(currSemesterIdResponse.SelectedSemesterId as string);
        if (!semesterId.isEmpty()) {
          await this.setCurrentSemesterAsync(semesterId);;
        }
      } else {
        await this.setCurrentSemesterAsync(semesterId);
      }

      this._loadingSemester = false;
    } catch {
      this._loadingSemester = false;
    }
  }

  async setCurrentSemesterAsync(semesterId:Guid) {
    if (this.currSemesterState && this.currSemesterState.semesterId.equals(semesterId)) {
      return;
    }

    AccountHelper.saveCurrentSemesterId(semesterId);

    try {
      await this.loadSemesterAsync(semesterId);
    } catch { this._loadingSemester = false; }
  }
}