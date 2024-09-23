import { Component, HostListener, OnInit } from '@angular/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { AuthService, OverlayService, PermissionService, StorageService } from '@shared/services';
import { UnsavedChangesService } from '@shared/services/unsaved-changes.service';
import { UserService } from '@shared/services/user.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Notificações', url: '/notifications', icon: 'notifications' },
    { title: 'Mensagens', url: '/messages', icon: 'mail' },
    { title: 'Sair do aplicativo', onClick: () => this.logoff(), icon: 'exit' }
  ];
  public userData$!: Observable<any>;
  hasUnsavedChanges$: Observable<boolean>;

  constructor(
    private menuCtrl: MenuController,
    private permissionService: PermissionService,
    private userService: UserService,
    private authService: AuthService,
    private overlayService: OverlayService,
    private router: NavController,
    private storageService: StorageService,
    private platform: Platform,
    private unsavedChangesService: UnsavedChangesService
  ) {
    this.hasUnsavedChanges$ = this.unsavedChangesService.getUnsavedChanges();
    this.initialize();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    let hasUnsavedChanges = false;
    this.hasUnsavedChanges$.subscribe(status => (hasUnsavedChanges = status));
    if (hasUnsavedChanges) {
      $event.returnValue = true;
    }
  }

  initialize() {
    this.platform.ready().then(() => {});
  }
  ngOnInit(): void {
    this.menuCtrl.enable(false);
    this.getPermissions();
    this.getDataUser();
  }
  load() {
    location.reload();
  }
  logoff() {
    this.overlayService.alert({
      message: 'Você realmente deseja sair do aplicativo? Você terá que fazer login novamente.',
      header: 'Deseja sair do aplicativo?',
      buttons: [
        {
          text: 'Não',
          handler: () => {},
          role: 'cancel'
        },
        {
          text: 'Sim',
          handler: () => {
            this.authService.logout();
            this.load();
            this.router.navigateRoot(['login']);
          }
        }
      ]
    });
  }

  private getPermissions() {
    this.permissionService.requestPermissions('gps');
    this.permissionService.requestPermissions('camera');
  }

  private getDataUser() {
    this.userData$ = this.userService.currentUser();
  }
}
