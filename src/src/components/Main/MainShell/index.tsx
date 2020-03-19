import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { CssBaseline } from '@material-ui/core';
import NavDrawerStatics from 'components/navDrawerStatics';
import MainShellNavDrawer, { MainShellNavDrawerItem, MainShellNavDrawerProps } from './MainShellNavDrawer';
import { ViewItemClass } from 'models/viewItems';
// import Router from "./Router";

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute"
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: NavDrawerStatics.drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: NavDrawerStatics.drawerWidth,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
      /*width: `calc(100% - ${NavDrawer.drawerWidth}px)`,*/
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: NavDrawerStatics.drawerWidth,
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3,
    display: "flex",
    flexDirection: "column"
  },
  actualContent: {
    flexGrow: 1,
    position: "relative"
  }
});

export interface MainShellProps extends WithStyles<typeof styles> {
  theme: Theme,
  loading: boolean,
  selectedNavItem: MainShellNavDrawerItem,
  selectedClass?: ViewItemClass,
  hasSemester?: boolean,
  loadingErrorMessage?: string,
  semesterClasses?: ViewItemClass[],
}

interface MainShellState {
  mobileOpen: boolean
}

// The {} represents the state
class MainShell extends React.Component<MainShellProps, MainShellState> {

  state = {
    mobileOpen: false
  };

  constructor(props: Readonly<MainShellProps>) {
    super(props);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen});
  };

  render() {
    const { classes, theme } = this.props;



    const drawer = <MainShellNavDrawer
      selectedItem={this.props.selectedNavItem}
      selectedClass={this.props.selectedClass}
      hasSemester={this.props.hasSemester}
      semesterClasses={this.props.semesterClasses}/>;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Power Planner
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              // container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.actualContent}>
              {this.props.children}
          </div>
        </main>
      </div>
    );
  }
}
  
export default withStyles(styles, { withTheme: true })(MainShell);