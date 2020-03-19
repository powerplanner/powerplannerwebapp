import * as React from "react";
import { ViewItemClass } from "models/viewItems";
import { makeStyles, AppBar, Tabs, Tab, Typography, IconButton, Toolbar, Dialog, DialogContent, DialogActions, DialogContentText, Button, DialogTitle } from "@material-ui/core";
import { observer } from "mobx-react";
import ViewTimes from "./ViewTimes";
import ViewTasksOrEvents from "./ViewTasksOrEvents";
import CircularProgress from '@material-ui/core/CircularProgress';
import ViewDetails from "./ViewDetails";
import MoreIcon from '@material-ui/icons/MoreVert';
import MoreButton from "components/MoreButton";
import { useHistory } from "react-router-dom";
import DeleteItemDialog from "../DeleteItemDialog";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column"
  },
  appBar: {

  },
  content: {
    flexGrow: 1,
    position: 'relative'
  },
  generalContent: {
    padding: theme.spacing(2),
    overflowY: "auto",
  },
  toolbar: {
    alignItems: 'flex-start',
  },
  tabs: {
    flexGrow: 1,
    alignSelf: 'flex-end',
  },
}));

const TabPanel = (props:{
  children: any,
  value: number,
  index: number
}) => {
  if (props.value === props.index) {
    return props.children;
  } else {
    return null;
  }
}

const ViewClassShell = observer((props:{
  class: ViewItemClass,
  selectedPage: "details" | "times" | "tasks" | "events",
  onChange?: (page:string) => void,
  onDeleteClass?: () => Promise<boolean>
}) => {

  const classes = useStyles();
  const history = useHistory();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  const GeneralContent = (props:{
    children: any
  }) => {
    return (
      <div className={classes.generalContent}>
        {props.children}
      </div>
    );
  }

  const c = props.class;

  let page = 0;
  switch (props.selectedPage) {
    case "times":
      page = 1;
      break;
    case "tasks":
      page = 2;
      break;
    case "events":
      page = 3;
      break;
  }

  const handleChange = (event:any, newValue:number) => {
    if (props.onChange) {
      let stringValue = "details";
      switch (newValue) {
        case 1:
          stringValue = "times";
          break;
        case 2:
          stringValue = "tasks";
          break;
        case 3:
          stringValue = "events";
          break;
      }
      props.onChange(stringValue);
    }
  }

  const handleDeleteClass = async () => {
    if (props.onDeleteClass) {
      return await props.onDeleteClass();
    }
    
    return false;
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolbar} variant="dense">
          <Tabs className={classes.tabs} value={page} onChange={handleChange} indicatorColor="primary">
            <Tab label="Details"/>
            <Tab label="Times"/>
            <Tab label="Tasks"/>
            <Tab label="Events"/>
          </Tabs>
          <MoreButton menuItems={[
            {
              name: "Edit class",
              onClick: () => history.push(`${props.selectedPage}/edit-class`)
            },
            {
              name: "Delete class",
              onClick: () => setConfirmDeleteOpen(true)
            }
          ]}/>
          {/* <IconButton aria-label="display more actions" edge="end" color="inherit">
            <MoreIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <TabPanel value={page} index={0}>
          <ViewDetails class={c}/>
        </TabPanel>
        <TabPanel value={page} index={1}>
          <GeneralContent>
            <ViewTimes schedules={c.schedules}/>
          </GeneralContent>
        </TabPanel>
        <TabPanel value={page} index={2}>
          <ViewTasksOrEvents tasks={c.megaItems.filter(i => i.isTask).sort((a, b) => a.compareTo(b))} type="task"/>
        </TabPanel>
        <TabPanel value={page} index={3}>
          <ViewTasksOrEvents tasks={c.megaItems.filter(i => !i.isTask).sort((a, b) => a.compareTo(b))} type="event"/>
        </TabPanel>
      </div>

      <DeleteItemDialog
        title="Delete class?"
        body="Are you sure you want to delete this class and all of its tasks, events, and grades?"
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onDelete={handleDeleteClass}/>
    </div>
  );
});

export default ViewClassShell;