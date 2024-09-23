import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataRouterService {
  private data: Array<any>;

  constructor() {
    this.data = [];
  }

  setData(id: number, data: any) {
    this.data[id] = data;
  }

  getData(id: number) {
    return this.data[id];
  }
}
