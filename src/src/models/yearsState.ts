import { observable } from "mobx";
import { ViewItemYear, ViewItemSemester, ViewItemClass } from "./viewItems";
import Api from "api";
import { IGuid } from "api/items";
import { Guid } from "guid-typescript";

export default class YearsState {

  @observable error?: string;
  @observable years?: ViewItemYear[];

  constructor() {
    this.initialize();
  }

  removeYear(y:ViewItemYear) {
    const index = this.years!.indexOf(y);
    if (index !== -1) {
      this.years!.splice(index, 1);
    }
  }

  private async initialize() {
    try {
      var resp = await Api.getYearsAndSemestersAsync();
      if (resp.Error) {
        this.error = resp.Error;
      } else {
        const years:ViewItemYear[] = [];
        resp.Years.forEach(y => {
          const year = new ViewItemYear({
            name: y.Name,
            identifier: IGuid.toGuid(y.Identifier)
          });
          years.push(year);
          y.Semesters.forEach(s => {
            const semester = new ViewItemSemester({
              name: s.Name,
              identifier: IGuid.toGuid(s.Identifier)
            });
            year.semesters.push(semester);
            s.Classes.forEach(c => {
              semester.classes.push(new ViewItemClass({
                name: c.Name,
                identifier: Guid.createEmpty(),
                semesterId: semester.identifier,
                color: ""
              }));
            });
          });
        });
        this.years = years;
      }
    } catch {
      this.error = "Unknown error";
    }
  }
}