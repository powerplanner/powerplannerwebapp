import * as React from 'react';
import { IStatefulWithIdComponentProps, StatefulWithIdComponent } from "components/StatefulComponent";
import { Guid } from "guid-typescript";
import { PopupDialogBase, PopupDialogBaseProps, PopupDialogBaseState } from "components/PopupDialog/PopupDialogBase";
import { SemesterState } from 'models/SemesterState';
import { ISignal } from 'ste-signals';
import { SimpleEventDispatcher, ISimpleEvent } from "ste-simple-events";
import CircularProgress from '@material-ui/core/CircularProgress';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { Typography } from '@material-ui/core';
import GlobalState from "models/globalState";
import NavigationHelper from 'helpers/navigationHelper';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import MoreIcon from '@material-ui/icons/MoreVert';

export interface AddEditDialogMoreActionItem {
  title:string,
  action:() => any
}

export interface AddEditDialogProps<T> extends PopupDialogBaseProps {
  itemToEdit?: T
}

export interface AddEditDialogState extends PopupDialogBaseState {
  moreOptionsAnchorEl?: Element
}

export abstract class AddEditDialog<T, P = {}, S = {}> extends PopupDialogBase<P & AddEditDialogProps<T>, AddEditDialogState> {
  private _semesterState?: SemesterState;
  protected get semesterState() : SemesterState { return this._semesterState!; }
  private _initialFormState: S;
  get formState() {
    if (this._formComponent == undefined) {
      return this._initialFormState!;
    }
    return this._formComponent!.state;
  }

  private _saveError?: string;
  get saveError() {
    return this._saveError;
  }

  constructor(props:P & AddEditDialogProps<T>) {
    super(props);

    this._semesterState = GlobalState.currSemesterState!;

    this._initialFormState = this.createDefaultFormState();

    this.state = {
    };
  }

  getTitle() {
    return (this.isEditing ? "EDIT " : "ADD ") + this.getItemTitle();
  }

  // Should return something like "TASK" or "EVENT"
  abstract getItemTitle() : string;

  get isEditing() { return this.props.itemToEdit !== undefined; }

  setFormState = <K extends keyof S>(
    state: ((prevState: Readonly<S>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null)
): void => {
  this._formComponent!.setState(state);
    // this._onSetFormState.dispatch(state);
}

//   private _onSetFormState = new SimpleEventDispatcher<<K extends keyof S>(
//     state: ((prevState: Readonly<S>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null)
// ) => void>();
  private _onSetFormState = new SimpleEventDispatcher<any>();
  private get onSetFormState() {
    return this._onSetFormState.asEvent();
  }

  handleSave = async () => {
    try {
      this._saveError = undefined;
      this._saving = true;
      this.disabled = true;
      this.forceUpdate();
      const result = await this.saveAsync();
      if (result) {
        NavigationHelper.goBack();
      } else {
        this._saving = false;
        this.disabled = false;
        this.forceUpdate();
      }
    } catch (err: any) {
      this._saving = false;
      this._saveError = err.toString();
      this.disabled = false;
      this.forceUpdate();
    }
  }

  abstract saveAsync() : Promise<boolean>;

  onMoreIconClick = (event:any) => {
    this.setState({
      moreOptionsAnchorEl: event.currentTarget
    });
  }

  getAdditionalIcons = () => {
    const moreActions = this.getMoreActions();
    return (
      <>
        <IconButton color="inherit" onClick={this.handleSave} disabled={this.disabled}>
          <DoneIcon />
        </IconButton>
        {moreActions.length > 0 && (
          <>
          <IconButton color="inherit" disabled={this.disabled} onClick={this.onMoreIconClick}>
            <MoreIcon/>
          </IconButton>
          <Menu
            id="moreOptions"
            anchorEl={this.state.moreOptionsAnchorEl}
            keepMounted
            open={Boolean(this.state.moreOptionsAnchorEl)}
            onClose={() => this.setState({moreOptionsAnchorEl: undefined})}
          >
            {moreActions.map((a, i) => (
              <MenuItem key={i} onClick={() => {a.action(); this.setState({moreOptionsAnchorEl: undefined})}}>{a.title}</MenuItem>
            ))}
          </Menu>
          </>
        )}
      </>
    )
  }

  getMoreActions:() => AddEditDialogMoreActionItem[] = () => {
    return [];
  }

  private _saving: boolean = false;
  get saving() { return this._saving; }

  get loading() : boolean {
    return false;
  }

  private _formComponent?: FormComponent<S>;

  renderContent() {
    return (
      <>
        {this.saveError && <Typography variant="body1" color="error">
          {this.saveError}
        </Typography>}

        <MuiPickersUtilsProvider utils={MomentUtils}>
          <FormComponent renderForm={this.renderForm} onSetFormState={this.onSetFormState} initialFormState={this._initialFormState} ref={(c) => this._formComponent = c as any}/>
        </MuiPickersUtilsProvider>

        {(this.loading || this.saving) && <CircularProgress size={24} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: -12,
          marginLeft: -12,
        }} />}
      </>
    );
  }

  protected abstract renderForm() : React.ReactNode;

  protected abstract createDefaultFormState() : S;
}

interface FormComponentProps<S> {
  renderForm: () => React.ReactNode;
  initialFormState: S;
  onSetFormState: ISimpleEvent<any>;
}

class FormComponent<S> extends React.Component<FormComponentProps<S>, S> {
  private _currOnSetFormState?: ISimpleEvent<any>;
  private _unsub?: () => void;

  constructor(props:FormComponentProps<S>) {
    super(props);
    this.state = props.initialFormState;
  }

  render() {
    if (this._currOnSetFormState != this.props.onSetFormState) {
      if (this._unsub) {
        this._unsub();
      }
      this._unsub = this.props.onSetFormState.subscribe(this.onSetFormState);
      this._currOnSetFormState = this.props.onSetFormState;
    }
    return this.props.renderForm();
  }

  componentWillUnmount() {
    if (this._unsub) {
      this._unsub();
    }
  }

  onSetFormState = (state:any) => {
    this.setState(state);
  }
}