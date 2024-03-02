import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PopupDialog from '../PopupDialog';
import LogInDialog from './LogInDialog';
import AccountHelper from "helpers/accountHelper";
import Navigation from 'components/Navigation';
import CreateAccountDialog from './CreateAccountDialog';
import ForgotUsernameDialog from './ForgotUsernameDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import NavigationHelper from 'helpers/navigationHelper';

const useStyles = makeStyles(theme => ({
  mainContent: {
    backgroundColor: '#2D366F',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  centerContent: {
    paddingLeft: '12px',
    paddingRight: '12px'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'center'
  },
  loginButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3)
  },
  titleContainer: {
    display: 'inline-block',
    verticalAlign: 'top',
    position: 'static',
    textAlign: 'center'
  },
  createAccountButton: {
    marginLeft: theme.spacing(2)
  }
}));

// The {} represents the state
const Welcome = () => {

  const classes = useStyles();
  const history = NavigationHelper.history;

  let redirect:string|undefined;
  const qs = new URLSearchParams(NavigationHelper.history.location.search);
  if (qs.has("redirect")) {
    redirect = qs.get("redirect")!;
    if (redirect.startsWith('/')) {
      redirect = "https://powerplanner.net" + redirect;
    }
  } else if (qs.has("redirect_uri")) {
    redirect = qs.get("redirect_uri")!; // OpenAI uses redirect_uri
  }
  let state:string|undefined = qs.get("state") || undefined;

  const isImporting = redirect !== undefined && redirect.indexOf('/import') !== -1;

  const MainContent = () => {

    // We delete cookies when login is visited
    AccountHelper.deleteCookies();

    return (
      <div className={classes.mainContent}>
        <div className={classes.centerContent}>
  
          <div className={classes.headerContent}>
              <div className={classes.titleContainer}>
                <Typography variant="h2" noWrap={true} style={{color: "white"}}>
                  Power Planner
                </Typography>
                <Typography variant="body1" noWrap={false} style={{color: "white"}}>
                  {isImporting ? 'Create an account or log in to import the semester your classmate shared!' : 'The ultimate homework planner (beta)'}
                </Typography>
              </div>
          </div>
  
          <div className={classes.loginButtons}>
  
            <Button
              variant="contained"
              color="secondary"
              onClick={() => history.push("/login/login")}>
              LOG IN
            </Button>
            
            <Button
              className={classes.createAccountButton}
              variant="contained"
              color="secondary"
              onClick={() => history.push("/login/create-account")}>
              CREATE ACCOUNT
            </Button>
              
          </div>
  
        </div>
    </div>
    );
  }

  const navStructure:any = {
    "/login": {
      "": () => <MainContent/>,
      popups: {
        "/login": {
          "": () => <LogInDialog open onClose={() => history.goBack()} redirect={redirect} state={state}/>,
          "/forgot-username": () => <ForgotUsernameDialog open/>,
          "/forgot-password": () => <ForgotPasswordDialog open/>
        },
        "/create-account": () => <CreateAccountDialog open onClose={() => history.goBack()} redirect={redirect}/>
      }
    }
  }

  return <Navigation structure={navStructure}/>
}
  
export default Welcome;