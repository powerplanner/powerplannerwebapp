import * as React from 'react';
import Agenda from "./Agenda";
import { Guid } from 'guid-typescript';
import MainShell from "./MainShell";
import { MainShellNavDrawerItem } from './MainShell/MainShellNavDrawer';
import { Redirect } from "react-router-dom";
import { ViewItemClass, ViewItemYear } from 'models/viewItems';
import ViewTaskDialog from "components/Main/ViewTaskDialog";
import GlobalState from "models/globalState";
import { observer } from 'mobx-react';
import AddTaskDialog from './AddTaskDialog';
import AddClassDialog from './AddClassDialog';
import ViewClass from './ViewClass';
import Schedule from './Schedule';
import Day from './Day';
import Calendar from './Calendar';
import Navigation, { NavigationRouteProps } from 'components/Navigation';
import Years from './Years';
import { makeStyles } from '@material-ui/core';
import Settings from './Settings';
import MyAccount from './Settings/MyAccount';
import AddYearDialog from './AddYearDialog';
import AddSemesterDialog from './AddSemesterDialog';


const addTaskEvent = {
  "/add-task": () => <AddTaskDialog isTask={true}/>,
  "/add-event": () => <AddTaskDialog isTask={false}/>
}

const RouteViewTask = (props:NavigationRouteProps) => {
  var taskId: Guid = props.params.taskId;
  const task = GlobalState.currSemesterState?.getTaskOrEvent(taskId);
  if (task === undefined) {
    return (
      <Redirect to="/"/>
    );
  }
  return (
    <ViewTaskDialog task={task} open={true}/>
  );
}

const RouteEditTask = (props:NavigationRouteProps) => {
  var taskId: Guid = props.params.taskId;
  const task = GlobalState.currSemesterState?.getTaskOrEvent(taskId);
  if (task === undefined) {
    return (
      <Redirect to="/"/>
    );
  }
  task.loadFullIfNeeded();
  return (
    <AddTaskDialog taskToEdit={task}/>
  )
}

const viewTask = {
  "/:taskId(Guid)": {
    "": RouteViewTask,
    "/edit": RouteEditTask
  }
};

const useStyles = makeStyles(theme => ({
  loadingRoot: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  loadingPowerPlannerIcon: {
    width: "80px"
  }
}));


const Main = observer(() => {

  const classes = useStyles();

  const RenderPage = (menuItem:MainShellNavDrawerItem, content:() => any, selectedClass?: ViewItemClass) => {
    return (
      <MainShell
        loading={false}
        selectedNavItem={menuItem}
        hasSemester={GlobalState.currSemesterState !== undefined && GlobalState.currSemesterState !== null}
        semesterClasses={GlobalState.currSemesterState?.classes}
        selectedClass={selectedClass}>
        {content()}
      </MainShell>
    );
  }

  const RenderClassContent = (props:NavigationRouteProps, render: (c:ViewItemClass) => any) => {
    var id: Guid = props.params.classId;
    const c = GlobalState.currSemesterState?.classes.find(i => i.identifier.equals(id));
    if (c === undefined) {
      return null;
    }
    return render(c);
  }

  const RouteEditClassDialog = (props:NavigationRouteProps) => {
    var id: Guid = props.params.classId;
    const c = GlobalState.currSemesterState?.classes.find(i => i.identifier.equals(id));
    if (c === undefined) {
      return null;
    }
    return (
      <AddClassDialog classToEdit={c}/>
    );
  }

  if (GlobalState.mainState!.loadingSemester) {
    return (
      <div className={classes.loadingRoot}>
        <img className={classes.loadingPowerPlannerIcon} src="/assets/logo.png" alt="Power Planner logo"/>
      </div>
    );
  }

  const RouteEditSemesterDialog = (props:NavigationRouteProps) => {
    return RouteYearDialog(props, y => {
      var id: Guid = props.params.semesterId;
      const s = y.semesters.find(i => i.identifier.equals(id));
      if (s === undefined) {
        return <Redirect to="/years"/>
      }
      return <AddSemesterDialog semesterToEdit={s} year={y}/>
    });
  }

  const RouteYearDialog = (props:NavigationRouteProps, render:(y:ViewItemYear) => any) => {
    var id: Guid = props.params.yearId;
    const y = GlobalState.mainState?.yearsState.years?.find(i => i.identifier.equals(id));
    if (y === undefined) {
      return <Redirect to="/years"/>;
    }
    return render(y);
  }

  let navStructure:any = {
    "": () => {
      if (navStructure["/calendar"]) {
        return <Redirect to="/calendar"/>
      } else if (navStructure["/classes"]) {
        return <Redirect to="/classes"/>
      } else {
        return <Redirect to="/years"/>
      }
    },
    "/years": {
      "": () => RenderPage(MainShellNavDrawerItem.Years, () => <Years/>),
      popups: {
        "/add-year": () => <AddYearDialog/>,
        "/:yearId(Guid)/add-semester": (props:NavigationRouteProps) => RouteYearDialog(props, y => <AddSemesterDialog year={y}/>),
        "/:yearId(Guid)/edit": (props:NavigationRouteProps) => RouteYearDialog(props, y => <AddYearDialog yearToEdit={y}/>),
        "/:yearId(Guid)/:semesterId(Guid)/edit": RouteEditSemesterDialog
      }
    },
    "/settings": {
      "": () => RenderPage(MainShellNavDrawerItem.Settings, () => <Settings/>),
      popups: {
        "/account": () => <MyAccount open={true}/>
      }
    }
  };

  if (GlobalState.currSemesterState) {
    navStructure = {
      ...navStructure,
      "/classes": {
        "": () => RenderPage(MainShellNavDrawerItem.Classes, () => null),
        "/:classId(Guid)": {
          "": (props:NavigationRouteProps) => RenderClassContent(props, c => RenderPage(MainShellNavDrawerItem.Classes, () => <ViewClass class={c}/>, c)),
          popups: {
            "/tasks": {
              "/add-task": (props:NavigationRouteProps) => {console.log("Add task"); return RenderClassContent(props, () => <AddTaskDialog isTask/>)}, // TODO: Select class and hide class picker
              ...viewTask,
              "/edit-class": RouteEditClassDialog
            },
            "/events": {
              "/add-event": (props:NavigationRouteProps) => RenderClassContent(props, () => <AddTaskDialog/>),
              ...viewTask,
              "/edit-class": RouteEditClassDialog
            },
            "/details": {
              "/edit-class": RouteEditClassDialog
            },
            "/times": {
              "/edit-class": RouteEditClassDialog
            }
          }
        },
        popups: {
          "/add-class": () => <AddClassDialog/>
        },
      }
    }

    if (GlobalState.currSemesterState.classes.length > 0) {
      navStructure = {
        ...navStructure,
        "/calendar": {
          "": () => RenderPage(MainShellNavDrawerItem.Calendar, Calendar),
          popups: {
            ...addTaskEvent,
            ...viewTask
          }
        },
        "/day": {
          "": () => RenderPage(MainShellNavDrawerItem.Day, Day),
          popups: {
            ...addTaskEvent,
            ...viewTask
          }
        },
        "/agenda": {
          "": () => RenderPage(MainShellNavDrawerItem.Agenda, () => <Agenda/>),
          popups: {
            ...addTaskEvent,
            ...viewTask
          }
        },
        "/schedule": () => RenderPage(MainShellNavDrawerItem.Schedule, () => <Schedule/>)
      }
    }
  }
  
  return (
    <Navigation structure={navStructure}/>
  )
  
});

export default Main;