import * as moment from 'moment';
import { finalize, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { IChat, IMessage } from '@shared/interfaces/cliente';
import { IProfile } from '@shared/interfaces/profile';
import { OverlayService, MessageService } from '@shared/services';
import { UserService } from '@shared/services/user.service';
import { PromoterService } from './../../modules/services/promoters.service';
import { IPromoterUser } from 'src/app/modules/promoters/promoters.page';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss']
})
export class MessagePage implements OnInit, OnDestroy {
  public userInfo!: IProfile;

  public chats: IChat[] = [];
  public loading = true;
  public sending = false;
  public selectedReceiverChat: IChat['receiver'] | null = null;
  public messages: IMessage[] = [];
  date = null;
  now = moment().format('YYYY-MM-DD');
  chosenDate: any;
  data: any;
  suscriptions$: Subscription[] = [];
  users: IPromoterUser[] = [];
  profileForm!: FormGroup;

  constructor(
    private menuCtrl: MenuController,
    private userService: UserService,
    private messageService: MessageService,
    private overlayService: OverlayService,
    private promoterService: PromoterService,
    private fb: UntypedFormBuilder
  ) {}
  fillAllChats() {
    if (!this.chats.length || !this.users.length) {
      setTimeout(() => {
        this.fillAllChats();
      }, 500);
    }
    const userIdsThatHaveMessage = this.chats.map(chats => chats.receiver.id);
    const missingChats: IChat[] = [];

    this.users.forEach(user => {
      if (!userIdsThatHaveMessage.includes(user.id) && user.id !== this.userInfo.userId) {
        missingChats.push({
          lastMessage: null,
          receiver: {
            ...user
          }
        });
      }
    });
    this.chats = [...this.chats, ...missingChats];
  }
  ngOnDestroy(): void {
    this.suscriptions$.forEach(sub => sub.unsubscribe());
  }
  async fetchInitialData() {
    await Promise.all([this.obterChats(), this.obterUsuarios()]);
    this.fillAllChats();
    this.obterMensagens();
  }
  scrollToBottom() {
    const messagesContainer = document.getElementsByClassName('messagesContainer');
    messagesContainer[0].scrollTo(0, messagesContainer[0].scrollHeight);
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
    this.fetchInitialData();
    this.ngOnInit();
    this.suscriptions$.push(sub);
  }
  async ngOnInit() {
    this.initForm();
  }
  private initForm() {
    this.profileForm = this.fb.group({
      messageText: ['', Validators.required]
    });
  }
  public formatDateMessage(date: string) {
    return moment(date).format('L');
  }
  public formatHourMessage(date: string) {
    return moment(date).format('hh:mm');
  }
  private async obterUsuarios() {
    this.loading = true;
    let users: IPromoterUser[] = [];
    const loading = await this.overlayService.loading({ message: 'Carregando...' });
    this.promoterService
      .getAllPromoters({
        active: true
      })
      .pipe(
        finalize(() => {
          this.loading = false;
          loading.dismiss();
        })
      )
      .subscribe({
        next: result => {
          this.users = result;
          users = result;
        },
        error: error => {
          console.log(error);
        }
      });
    return users;
  }
  private async obterChats() {
    this.loading = true;
    let chats: IChat[] = [];
    const loading = await this.overlayService.loading({ message: 'Carregando...' });
    this.messageService
      .getAllChats()
      .pipe(
        finalize(() => {
          this.loading = false;
          loading.dismiss();
        })
      )
      .subscribe({
        next: result => {
          this.chats = result;
          chats = result;
        },
        error: error => {
          console.log(error);
        }
      });
    return chats;
  }
  public async enviarMensagem() {
    if (!this.profileForm.valid || !this.selectedReceiverChat) return null;
    this.sending = true;
    let response;
    const mensagem = this.profileForm.get('messageText')?.value;
    this.messageService
      .sendMessage(this.selectedReceiverChat.id, mensagem)
      .pipe()
      .subscribe({
        next: result => {
          this.messages = [...this.messages, result];
          response = result;
          this.profileForm.reset('messageText');
          this.sending = false;
        },
        error: error => {
          console.log(error);
          this.sending = false;
        }
      });
    return response;
  }
  private async obterMensagens() {
    if (!this.selectedReceiverChat?.id) return null;
    this.loading = true;
    let messages: IMessage[] = [];
    const loading = await this.overlayService.loading({ message: 'Carregando...' });
    this.messageService
      .getAllMessages(this.selectedReceiverChat.id)
      .pipe(
        finalize(() => {
          this.loading = false;
          loading.dismiss();
        })
      )
      .subscribe({
        next: result => {
          this.messages = result;
          messages = result;
        },
        error: error => {
          console.log(error);
        }
      });
    return messages;
  }
  public selectChat(receiver: IChat['receiver']) {
    this.selectedReceiverChat = receiver;
    this.obterMensagens();
  }
  public deselectChat() {
    this.chats = [];
    this.users = [];
    this.messages = [];
    this.selectedReceiverChat = null;
    this.fetchInitialData();
  }
  public handleClickSendButton() {
    this.scrollToBottom();
    this.enviarMensagem();
  }
}
