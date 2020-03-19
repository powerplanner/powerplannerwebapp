
import * as React from "react";
import { PowerItemType, MegaItemType, DateValues } from "api/enums";
import { ViewItemSemester, ViewItemYear } from "models/viewItems";
import { Guid } from "guid-typescript";
import { Moment } from "moment";
import * as moment from "moment";
import GlobalState from "models/globalState";
import Api from "api";
import AddSemesterDialogShell, { AddSemesterDialogShellFormState } from "./AddSemesterDialogShell";
import NavigationHelper from "helpers/navigationHelper";

const AddSemesterDialog = (props:{
  semesterToEdit?: ViewItemSemester,
  year: ViewItemYear
}) => {

  const handleDeleteSemester = async () => {
    var resp = await Api.modifyAsync({
      deletes: [props.semesterToEdit!.identifier]
    });
    if (resp.Error) {
      alert(resp.Error);
      return false;
    } else {
      NavigationHelper.goBack();
      props.year.removeSemester(props.semesterToEdit!);
      return true;
    }
  }

  const saveAsync = async (data:AddSemesterDialogShellFormState) => {
    if (props.semesterToEdit) {
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: props.semesterToEdit.identifier,
          itemType: PowerItemType.Semester,
          name: data.name
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      } else {
        props.semesterToEdit.name = data.name;
        return true;
      }
    } else {
      const id = Guid.create();
      const dateCreated = moment();
      var resp = await Api.modifyAsync({
        updates: [{
          identifier: id,
          itemType: PowerItemType.Semester,
          name: data.name,
          yearIdentifier: props.year.identifier
        }]
      });
      if (resp.Error) {
        alert(resp.Error);
        return false;
      }

      const newItem = new ViewItemSemester({
        identifier: id,
        name: data.name
      });
      props.year.semesters.push(newItem);
      return true;
    }
  }

  return (
    <AddSemesterDialogShell
      open={true}
      itemToEdit={props.semesterToEdit}
      onSave={saveAsync}
      onDeleteSemester={handleDeleteSemester}/>
  );
}

export default AddSemesterDialog;