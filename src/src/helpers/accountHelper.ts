import CookiesHelper from "./cookiesHelper";
import { Guid } from "guid-typescript";

export class AccountCredentials {
  private _accountId: number;
  private _username: string;
  private _session: string;

  constructor(accountId: number, username: string, session: string) {
    this._accountId = accountId;
    this._username = username;
    this._session = session;
  }

  get accountId() {
    return this._accountId;
  }

  get username() {
    return this._username;
  }

  get session() {
    return this._session;
  }
}

export default class AccountHelper {
  private static _keyUsername = "Username";
  private static _keyAccountId = "AccountId";
  private static _keySession = "Session";
  private static _keyCurrentSemester = "CurrentSemester";
  private static _keyCurrentClass = "CurrentClass";
  private static _keySelectedItem = "SelectedItem";
  private static _keyLastKnownPath = "LastKnownPath";

  static getAccountId() : number {
    var cookie = CookiesHelper.getCookie(this._keyAccountId);

    if (cookie === null)
        return -1;

    var answer = parseInt(cookie);

    if (isNaN(answer))
        return -1;

    return answer;
  }

  static getUsername() : string | null {
      return CookiesHelper.getCookie(this._keyUsername);
  }

  static getSession() : string | null {
      return CookiesHelper.getCookie(this._keySession);
  }

  static getCurrentSemesterId() : Guid | null {
    return CookiesHelper.getCookieAsGuid(this._keyCurrentSemester);
  }

  static saveCurrentSemesterId(value: Guid) {
    CookiesHelper.setCookie(this._keyCurrentSemester, value.toString(), 1000);
  }

  // Returns "/" if none was found
  static getLastKnownPath() : string {
    var path = CookiesHelper.getCookie(this._keyLastKnownPath);
    if (path) {
      return path;
    }
    return "/";
  }

  static setLastKnownPath(value: string) {
    CookiesHelper.setCookie(this._keyLastKnownPath, value, 1000);
  }

  // Sets the cookies related to login
  static setLoginCookies(
    accountId: number,
    username: string,
    session: string) {
      CookiesHelper.setCookie(this._keyAccountId, accountId.toString(), 1000);
      CookiesHelper.setCookie(this._keyUsername, username, 1000);
      CookiesHelper.setCookie(this._keySession, session, 1000);
  }

  // Returns valid credentials, or else throws an error
  static getAccountCredentials() : AccountCredentials {
    var accountId = this.getAccountId();
    var username = this.getUsername();
    var session = this.getSession();

    if (accountId == -1 || username == null || session == null) {
      throw new Error("Account credentials not present");
    }

    return new AccountCredentials(accountId, username, session);
  }

  static hasAccountCredentials() {
    try {
      this.getAccountCredentials();
      return true;
    } catch (err) {
      return false;
    }
  }

  // Removes all cookies and navigates to log in page
  static logout() {
    this.deleteCookies();
    window.location.assign("/login");
  }

  static deleteCookies() {
    CookiesHelper.deleteCookie(this._keyAccountId);
    CookiesHelper.deleteCookie(this._keyCurrentClass);
    CookiesHelper.deleteCookie(this._keyCurrentSemester);
    CookiesHelper.deleteCookie(this._keySelectedItem);
    CookiesHelper.deleteCookie(this._keySession);
    CookiesHelper.deleteCookie(this._keyUsername);
    CookiesHelper.deleteCookie(this._keyLastKnownPath);
  }
}