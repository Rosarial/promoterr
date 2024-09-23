import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromotersPage } from './promoters.page';

describe('PromotersPage', () => {
  let component: PromotersPage;
  let fixture: ComponentFixture<PromotersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
