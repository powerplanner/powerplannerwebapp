import * as React from "react";
import { observer } from "mobx-react";
import YearsShell from "./YearsShell";
import GlobalState from "models/globalState";
import { ViewItemYear, ViewItemSemester } from "models/viewItems";
import NavigationHelper from "helpers/navigationHelper";
import Api from "api";

const Years = observer(() => {
  const yearsState = GlobalState.mainState!.yearsState;

  const addSemester = (year: ViewItemYear) => {
    if (!GlobalState.mainState!.hasPremium) {
      if (yearsState.years!.filter(y => y.semesters.length > 0).length > 0) {
        alert("You must upgrade to premium to add multiple semesters. To upgrade to premium, use the iOS, Android, or Windows apps, and then refresh this page.");
        return;
      }
    }

    NavigationHelper.history.push(`/years/${year.identifier.toString()}/add-semester`);
  }

  const shareSemester = async (semester: ViewItemSemester) => {
    const resp = await Api.exportSemesterAsync(semester.identifier);
    if (resp.Error) {
      throw new Error(resp.Error);
    }
    return resp.UrlForSharing;
  }

  return (
    <YearsShell years={yearsState.years} error={yearsState.error} addSemester={addSemester} shareSemester={shareSemester}/>
  )
});

export default Years;