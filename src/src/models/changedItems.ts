import { PowerItemType } from "api/enums";
import { Guid } from "guid-typescript";

export default interface ChangedItem {
  type: PowerItemType;
  id: Guid;
}

export default class ChangedItems {
  private _changedItems: ChangedItem[];

  constructor(changedItems: ChangedItem[]) {
    this._changedItems = changedItems;
  }

  get changes() {
    return this._changedItems;
  }

  hasTypeChanged(type:PowerItemType) {
    return this._changedItems.find((i) => {
      return i.type == type;
    }) != undefined;
  }

  hasIdChanged(id:Guid, type:PowerItemType) {
    return this._changedItems.find((i) => {
      return i.type == type && i.id == id;
    }) != undefined;
  }
}