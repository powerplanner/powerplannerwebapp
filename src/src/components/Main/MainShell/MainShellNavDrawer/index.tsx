import * as React from 'react';
//import * as logo from '../../assets/logo.png';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles, createMuiTheme, Theme, WithStyles, createStyles, MuiThemeProvider } from '@material-ui/core/styles';
import NavDrawerStatics from 'components/navDrawerStatics'
import { ViewItemClass } from 'models/viewItems';
import Collapse from '@material-ui/core/Collapse';
import { BrowserRouter as Router, Link } from "react-router-dom";
import LinkListItem from "components/LinkListItem";
import { IconButton } from '@material-ui/core';

const drawerWidth = NavDrawerStatics.drawerWidth;

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const styles = (theme: Theme) => createStyles({
  root: {
    overflowY: "auto",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerLogo: {
    height: '85px',
    display: "block",
    marginTop: "48px",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "24px"
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
  classColorListItemIcon: {
    marginRight: 0
  },
  classColorSquare: {
    border: "1px solid #2D366F",
    width: 14,
    height: 14
  },
  selectedListItem: {
    backgroundColor: theme.palette.secondary.main + " !important"
  },
  classesContainer: {
    backgroundColor: theme.palette.secondary.main
  }
});

export enum MainShellNavDrawerItem {
  Calendar,
  Day,
  Agenda,
  Schedule,
  Classes,
  Years,
  Settings
}

export interface MainShellNavDrawerProps extends WithStyles<typeof styles> {
  theme: Theme,
  selectedItem: MainShellNavDrawerItem,
  selectedClass?: ViewItemClass,
  hasSemester?: boolean,
  semesterClasses?: ViewItemClass[],
  onCalendarSelected?: Function,
  onDaySelected?: Function,
  onAgendaSelected?: Function,
  onScheduleSelected?: Function,
  onClassesSelected?: Function,
  onYearsSelected?: Function,
  onSettingsSelected?: Function,
  onItemClick?(item: MainShellNavDrawerItem): void
}

interface MainListItemProps {
  text: string,
  item: MainShellNavDrawerItem,
  link: string,
  additionalButton?: any
}

interface ClassListItemProps {
  c: ViewItemClass
}

class MainShellNavDrawer extends React.Component<MainShellNavDrawerProps, {}> {
  state = {
    semesterClassesOpen: false
  };

  handleClassesClick = () => {
    if (!this.state.semesterClassesOpen) {
      this.setState({ semesterClassesOpen: true });
    }
  }

  handleItemClick = (item: MainShellNavDrawerItem) => {
    if (this.props.onItemClick) {
      this.props.onItemClick(item);
    }
  }

  MainListItem = (item: MainListItemProps) => {
    const selected = this.props.selectedItem == item.item;
    return (
      <LinkListItem button to={item.link} replace selected={selected} classes={{
        selected: this.props.classes.selectedListItem
      }}>
        <ListItemText primary={item.text} primaryTypographyProps={{
          noWrap: true
        }}/>
        {selected && item.additionalButton}
      </LinkListItem>
    );
  }

  ClassListItem = (item: ClassListItemProps) => {
    const { classes } = this.props;
    const { c } = item;
    const selected = this.props.selectedClass === c;
    return (
      <LinkListItem button className={classes.nested} selected={selected} to={`/classes/${c.identifier}`} replace>
        <ListItemIcon classes={{
          root: classes.classColorListItemIcon
        }}>
          <div className={classes.classColorSquare} style={{
            backgroundColor: c.color
          }}/>
        </ListItemIcon>
        <ListItemText primary={c.name} primaryTypographyProps={{
          variant: "body1",
          noWrap: true
        }}  />
      </LinkListItem>
    );
  }

  render() {
    const { classes, theme, selectedItem } = this.props;

    const listItemClasses = {
      selected: classes.selectedListItem
    };

    const addClassButton = (
      <IconButton component={Link} to="/classes/add-class">
        <AddIcon/>
      </IconButton>
    );

    return (
      <MuiThemeProvider theme={darkTheme}>
        <div className={classes.root}>
          <img src="/assets/logo.png" className={classes.drawerLogo} alt="Power Planner logo"/>
          <List>
            {this.props.hasSemester &&
              <>
                {this.props.semesterClasses && this.props.semesterClasses.length > 0 &&
                <>
                  <this.MainListItem item={MainShellNavDrawerItem.Calendar} key="calendar" text="Calendar" link="/calendar"/>
                  <this.MainListItem item={MainShellNavDrawerItem.Day} key="day" text="Day" link="/day"/>
                  <this.MainListItem item={MainShellNavDrawerItem.Agenda} key="agenda" text="Agenda" link="/agenda"/>
                  <this.MainListItem item={MainShellNavDrawerItem.Schedule} key="schedule" text="Schedule" link="/schedule"/>
                </>
                }
                <this.MainListItem item={MainShellNavDrawerItem.Classes} key="classes" text="Classes" link="/classes" additionalButton={addClassButton}/>
                {this.props.semesterClasses && this.props.semesterClasses.length > 0 &&
                  <Collapse in={selectedItem == MainShellNavDrawerItem.Classes} timeout="auto" unmountOnExit>
                    <div className={classes.classesContainer}>
                      <List disablePadding>
                        {this.props.semesterClasses!.map((c, index) => (
                        <this.ClassListItem c={c} key={"class:" + index}/>
                        ))}
                      </List>
                    </div>
                  </Collapse>
                }
              </>
            }
            
            <this.MainListItem item={MainShellNavDrawerItem.Years} key="years" text="Years" link="/years"/>
            <this.MainListItem item={MainShellNavDrawerItem.Settings} key="settings" text="Settings" link="/settings"/>
          </List>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MainShellNavDrawer);