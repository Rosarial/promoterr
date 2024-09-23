import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  /**
   * Generates a random UUID (Universally Unique Identifier) string.
   *
   * @return {string} The generated UUID string.
   */
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  public getCurrentDateUTC(): string {
    return moment().utc().format('YYYY-MM-DD');
  }
}
