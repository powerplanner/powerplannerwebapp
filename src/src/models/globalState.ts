import { observable, computed } from "mobx";
import { MainState } from "./mainState";
import AccountHelper from "helpers/accountHelper";
import { Moment } from "moment";
import * as moment from "moment";
import Api from "api";

class GlobalStateClass {
  @computed get loggedIn() { return this.mainState !== undefined; }

  @observable private _mainState?:MainState = undefined;
  @computed get mainState() { return this._mainState; }

  constructor() {
    Api.logOutHandler = this.logOut;
    this.updateMainState();
  }

  @computed get currSemesterState() { return this.mainState?.currSemesterState; }

  private _newTaskDate?: Moment;
  setNewTaskDate(date:Moment) {
    this._newTaskDate = date.clone().startOf('day');
  }

  getNewTaskDate() {
    if (this._newTaskDate) {
      const answer = this._newTaskDate;
      this._newTaskDate = undefined;
      return answer;
    } else {
      return moment().startOf('day');
    }
  }

  logOut() {
    AccountHelper.deleteCookies();
    this._mainState = undefined;
  }

  updateMainState() {
    if (AccountHelper.hasAccountCredentials()) {
      this._mainState = new MainState();
    } else {
      this._mainState = undefined;
    }
  }
}

const GlobalState = new GlobalStateClass();

export default GlobalState;