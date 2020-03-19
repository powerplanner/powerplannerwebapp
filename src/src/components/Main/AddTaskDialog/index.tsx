
import * as React from "react";
import { StatefulComponent, IStatefulWithIdComponentProps, StatefulWithIdComponent } from "components/StatefulComponent";
import { PowerItemType, MegaItemType, DateValues } from "api/enums";
import { BaseViewItemTaskEvent, ViewItemClass, ViewItemMegaItem } from "models/viewItems";
import { Guid } from "guid-typescript";
import AddTaskDialogShell, { AddTaskDialogShellFormState } from "./AddTaskDialogShell";
import { AddEditDialog } from "../AddEditDialog";
import { Moment } from "moment";
import * as moment from "moment";
import TextField from '@material-ui/core/TextField';
import Select from "@material-ui/core/Select";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { MenuItem } from "@material-ui/core";
import GlobalState from "models/globalState";
import Api from "api";

export interface AddTaskDialogProps {
  isTask?: boolean;
}

export interface AddTaskDialogFormState {
  taskName: string;
  taskSelectedDate: Moment;
  taskSelectedClass: ViewItemClass;
  taskAvailableClasses: ViewItemClass[];
  taskDetails: string;
}

const AddTaskDialog = (props:{
  taskToEdit?: ViewItemMegaItem
  isTask?: boolean
}) => {

  const saveAsync = async (data:AddTaskDialogShellFormState) => {
    const date = data.selectedDate.clone().startOf('day');
    if (props.taskToEdit) {
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: props.taskToEdit.identifier,
          itemType: PowerItemType.MegaItem,
          name: data.name,
          details: data.details,
          date: date,
          classIdentifier: data.selectedClass.identifier
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      } else {
        props.taskToEdit.name = data.name;
        props.taskToEdit.details = data.details;
        props.taskToEdit.date = date;
        if (props.taskToEdit.class !== data.selectedClass) {
          props.taskToEdit.class.removeMegaItem(props.taskToEdit);
          data.selectedClass.megaItems.push(props.taskToEdit);
          props.taskToEdit.class = data.selectedClass;
        }
        return true;
      }
    } else {
      const id = Guid.create();
      const dateCreated = moment();
      const megaItemType = props.isTask ? MegaItemType.Homework : MegaItemType.Exam;
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: id,
          itemType: PowerItemType.MegaItem,
          name: data.name,
          details: data.details,
          date: date,
          classIdentifier: data.selectedClass.identifier,
          megaItemType: megaItemType
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      }

      const newItem = new ViewItemMegaItem({
        identifier: id,
        name: data.name,
        details: data.details,
        date: date,
        endTime: DateValues.UNASSIGNED,
        class: data.selectedClass,
        dateCreated: dateCreated,
        megaItemType: megaItemType,
        percentComplete: 0,
        isFullyLoaded: true
      });
      data.selectedClass.megaItems.push(newItem);
      return true;
    }
  }

  return (
    <AddTaskDialogShell
      open={true}
      taskType={props.isTask ? PowerItemType.Homework : PowerItemType.Exam}
      availableClasses={GlobalState.currSemesterState!.classes}
      itemToEdit={props.taskToEdit}
      onSave={saveAsync}/>
  );
}

export default AddTaskDialog;