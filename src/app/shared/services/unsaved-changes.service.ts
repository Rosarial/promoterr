import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesService {
  private hasUnsavedChanges = new Subject<boolean>();

  constructor() {
    this.hasUnsavedChanges.next(false);
  }

  setUnsavedChanges(status: boolean) {
    this.hasUnsavedChanges.next(status);
  }

  getUnsavedChanges() {
    return this.hasUnsavedChanges.asObservable();
  }
}
