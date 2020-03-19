import { Moment } from "moment";
import * as moment from "moment";

export enum PowerItemType {
  Year = 0, Teacher = 1,

  Semester = 2,

  Class = 3, Task = 4,

  Homework = 5, Exam = 6, WeightCategory = 7, Schedule = 8,

  Grade = 9, TeacherUnderSchedule = 10,

  ClassAttribute = 11, ClassSubject = 12,
  ClassAttributeUnderClass = 13, ClassSubjectUnderClass = 14,

  MegaItem = 15
};

export enum DayOfWeek {
  //
  // Summary:
  //     Indicates Sunday.
  Sunday = 0,
  //
  // Summary:
  //     Indicates Monday.
  Monday = 1,
  //
  // Summary:
  //     Indicates Tuesday.
  Tuesday = 2,
  //
  // Summary:
  //     Indicates Wednesday.
  Wednesday = 3,
  //
  // Summary:
  //     Indicates Thursday.
  Thursday = 4,
  //
  // Summary:
  //     Indicates Friday.
  Friday = 5,
  //
  // Summary:
  //     Indicates Saturday.
  Saturday = 6
};

export class DayOfWeekHelper {
  static toString(dayOfWeek:DayOfWeek) {
    switch (dayOfWeek) {
      case DayOfWeek.Sunday:
        return "Sunday";
      case DayOfWeek.Monday:
        return "Monday";
      case DayOfWeek.Tuesday:
        return "Tuesday";
      case DayOfWeek.Wednesday:
        return "Wednesday";
      case DayOfWeek.Thursday:
        return "Thursday";
      case DayOfWeek.Friday:
        return "Friday";
      case DayOfWeek.Saturday:
        return "Saturday";
    }
  }
}

export enum PowerScheduleWeek {
  /// <summary>
  /// Schedule repeats on Week 1/Week A
  /// </summary>
  WeekOne = 1, // 01

  /// <summary>
  /// Schedule repeats on Week 2/Week B
  /// </summary>
  WeekTwo = 2, // 10

  /// <summary>
  /// Schedule repeats on both Week 1 and Week 2 (if the user has the same schedule every week, this option should be selected).
  /// </summary>
  BothWeeks = 3 //11
};

export enum MegaItemType {
  // Order matters, don't rearrange
  Homework,
  Exam,
  Holiday,
  Task,
  Event,
  ClassTime
}

export enum TimeOption {
  AllDay,
  BeforeClass,
  StartOfClass,
  DuringClass,
  EndOfClass,
  Custom
}

export class DateValues {
  static UNASSIGNED:Moment = moment("1970-1-1 00Z");
  static NO_DUE_DATE:Moment = moment("1999-12-31 00Z");
  static SQL_MIN_VALUE:Moment = moment("1753-1-1 00Z");
  static MINIMUM:Moment = moment("0001-01-01 00Z");

  static isUnassigned(date:Moment) {
    return date === this.UNASSIGNED || date === this.SQL_MIN_VALUE;
  }
}