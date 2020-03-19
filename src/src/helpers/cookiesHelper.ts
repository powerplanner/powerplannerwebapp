import { Guid } from "guid-typescript";

export default class CookiesHelper {

  private static _cookieCache = new Map<string, string | null>();

  static getCookie(cname: string) : string | null {

    if (this._cookieCache.has(cname)) {
      return this._cookieCache.get(cname)!;
    }

    /* http://www.w3schools.com/js/js_cookies.asp */
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
          const val = c.substring(name.length, c.length);
          this._cookieCache.set(cname, val);
          return val;
        }
    }

    this._cookieCache.set(cname, null);
    return null;
  }

  static getCookieAsGuid(cname: string) : Guid | null {

      var c = this.getCookie(cname);

      if (c !== null) {

        if (Guid.isGuid(c)) {
          return Guid.parse(c);
        }
      }

      return null;
  }

  static setCookie(cname: string, cvalue: string, exdays: number) {

      if (cvalue === null || typeof cvalue === "undefined") {
          this.deleteCookie(cname);
          return;
      }

      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";

      this._cookieCache.set(cname, cvalue);
  }

  static deleteCookie(cname: string) {
      document.cookie = cname + "=; Max-Age=-99999999; path=/";
      this._cookieCache.delete(cname);
  }
}