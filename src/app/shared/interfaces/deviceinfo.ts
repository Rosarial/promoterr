import { IinfoDevice } from './info';
import { IinfoBattery } from './infobattery';
import { IUuid } from './uuiddevice';

export interface IdeviceInfo {
  info: IinfoDevice;
  infoBattery: IinfoBattery;
  uuID: IUuid;
}
