import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProfile } from '@shared/interfaces/profile';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit {
  @Input() userInfo!: IProfile;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // this.loadUserInfo();
    console.log('%c' + JSON.stringify(''), 'color:' + '' + ';font-weight:bold;');
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
