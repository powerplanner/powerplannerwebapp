import * as React from "react";
import { observer } from "mobx-react";
import YearsShell from "./YearsShell";
import GlobalState from "models/globalState";

const Years = observer(() => {
  const yearsState = GlobalState.mainState!.yearsState;
  return (
    <YearsShell years={yearsState.years} error={yearsState.error}/>
  )
});

export default Years;