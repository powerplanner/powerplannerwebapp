import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { IDate } from "api/items";

// https://stackoverflow.com/questions/16816414/extending-instance-static-functions-on-existing-prototypes-with-typescript/28020863#28020863
declare global {
  interface DateConstructor {
    fromIDate: (str: IDate) => Date
  }
}

// Unfortunately this doesn't work on the Guid class

Date.fromIDate = function (str: IDate) {
  return new Date(str as string);
}



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
