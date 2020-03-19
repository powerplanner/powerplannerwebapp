import * as React from "react";
import { Switch, Route, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import RegexHelpers from "helpers/regexHelpers";
import { Guid } from "guid-typescript";
import NavigationHelper from "helpers/navigationHelper";

const useStyles = makeStyles(theme => ({
  container: {
    position: "relative"
  },
  innerNavigation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}));

const isFunction = (functionToCheck:any) => {
  return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
}

const sorter = (a:any, b:any) => {
  if (a.path.length < b.path.length) {
    return 1;
  } else if (a.path.length > b.path.length) {
    return -1;
  } else {
    return 0;
  }
}

const sanatizePath = (path:string) => {
  return path.replace(/\(Guid\)/g, `(${RegexHelpers.guid})`);
}

const InnerNavigation = (props:{
  structure:NavStructure,
  routeProps:NavigationRouteProps,
  popup?: boolean
}) => {
  const classes = useStyles();

  const RenderRoute = (renderRouteProps:{
    render: (props:NavigationRouteProps) => any,
    fullPath: string,
    popup?: boolean
  }) => {
    const params:any = useParams();
    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        if (Guid.isGuid(params[p])) {
          params[p] = Guid.parse(params[p]);
        }
      }
    }

    // TODO: Handle params

    const content = renderRouteProps.render({params: params});

    if (props.popup) {
      return (
        <div className={classes.innerNavigation}>
          {content}
        </div>
      )
    }

    return content;
  }

  let content:any;

  // If there's no other pages
  if (props.structure.pages.length === 0) {
    if (props.structure.root === null || props.structure.root === undefined) {
      content = null;
    } else {
      content = props.structure.root!(props.routeProps);
    }
  } else {
    content = (
      <Switch>
        {props.structure.pages.map(p => (
          <Route key={p.fullPath} path={sanatizePath(p.fullPath)}>
            <RenderRoute fullPath={p.fullPath} render={(params) => <InnerNavigation structure={p} routeProps={params}/>}/>
          </Route>
        ))}
        {props.structure.root !== null && (
          <Route path={sanatizePath(props.structure.fullPath)}>
            <RenderRoute fullPath={props.structure.fullPath} render={(params) => props.structure.root!(params)}/>
          </Route>
        )}
      </Switch>
    )
  }

  if (props.structure.popups.length === 0) {
    return content;
  }

  return (
    <div>
      {content}
      <div>
      <Switch>
        {props.structure.getFinalPopups().map(p => (
          <Route key={p.fullPath} path={sanatizePath(p.fullPath)} exact>
            <RenderRoute fullPath={p.fullPath} render={(params) => <InnerNavigation structure={p} routeProps={params}/>} popup/>
          </Route>
        ))}
      </Switch>
      </div>
    </div>
  );
}

const flattenAllPopups = (structure:any) => {
  const popups = [];
  for (var p in structure) {
    if (p === "popups") {
      for (var pPath in structure.popups) {
        if (structure.popups.hasOwnProperty(pPath)) {
          popups.push({
            path: pPath,
            content: structure.popups[pPath]
          });
        }
      }
    } else if (structure.hasOwnProperty(p) && !isFunction(structure[p])) {
      flattenAllPopups(structure[p]).forEach(popup => popups.push({
        path: p + popup.path,
        content: popup.content
      }));
    }
  }
  return popups;
}

export interface NavigationRouteProps {
  params: any
}

class NavStructure {
  fullPath: string;
  root: null | ((props:NavigationRouteProps) => any) = null;
  pages: NavStructure[] = [];
  popups: NavStructure[] = [];
  isPopup: boolean;
  parent: NavStructure | null;

  constructor(structure:any, fullPathToStructure:string, parent:NavStructure|null, isPopup: boolean) {

    this.parent = parent;
    this.fullPath = fullPathToStructure;
    this.isPopup = isPopup;

    if (structure === null || isFunction(structure)) {
      this.root = structure;
      return;
    }

    if (structure[""]) {
      this.root = structure[""];
    }

    for (var p in structure) {
      if (p !== "" && p !== "popups" && structure.hasOwnProperty(p)) {
        const page = new NavStructure(structure[p], this.fullPath + p, this, this.isPopup);
        this.pages.push(page);
      }
    }

    if (structure.popups) {
      for (var p in structure.popups) {
        if (structure.popups.hasOwnProperty(p)) {
          const popup = new NavStructure(structure.popups[p], this.fullPath + p, this, true);
          this.popups.push(popup);
        }
      }
    }
  }

  getDescendantsAndSelf() {
    const answer:NavStructure[] = [];
    answer.push(this);
    this.pages.forEach(p => {
      p.getDescendantsAndSelf().forEach(flattened => answer.push(flattened));
    });
    this.popups.forEach(p => {
      p.getDescendantsAndSelf().forEach(flattened => answer.push(flattened));
    });
    return answer;
  }

  getDescendants() {
    const answer:NavStructure[] = [];
    this.pages.forEach(p => {
      p.getDescendantsAndSelf().forEach(flattened => answer.push(flattened));
    });
    this.popups.forEach(p => {
      p.getDescendantsAndSelf().forEach(flattened => answer.push(flattened));
    });
    return answer;
  }

  getFinalPopups() {
    const answer:NavStructure[] = [];
    this.popups.forEach(p => {
      if (p.root !== null) {
        answer.push(p);
      }
      p.getDescendants().forEach(flattened => answer.push(flattened));
    });
    return answer;
  }

  find(path:string) : NavStructure | undefined {
    const structure = this.getDescendantsAndSelf().find(i => {
      if (i.fullPath.length === 0) {
        return false;
      }
      let regexStr = "^" + i.fullPath.replace(/:\w+\(Guid\)/g, RegexHelpers.guid) + "$";
      regexStr = regexStr.replace(/\//g, '\\/');
      const regex = new RegExp(regexStr);
      return regex.test(path);
    });
    return structure;
  }

  getPathsToPopup(pathname:string) : string[] {
    const answer:string[] = [];
    answer.push(pathname);
    while (true) {
      const index = pathname.lastIndexOf('/');
      if (index === -1) {
        break;
      }
      pathname = pathname.substr(0, index);
      const found = this.find(pathname);
      if (found === undefined) {
        break;
      }
      answer.push(pathname);
      if (!found.isPopup) {
        break;
      }
    }
    answer.reverse();
    return answer;
  }
}

const Navigation = (props:{
  structure:any
}) => {
  const history = NavigationHelper.history;

  const navStructure = new NavStructure(props.structure, "", null, false);

  React.useEffect(() => {
    const pathname = history.location.pathname;
    let matching = navStructure.find(pathname);
    if (matching && matching.isPopup) {
      const paths = navStructure.getPathsToPopup(pathname);
      if (paths.length > 1) {
        // Preserve query string params in final path
        if (history.location.search.length > 0) {
          paths[paths.length - 1] = history.location.pathname + history.location.search;
        }

        history.replace(paths[0]);
        paths.splice(0, 1);
        paths.forEach(p => history.push(p));
      }
    }
  }, []);

  const content = <InnerNavigation structure={navStructure} routeProps={{params:{}}}/>;

  return content;
}

export default Navigation;