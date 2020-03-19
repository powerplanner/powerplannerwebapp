import * as React from "react";
import { makeStyles, CircularProgress, Typography, Fab } from "@material-ui/core";
import { ViewItemClass } from "models/viewItems";
import EditIcon from '@material-ui/icons/Edit';
import { observer } from "mobx-react";

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  content: {
    height: '100%',
    padding: theme.spacing(2),
    overflowY: 'auto',
    boxSizing: 'border-box'
  }
}));

const ViewDetails = observer((props:{
  class: ViewItemClass
}) => {

  const classes = useStyles();
  const c = props.class;

  const openEdit = () => {
    alert("To edit the class details, use the iOS, Windows, or Android app.");
  }

  const details = "Hello\nworld";

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {c.isLoading ? (
          <CircularProgress size={24}/>
        ) : (
          c.failedLoadingFullError ? (
            <Typography>{c.failedLoadingFullError}</Typography>
          ) : (
            <Typography style={{whiteSpace: "pre-wrap"}}>{c.details}</Typography>
          )
        )}
      </div>
      <Fab color="primary" aria-label="edit" size="medium" className={classes.fab} onClick={openEdit} disabled={c.isLoading || c.failedLoadingFullError !== undefined}>
        <EditIcon/>
      </Fab>
    </div>
  );
});

export default ViewDetails;