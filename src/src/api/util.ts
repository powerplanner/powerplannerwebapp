import { Guid } from "guid-typescript";
import AccountHelper from "helpers/accountHelper";

// Rate-limited development key
const hashedKey = "3a4d3d842fd5c63e8c8ba5677c18abcc59affe2f3a8179081180d56a67376a74";
const baseUrl = "https://web.api.powerplanner.net/api";
// const baseUrl = "https://powerplannerwebsite-staging.azurewebsites.net/api";
// const baseUrl = "https://localhost:44399/api";

export default class Util {

  // Doesn't trigger loading indicator or anything else. Just silently sends.
  static async postSilentRequestAsync<T>(relativeUrl: string, data: any) : Promise<T> {

    if (data == null)
      throw new Error("data was null");

    var url = baseUrl + relativeUrl;

    var response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        HashedKey: hashedKey
      }
    });

    if (!response.ok) {
      throw new Error("Network response was " + response.status);
    }

    var obj = await response.json();
    return obj as T;
  }

  static generateBaseRequestData() {
    // Throws an error if credentials don't exist
    var credentials = AccountHelper.getAccountCredentials();

      return {
          Login: {
              AccountId: credentials.accountId,
              Username: credentials.username,
              Password: credentials.session
          }
      };
  }

  

}