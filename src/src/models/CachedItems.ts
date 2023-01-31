import { ISignal, SignalDispatcher } from "ste-signals";
import EventHelper from "helpers/eventHelper";
import { Guid } from "guid-typescript";
import { observable, computed } from "mobx";

class BaseCachedItem {
  loading = false;
  error: string | null = null;
}

export class CachedItem<T> {
  @observable private _loading = false;
  @computed get loading() { return this._loading; }

  @observable private _error: string | null = null;
  @computed get error() { return this._error; }
  @computed get hasError() { return this._error != null; }

  @observable private _item: T | null = null;
  @computed get item() { return this._item; }
  @computed get hasItem() { return this._item != null; }

  @observable private _isFullyLoaded = false;
  @computed get isFullyLoaded() { return this._isFullyLoaded; }

  private _loadFunction: () => Promise<T>;

  constructor(loadFunction: () => Promise<T>, partialItem: T | null) {
    this._loadFunction = loadFunction;
    if (partialItem != null) {
      this._item = partialItem;
    }
  }

  populateFromPartial(partialItem:T) {
    if (!this._item) {
      this._item = partialItem;
    }
  }

  needsLoad() {
    if (this.loading) {
      return false;
    }
    if (this.item != null && this.isFullyLoaded) {
      return false;
    }
    return true;
  }

  async loadAsync() {
    if (this.loading) {
      return;
    }

    try {
      this._loading = true;
      this._error = null;
      this._item = await this._loadFunction();
      this._isFullyLoaded = true;
    } catch (err: any) {
      this._error = err.toString();
    }

    this._loading = false;
  }

  async loadIfNeededAsync() {
    if (this.needsLoad()) {
      await this.loadAsync();
    }
  }
}

export class CachedItems<T> {
  private _cached: Map<string, CachedItem<T>> = new Map<string, CachedItem<T>>();
  private _loadItemFunction: (id:Guid) => Promise<T>;

  constructor(loadItemFunction: (id:Guid) => Promise<T>) {
    this._loadItemFunction = loadItemFunction;
  }

  get(id:Guid) : CachedItem<T> | null {
    const idStr = id.toString();
    if (this._cached.has(idStr)) {
      return this._cached.get(idStr)!;
    }
    return null;
  }

  getOrCreate(id:Guid) {
    var existing = this.get(id);
    if (existing !== null) {
      return existing;
    }
    return this.create(id, null);
  }

  cachePartial(id:Guid, partialItem:T) {
    const existing = this.get(id);
    if (existing === null) {
      return this.create(id, partialItem);
    } else {
      return existing;
    }
  }

  private create(id:Guid, partialItem: T | null) {
    var newItem = new CachedItem<T>(() => {
      return this._loadItemFunction(id);
    }, partialItem);
    this._cached.set(id.toString(), newItem);
    return newItem;
  }
  // addOrUpdatePartial(id:Guid, item:T) : CachedItem<T> {
  //   var cachedItem = this.get(id);
  //   if (cachedItem == null) {
  //     cachedItem = new CachedItem<T>();
  //     this._cached[id.toString()] = cachedItem;
  //   }
  //   cachedItem.update()
  // }
}