import * as React from "react";
import { observer } from "mobx-react";
import YearsShell from "./YearsShell";
import GlobalState from "models/globalState";
import { ViewItemYear } from "models/viewItems";
import NavigationHelper from "helpers/navigationHelper";

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

  return (
    <YearsShell years={yearsState.years} error={yearsState.error} addSemester={addSemester}/>
  )
});

export default Years;