import * as React from "react";
import { ViewItemYear, ViewItemSemester } from "models/viewItems";
import { observer } from "mobx-react";
import { CircularProgress, makeStyles, Paper, Typography, Button } from "@material-ui/core";
import { useHistory, Link as RouterLink } from "react-router-dom";
import GlobalState from "models/globalState";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(2),
    boxSizing: "border-box",
    overflowY: "auto"
  },
  yearRoot: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    backgroundColor: "#eeeeee"
  },
  yearName: {
    fontWeight: 500
  },
  semesterName: {
    fontWeight: 500
  },
  semesterRoot: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: "#dddddd"
  },
  openSemesterButton: {
    marginTop: theme.spacing(2)
  },
  addYearButton: {
    marginTop: theme.spacing(2)
  },
  addSemesterButton: {
    marginTop: theme.spacing(2)
  }
}));

const YearsShell = observer((props:{
  years?: ViewItemYear[],
  error?: string,
  addSemester?: (year: ViewItemYear) => void
}) => {

  const classes = useStyles();
  const history = useHistory();

  if (props.error) {
    return <p>{props.error}</p>
  }

  if (!props.years) {
    return (
      <CircularProgress/>
    )
  }

  const Semester = (semesterProps:{
    semester: ViewItemSemester,
    year: ViewItemYear
  }) => {

    const openSemester = async (s:ViewItemSemester) => {
      GlobalState.mainState!.setCurrentSemesterAsync(s.identifier);
      history.replace("/calendar");
    }

    return (
      <Paper className={classes.semesterRoot} elevation={1}>
        <Typography className={classes.semesterName} variant="h6" onClick={() => history.push(`/years/${semesterProps.year.identifier.toString()}/${semesterProps.semester.identifier.toString()}/edit`)}>{semesterProps.semester.name}</Typography>
        {semesterProps.semester.classes.map((c, i) => (
          <Typography key={i} variant="caption" component="p">{c.name}</Typography>
        ))}
        <Button className={classes.openSemesterButton} variant="contained" color="primary" onClick={() => openSemester(semesterProps.semester)} fullWidth>Open semester</Button>
      </Paper>
    );
  }

  const Year = (yearProps:{
    year: ViewItemYear
  }) => {
    return (
      <Paper className={classes.yearRoot} elevation={1}>
        <Typography className={classes.yearName} variant="h5" onClick={() => history.push("/years/" + yearProps.year.identifier.toString() + "/edit")}>{yearProps.year.name}</Typography>
        {yearProps.year.semesters.map(s => <Semester key={s.identifier.toString()} semester={s} year={yearProps.year}/>)}
        <Button className={classes.addSemesterButton} variant="contained" fullWidth onClick={() => props.addSemester!(yearProps.year)}>Add semester</Button>
      </Paper>
    );
  }

  return (
    <div className={classes.root}>
      {props.years.map(y => (
        <Year key={y.identifier.toString()} year={y}/>
      ))}
      <Button className={classes.addYearButton} variant="contained" fullWidth component={RouterLink} to="/years/add-year">Add year</Button>
    </div>
  )
});

export default YearsShell;