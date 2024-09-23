import { IdeviceInfo } from './deviceinfo';
import { IimageCheckinStart } from './imagecheckinstart';

export interface ICheckinStart {
  timestamp: string;
  userID: number;
  clientID: number;
  imageCheckin: IimageCheckinStart;
  initialCheckin: boolean;
  deviceInfo: IdeviceInfo;
}
