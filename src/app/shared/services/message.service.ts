import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDTO, IChat, IMessage } from '@shared/interfaces/cliente';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = `${environment.baseUrl}${environment.apis}/messages`;
  constructor(private http: HttpClient, private userService: UserService) {}

  getAllChats() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    return this.http.get<IDTO<IChat[]>>(`${this.baseUrl}/chats`, httpOptions).pipe(
      map(res => {
        return res?.data;
      })
    );
  }
  getAllMessages(receiverId?: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    return this.http
      .get<IDTO<IMessage[]>>(`${this.baseUrl}/?receiverId=${receiverId}`, httpOptions)
      .pipe(
        map(res => {
          return res?.data;
        })
      );
  }
  getAllNotifications() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    return this.http
      .get<
        IDTO<
          (IMessage & {
            sender: {
              id: number;
              userName: string;
              firstName?: string | null;
              lastName?: string | null;
            };
          })[]
        >
      >(`${this.baseUrl}/notifications`, httpOptions)
      .pipe(
        map(res => {
          return res?.data;
        })
      );
  }
  sendMessage(receiverId: number, message: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    return this.http
      .post<IDTO<IMessage>>(
        `${this.baseUrl}/`,
        {
          receiverId,
          message
        },
        httpOptions
      )
      .pipe(
        map(res => {
          return res?.data;
        })
      );
  }
}
