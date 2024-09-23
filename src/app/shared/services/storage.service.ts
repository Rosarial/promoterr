import { Injectable } from '@angular/core';
import { GetOptions, Preferences, SetOptions } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private prefix = environment.appInfo.buildVersion;
  constructor() {}

  /**
   * Stores the provided value in the storage under the specified key.
   *
   * @param {string} key - The key under which the value will be stored.
   * @param {T} value - The value to be stored.
   * @return {Promise<void>} A promise that resolves when the value has been stored.
   */
  async setData<T>(key: string, value: T): Promise<void> {
    const stringify = JSON.stringify(value);
    /**
     * Retrieves data from the storage based on the specified key.
     *
     * @param {string} key - The key used to retrieve the data.
     * @return {Promise<T | null>} A promise that resolves to the retrieved data if found, or null if not found.
     */
    const data: SetOptions = {
      key: `${this.prefix}-${key}`,
      value: stringify
    };
    await Preferences.set(data);
  }

  async getData<T>(key: string): Promise<T | null> {
    const data: GetOptions = {
      /**
       * Retrieves data from the storage based on the specified key.
       *
       * @param {string} key - The key used to retrieve the data.
       * @return {Promise<T | null>} A promise that resolves to the retrieved data if found, or null if not found.
       */
      key: `${this.prefix}-${key}`
    };
    const { value } = await Preferences.get(data);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  }

  /**
   * Clears all stored data from the storage.
   *
   * @return {Promise<void>} A promise that resolves when all data has been cleared.
   */
  clear(): Promise<void> {
    return Preferences.clear();
  }

  /**
   * Removes data from the storage based on the specified key.
   *
   * @param {string} key - The key of the data to be removed.
   * @return {Promise<void>} A promise that resolves when the data has been removed.
   */
  removeData(key: string): Promise<void> {
    return Preferences.remove({ key: `${this.prefix}-${key}` });
  }
}
