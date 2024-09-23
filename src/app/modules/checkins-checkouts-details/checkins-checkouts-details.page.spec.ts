import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckinsCheckoutsDetailsPage } from './checkins-checkouts-details.page';

describe('CheckinsCheckoutsDetailsPage', () => {
  let component: CheckinsCheckoutsDetailsPage;
  let fixture: ComponentFixture<CheckinsCheckoutsDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinsCheckoutsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
