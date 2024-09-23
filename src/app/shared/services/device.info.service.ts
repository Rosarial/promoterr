import { Injectable } from '@angular/core';
import { Device, DeviceInfo } from '@capacitor/device';
@Injectable({ providedIn: 'root' })
export class DeviceInfoService {
  constructor() { }

  getInfo(): Promise<DeviceInfo> {
    return this.deviceInfo()
  }

  getInfoBaterry() {
    return this.baterryDeviceInfo()
  }

  getUUID() {
    return this.uniqueIdDevice()
  }
  async infoFullDevice() {
    const info = await this.getInfo();
    const infoBattery = await this.getInfoBaterry()
    const uuID = await this.getUUID()
    return {
      info,
      infoBattery,
      uuID
    }

  }
  private async deviceInfo() {
    return await Device.getInfo()
  }

  private async baterryDeviceInfo() {
    return await Device.getBatteryInfo()
  }

  private uniqueIdDevice() {
    return Device.getId()
  }
}
