import * as moment from 'moment';
import { finalize, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { IMessage } from '@shared/interfaces/cliente';
import { IProfile } from '@shared/interfaces/profile';
import { OverlayService, MessageService } from '@shared/services';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})
export class NotificationPage implements OnInit, OnDestroy {
  public userInfo!: IProfile;

  public loading = true;
  public notifications: (IMessage & {
    sender: { id: number; userName: string; firstName?: string | null; lastName?: string | null };
  })[] = [];
  date = null;
  now = moment().format('YYYY-MM-DD');
  chosenDate: any;
  data: any;
  suscriptions$: Subscription[] = [];

  constructor(
    private menuCtrl: MenuController,
    private userService: UserService,
    private messageService: MessageService,
    private overlayService: OverlayService
  ) {}
  ngOnDestroy(): void {
    this.suscriptions$.forEach(sub => sub.unsubscribe());
  }

  async ionViewDidEnter() {
    this.menuCtrl.enable(true);
    const sub = this.userService
      .currentUser()

      .subscribe({
        next: userInfo => {
          if (userInfo) {
            this.userInfo = userInfo;
          }
        },
        error: error => {
          console.log(error);
        }
      });
    this.obterMensagens();
    this.ngOnInit();
    this.suscriptions$.push(sub);
  }
  async ngOnInit() {
    console.log();
  }
  public formatDateMessage(date: string) {
    return moment(date).format('L');
  }
  public formatHourMessage(date: string) {
    return moment(date).format('hh:mm');
  }
  private async obterMensagens() {
    this.loading = true;
    let notifications: IMessage[] = [];
    const loading = await this.overlayService.loading({ message: 'Carregando...' });
    this.messageService
      .getAllNotifications()
      .pipe(
        finalize(() => {
          this.loading = false;
          loading.dismiss();
        })
      )
      .subscribe({
        next: result => {
          this.notifications = result;
          notifications = result;
        },
        error: error => {
          console.log(error);
        }
      });
    return notifications;
  }
}
