import { createBrowserHistory } from 'history';
import { string } from 'prop-types';

const history = createBrowserHistory();

export default class NavigationHelper {
  static get history() {
    return history;
  }
  
  static goToMain() {
    history.replace("/");
  }

  static goBack() {
    history.goBack();
  }
}