
import * as React from "react";
import { PowerItemType, MegaItemType, DateValues } from "api/enums";
import { ViewItemYear } from "models/viewItems";
import { Guid } from "guid-typescript";
import { Moment } from "moment";
import * as moment from "moment";
import GlobalState from "models/globalState";
import Api from "api";
import AddYearDialogShell, { AddYearDialogShellFormState } from "./AddYearDialogShell";
import NavigationHelper from "helpers/navigationHelper";

const AddYearDialog = (props:{
  yearToEdit?: ViewItemYear
}) => {

  const handleDelete = async () => {
    var resp = await Api.modifyAsync({
      deletes: [props.yearToEdit!.identifier]
    });
    if (resp.Error) {
      alert(resp.Error);
      return false;
    } else {
      NavigationHelper.goBack();
      GlobalState.mainState!.yearsState.removeYear(props.yearToEdit!);
      return true;
    }
  }

  const saveAsync = async (data:AddYearDialogShellFormState) => {
    if (props.yearToEdit) {
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: props.yearToEdit.identifier,
          itemType: PowerItemType.Year,
          name: data.name
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      } else {
        props.yearToEdit.name = data.name;
        return true;
      }
    } else {
      const id = Guid.create();
      const dateCreated = moment();
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: id,
          itemType: PowerItemType.Year,
          name: data.name
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      }

      const newItem = new ViewItemYear({
        identifier: id,
        name: data.name
      });
      GlobalState.mainState!.yearsState.years!.push(newItem);
      return true;
    }
  }

  return (
    <AddYearDialogShell
      open={true}
      itemToEdit={props.yearToEdit}
      onSave={saveAsync}
      onDelete={handleDelete}/>
  );
}

export default AddYearDialog;