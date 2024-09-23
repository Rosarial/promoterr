import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KEY_VALUE } from '@shared/enums/storage.key.enum';
import { ICheckinStart } from '@shared/interfaces/checkinstart';
import { getDistance, isPointInPolygon } from 'geolib';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  constructor(private storageService: StorageService, private http: HttpClient) {}
  private apiUrl = `${environment.baseUrl}${environment.apis}`;

  isPointInPolygon(
    point: { latitude: number; longitude: number },
    polygon: { latitude: number; longitude: number }[]
  ): boolean {
    return isPointInPolygon(point, polygon);
  }

  calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ) {
    const distanceInMeters = getDistance(point1, point2);
    if (distanceInMeters >= 1000) {
      const distanceInKilometers = distanceInMeters / 1000;
      return {
        distanceInKilometers: `${distanceInKilometers.toFixed(2)} km`,
        distance: distanceInMeters
      };
    }
    return {
      distanceInKilometers: `${distanceInMeters} m`,
      distance: distanceInMeters
    };
  }

  async setCheckinData(data: any) {
    let currentCheckins = (await this.getCheckinData()) as any[];
    if (!currentCheckins) {
      currentCheckins = [];
    }

    // Remove any completed check-ins for the same client
    currentCheckins = currentCheckins.filter(
      (checkin: any) => !(checkin.id === data.id && data.checkin.isDone)
    );

    // If the check-in is not completed, add or update it in the list
    if (!data.checkin.isDone) {
      const existingCheckinIndex = currentCheckins.findIndex(
        (checkin: any) => checkin.id === data.id && !checkin.checkin.isDone
      );

      if (existingCheckinIndex > -1) {
        currentCheckins[existingCheckinIndex] = data;
      } else {
        currentCheckins.push(data);
      }
    }

    await this.storageService.setData(KEY_VALUE.storageCheckinData, currentCheckins);
  }

  async getCheckinData() {
    return await this.storageService.getData(KEY_VALUE.storageCheckinData);
  }

  async clearCheckinData() {
    this.storageService.removeData(KEY_VALUE.storageCheckinData);
  }
  sendCheckinStartToServer(data: ICheckinStart) {
    return this.http.post(`${this.apiUrl}/checkin/start`, data).pipe();
  }
  checkout(data: any) {
    return this.http.post(`${this.apiUrl}/checkout`, data).pipe();
  }
}
