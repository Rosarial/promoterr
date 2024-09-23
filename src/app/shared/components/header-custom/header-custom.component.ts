import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-custom',
  templateUrl: './header-custom.component.html',
  styleUrls: ['./header-custom.component.scss']
})
export class HeaderCustomComponent {
  @Input() title = '';
  @Input() enableMenu = true;
  @Input() onBack = false;
  @Input() routerDefault = '/home';
}
