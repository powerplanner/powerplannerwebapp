
import * as React from "react";
import { PowerItemType, MegaItemType, DateValues } from "api/enums";
import { ViewItemClass } from "models/viewItems";
import { Guid } from "guid-typescript";
import { Moment } from "moment";
import * as moment from "moment";
import GlobalState from "models/globalState";
import Api from "api";
import AddClassDialogShell, { AddClassDialogShellFormState } from "./AddClassDialogShell";

const AddClassDialog = (props:{
  classToEdit?: ViewItemClass
}) => {

  const saveAsync = async (data:AddClassDialogShellFormState) => {
    if (props.classToEdit) {
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: props.classToEdit.identifier,
          itemType: PowerItemType.Class,
          name: data.name,
          color: data.color!
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      } else {
        props.classToEdit.name = data.name;
        props.classToEdit.color = data.color!;
        return true;
      }
    } else {
      const id = Guid.create();
      const dateCreated = moment();
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: id,
          itemType: PowerItemType.Class,
          name: data.name,
          color: data.color!,
          semesterIdentifier: GlobalState.currSemesterState!.semesterId
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      }

      const newItem = new ViewItemClass({
        identifier: id,
        name: data.name,
        details: "",
        color: data.color!,
        semesterId: GlobalState.currSemesterState!.semesterId
      });
      GlobalState.currSemesterState!.addClass(newItem);
      return true;
    }
  }

  return (
    <AddClassDialogShell
      open={true}
      itemToEdit={props.classToEdit}
      onSave={saveAsync}/>
  );
}

export default AddClassDialog;