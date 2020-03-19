import * as React from "react";
import { makeStyles, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { ViewItemMegaItem } from "models/viewItems";
import { Moment } from "moment";
import { observer } from "mobx-react";
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from "react-router-dom";
import GlobalState from "models/globalState";
import CompactCalendar from "./CompactCalendar";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
}));

const CalendarShell = observer((props:{
  month: Moment,
  onMonthChanged: (newMonth:Moment) => void,
  allItems: ViewItemMegaItem[]
}) => {


  const classes = useStyles();
  const history = useHistory();

  const topRightItems = () => {
    
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = (type:string) => {
    history.push("/calendar/add-" + type);
    setAnchorEl(null);
  }

    return (
      <>
        <IconButton onClick={handleClick}>
          <AddIcon/>
        </IconButton>
        <Menu
          id="addMenu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          <MenuItem onClick={() => handleAdd('task')}>Add task</MenuItem>
          <MenuItem onClick={() => handleAdd('event')}>Add event</MenuItem>
        </Menu>
      </>
    )
  }

  return (
    <div className={classes.root}>
      <CompactCalendar
        month={props.month}
        onMonthChanged={props.onMonthChanged}
        dayState={GlobalState.currSemesterState!.dayState}
        topRightItems={topRightItems}/>
    </div>
  );
});

export default CalendarShell;