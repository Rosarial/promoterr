import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss']
})
export class SupervisorPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log('ngOnInit');
  }

  goToCheckins() {
    this.router.navigate(['/checkin']);
  }
  goToStores() {
    this.router.navigate(['/stores']);
  }
  goToPromoters() {
    this.router.navigate(['/promoters']);
  }
}
