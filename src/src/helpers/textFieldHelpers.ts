export default class TextFieldHelpers {
  static onEnter(action: () => any, event:any) {
    if (event.key === "Enter") {
      event.preventDefault();
      action();
    }
  }
}