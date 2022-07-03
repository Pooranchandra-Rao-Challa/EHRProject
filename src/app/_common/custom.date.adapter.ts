import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { Inject, Injectable, Optional } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";


@Pipe({
  name: 'userDateFormat'
})
export class UserDateFormatPipe implements PipeTransform {

  transform(date: string | Date, timeFormat: string = ''): string {
    const defaultValues = { dateFormat: 'MM-dd-yyyy', language: 'en-US', timeZone: 'Eastern', canonicalName: 'America/New_York' };
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences')) || defaultValues;
    const timeZoneOffset = _moment(new Date(date)).tz(defaultValues.canonicalName).format('Z');
    const datePipe = new DatePipe(userPrefs.language);
    const dateFormat = timeFormat ? `${userPrefs.dateFormat}  ${timeFormat}` : userPrefs.dateFormat;
    return datePipe.transform(date, dateFormat, timeZoneOffset, userPrefs.language);
  }
}



@Injectable()
export class CustomMomentDateAdapter extends MomentDateAdapter {
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }

  static TIMEZONE = "Asia/Sakhalin";

  createDate(year: number, month: number, date: number): _moment.Moment {
    // Moment.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`
      );
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const monthString = ("0" + (month + 1)).slice(-2);
    const yearSting = ("0" + date).slice(-2);
    const dateString = `${year}-${monthString}-${yearSting} 00:00`;
    const result = _moment.tz(dateString, CustomMomentDateAdapter.TIMEZONE);

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  /**
   * Returns the given value if given a valid Moment or null. Deserializes valid ISO 8601 strings
   * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Moments and empty
   * string into null. Returns an invalid date for all other values.
   */
  deserialize(value: any): _moment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = this._createMoment2(value).locale(this.locale);
    } else if (this.isDateInstance(value)) {
      // Note: assumes that cloning also sets the correct locale.
      return this.clone(value);
    }
    if (typeof value === "string") {
      if (!value) {
        return null;
      }
      date = this._createMoment2(value, _moment.ISO_8601).locale(this.locale);
    }
    if (date && this.isValid(date)) {
      return this._createMoment2(date).locale(this.locale);
    }
    return super.deserialize(value);
  }

  parse(value: any, parseFormat: string | string[]): _moment.Moment | null {
    if (value && typeof value === "string") {
      return this._createMoment2(value, parseFormat, this.locale);
    }
    return value ? this._createMoment2(value).locale(this.locale) : null;
  }

  today(): _moment.Moment {
    return _moment()
      .utc()
      .tz(CustomMomentDateAdapter.TIMEZONE)
      .local(this.locale);
  }

  /** Creates a Moment instance while respecting the current UTC settings. */
  private _createMoment2(
    date: _moment.MomentInput,
    format?: _moment.MomentFormatSpecification,
    locale?: string
  ): _moment.Moment {
    const date2 = _moment(date, format, locale).format("YYYY-MM-DD");
    return _moment.tz(date2, CustomMomentDateAdapter.TIMEZONE);
  }
}
