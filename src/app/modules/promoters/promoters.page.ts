import { Component, OnInit } from '@angular/core';
import { UserRole } from '@shared/interfaces/profile';
import { PromoterService } from '../services/promoters.service';

@Component({
  selector: 'app-promoters',
  templateUrl: './promoters.page.html',
  styleUrls: ['./promoters.page.scss']
})
export class PromotersPage implements OnInit {
  promotersUser!: IPromoterUser[];
  constructor(private promoterService: PromoterService) {}

  ngOnInit() {
    this.promoterService
      .getAllPromoters({ role: UserRole.PROMOTER, active: true })
      .subscribe(res => {
        console.log(res);
        this.promotersUser = res;
      });
  }
}

export interface IPromoterUser {
  id: number;
  email: string;
  userName: string;
  role: UserRole;
  active: true;
  createdAt: string;
  updatedAt: string;
  profile: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    photo: '';
    deviceInfo: any;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
  };
}
