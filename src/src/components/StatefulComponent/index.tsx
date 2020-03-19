import * as React from 'react';
import { CachedItem } from "models/CachedItems";
import { Guid } from 'guid-typescript';
import { SemesterState } from 'models/SemesterState';
import GlobalState from 'models/globalState';

abstract class BaseStatefulComponent<T, P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  protected abstract getCachedItem() : CachedItem<T>;
  protected get semesterState() : SemesterState { return GlobalState.currSemesterState!; }
  private _data?: CachedItem<T>;
  protected get data() { return this._data!; }
  protected set data(value:CachedItem<T>) {
    this._data = value;
  }

  constructor(props:P) {
    super(props);
    this.resetData();
  }

  private getAndSubscribe() {
    var data = this.getCachedItem();
    return data;
  }

  private resetData() {
    this._data = this.getAndSubscribe();
  }

  protected doesNeedResetData() {
    return false;
  }
}


export interface IStatefulComponentState<T> {
  data: CachedItem<T>
}

export abstract class StatefulComponent<T, P = {}, S = {}, SS = any> extends BaseStatefulComponent<T, P, S> {
}

export interface IStatefulWithIdComponentProps {
  id: Guid;
}

export abstract class StatefulWithIdComponent<T, P = {}, S = {}> extends BaseStatefulComponent<T, P & IStatefulWithIdComponentProps, S> {
  private _currId: Guid = Guid.createEmpty();
  protected getCachedItem() {
    this._currId = this.props.id;
    return this.getCachedItemWithId(this.props.id);
  }
  protected abstract getCachedItemWithId(id:Guid) : CachedItem<T>;

  constructor (props:P & IStatefulWithIdComponentProps) {
    super(props);
  }

  // Called while rendering

  protected doesNeedResetData() {
    return this._currId != this.props.id;
  }
}