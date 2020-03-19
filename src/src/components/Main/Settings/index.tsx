import * as React from "react";
import { ListItem, ListItemText, List, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({

}));

const Settings = () => {
  const classes = useStyles();
  const history = useHistory();

  const SettingsListItem = (listItemProps:{
    title: string,
    subtitle: string,
    action: () => void
  }) => {
    return (
      <ListItem button onClick={listItemProps.action}>
        <ListItemText primary={listItemProps.title} secondary={listItemProps.subtitle}/>
      </ListItem>
    )
  }

  return (
    <List>
      <SettingsListItem
        title="My account"
        subtitle="Log out"
        action={() => history.push("/settings/account")}/>
      <SettingsListItem
        title="Google Calendar integration"
        subtitle="Tasks and classes in Google Calendar"
        action={() => window.location.href = "https://powerplanner.net/googlecalendar"}/>
    </List>
  )
}

export default Settings;