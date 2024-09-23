// src/app/guards/unsaved-changes.guard.ts
import { Directive, HostListener } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

export const CanDeactivateGuard: CanDeactivateFn<ComponentCanDeactivate> = (
  component: CanComponentDeactivate
) => {
  console.log(component.canDeactivate());
  return component?.canDeactivate() ?? true;
};

@Directive()
export abstract class ComponentCanDeactivate {
  abstract canDeactivate(): boolean;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}
