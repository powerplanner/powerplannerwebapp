import * as React from 'react';
import './App.css';
import Router from "./Router";
import { ThemeProvider, createMuiTheme } from '@material-ui/core';



const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2E366D"
    },
    secondary: {
      main: "#546BC7"
    }
  },
});

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <Router/>
    </ThemeProvider>
  )
}

export default App;
