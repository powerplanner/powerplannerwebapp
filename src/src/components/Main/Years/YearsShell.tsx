import * as React from "react";
import { ViewItemYear, ViewItemSemester } from "models/viewItems";
import { observer } from "mobx-react";
import { CircularProgress, makeStyles, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@material-ui/core";
import { useHistory, Link as RouterLink } from "react-router-dom";
import GlobalState from "models/globalState";
import MoreButton from "components/MoreButton";

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
    fontWeight: 500,
    flexGrow: 1
  },
  semesterNameAndMenu: {
    display: "flex"
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
  addSemester?: (year: ViewItemYear) => void,
  shareSemester?: (semester:ViewItemSemester) => Promise<string>
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
    const [shareOpen, setShareOpen] = React.useState(false);
    const [shareUrl, setShareUrl] = React.useState<string | undefined>(undefined);

    const openSemester = async (s:ViewItemSemester) => {
      GlobalState.mainState!.setCurrentSemesterAsync(s.identifier);
      history.replace("/calendar");
    }

    const editSemester = () => {
      history.push(`/years/${semesterProps.year.identifier.toString()}/${semesterProps.semester.identifier.toString()}/edit`)
    }

    const shareSemester = () => {
      setShareOpen(true);
    }

    const ShareUrlDialog = (props:{
      url?: string,
      onClose?: () => void
    }) => {
      return (
        <Dialog
          open={props.url !== undefined}
          onClose={props.onClose}>
          <DialogTitle>Share completed!</DialogTitle>
          <DialogContent>
            <DialogContentText color="inherit" style={{whiteSpace: "pre-wrap"}}>
              {`Copy the URL below and send it to your classmates. When they click the URL, they'll be prompted to log in (or create an account), and then the semester info will be imported into their account.\n\nNote that this is a static export. Any modifications you make after this will not be shared or updated. This link will always share the exported instance of your semester at this point in time.`}
            </DialogContentText>
            <TextField
              value={props.url}
              fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={props.onClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    const ShareSemesterDialog = (props:{
      semester: ViewItemSemester,
      open: boolean,
      onClose?: () => void,
      onShare?: (semester:ViewItemSemester) => Promise<void>
    }) => {
    
      const [disabled, setDisabled] = React.useState(false);
    
      const handleClose = () => {
        if (disabled) {
          return;
        }
        if (props.onClose) {
          props.onClose();
        }
      }
    
      const handleShare = async () => {
        if (props.onShare) {
          setDisabled(true);
          try {
            await props.onShare(props.semester);
          } catch (e) {
            alert("Unknown error: " + e.toString());
          }
          setDisabled(false);
        }
      }
    
      return (
        <Dialog
          open={props.open}
          onClose={handleClose}>
          <DialogTitle>Share semester</DialogTitle>
          <DialogContent>
            <DialogContentText color="inherit" style={{whiteSpace: "pre-wrap"}}>
            Sharing a semester allows you to export the classes and schedules within your semester to your classmates. This is useful if you have a classmate that has the same classes as you, so they don't have to re-enter all the classes and schedules themselves.

            {`\n\nExported content includes...\n - Semester name, start/end date\n - Classes with name, details, color\n - Class schedules with name/time/day/room\n - Tasks/events/holidays\n - Grades (without grade received), grade scales, weight categories\n\nNote that this is a one-time export (and a one-time import on their side), any changes you make after this will not be included.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="default" onClick={handleClose} disabled={disabled}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleShare} disabled={disabled}>
              Share
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    const onShare = async (semester: ViewItemSemester) => {
      if (props.shareSemester) {
        const shareUrl = await props.shareSemester(semester);
        setShareOpen(false);
        setShareUrl(shareUrl);
      }
    }

    return (
      <Paper className={classes.semesterRoot} elevation={1}>
        <div className={classes.semesterNameAndMenu}>
          <Typography className={classes.semesterName} variant="h6" onClick={editSemester}>{semesterProps.semester.name}</Typography>
          <MoreButton menuItems={[
            {
              name: "Edit",
              onClick: editSemester
            },
            {
              name: "Share",
              onClick: shareSemester
            }
          ]}/>
        </div>
        {semesterProps.semester.classes.map((c, i) => (
          <Typography key={i} variant="caption" component="p">{c.name}</Typography>
        ))}
        <Button className={classes.openSemesterButton} variant="contained" color="primary" onClick={() => openSemester(semesterProps.semester)} fullWidth>Open semester</Button>
        <ShareSemesterDialog
          semester={semesterProps.semester}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          onShare={onShare}/>
        <ShareUrlDialog
          url={shareUrl}
          onClose={() => setShareUrl(undefined)}/>
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