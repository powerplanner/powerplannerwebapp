import * as React from "react";
import { ViewItemClass } from "models/viewItems";
import ViewClassShell from "./ViewClassShell";
import { useHistory, useLocation, Switch, Route, Redirect, useParams } from "react-router-dom";
import Api from "api";
import GlobalState from "models/globalState";

const ViewClass = (props:{
  class: ViewItemClass
}) => {
  const history = useHistory();
  const location = useLocation();

  props.class.loadFullIfNeeded();

  const handlePageChange = (newPage:string) => {
    history.replace(`/classes/${props.class.identifier}/${newPage}`);
  }

  const handleDeleteClass = async () => {
    var resp = await Api.modifyAsync({
      deletes: [props.class.identifier]
    });
    if (resp.Error) {
      alert(resp.Error);
      return false;
    } else {
      GlobalState.currSemesterState?.removeClass(props.class);
      return true;
    }
  }

  const RenderViewClass = (innerProps:{page:"details" | "times" | "tasks" | "events"}) => {
    return <ViewClassShell class={props.class} selectedPage={innerProps.page} onChange={handlePageChange} onDeleteClass={handleDeleteClass}/>;
  }

  return (
    <Switch>
      <Route path="/classes/:id/details">
        <RenderViewClass page="details"/>
      </Route>
      <Route path="/classes/:id/times">
        <RenderViewClass page="times"/>
      </Route>
      <Route path="/classes/:id/tasks">
        <RenderViewClass page="tasks"/>
      </Route>
      <Route path="/classes/:id/events">
        <RenderViewClass page="events"/>
      </Route>
      <Route>
        <Redirect to={`/classes/${props.class.identifier}/details`}/>
      </Route>
    </Switch>
  );
}

export default ViewClass;