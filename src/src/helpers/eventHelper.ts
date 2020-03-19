import { SignalDispatcher } from "ste-signals";

export default class EventHelper {
  static hasSubscriptions(dispatcher: SignalDispatcher) {
    return (dispatcher as any)._subscriptions.length > 0;
  }
}