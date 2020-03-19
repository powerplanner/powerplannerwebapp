import { Fab } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Moment } from "moment";
import GlobalState from "models/globalState";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  overlayBackground: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.8)",
    width: "100%",
    height: "100%",
  },
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  openGrid: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gridRowGap: theme.spacing(2),
    gridColumnGap: theme.spacing(2),
  },
  openFab: {
    margin: "auto",
  },
  openText: {
    marginTop: "auto",
    marginBottom: "auto",
    textAlign: "right"
  },
}));

const FloatingAddButton = (props:{
  date?: Moment,
  type?: "task" | "event"
}) => {

  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const location = useLocation();

  const classes = useStyles();

  const openAdd = (type:string) => {
    if (props.date) {
      GlobalState.setNewTaskDate(props.date);
    }
    history.push(location.pathname + "/add-" + type);
    setOpen(false);
  }

  const onClick = () => {
    if (props.type) {
      openAdd(props.type);
    } else {
      setOpen(true);
    }
  }

  if (!open) {
    return (
      <div className={classes.fabContainer}>
        <Fab color="primary" aria-label="add" onClick={onClick}>
          <AddIcon/>
        </Fab>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.overlayBackground} onClick={() => setOpen(false)}/>
      <div className={classes.fabContainer}>
        <div className={classes.openGrid}>
          <span className={classes.openText}>Add event</span>
          <Fab color="primary" aria-label="add" size="medium" className={classes.openFab} onClick={() => openAdd("event")}>
            <AddIcon/>
          </Fab>
          <span className={classes.openText}>Add task</span>
          <Fab color="primary" aria-label="add" className={classes.openFab} onClick={() => openAdd("task")}>
            <AddIcon/>
          </Fab>
        </div>
      </div>
    </div>
  );
}

export default FloatingAddButton;