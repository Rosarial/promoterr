import { Injectable, inject } from '@angular/core';
import { KEY_VALUE } from '@shared/enums/storage.key.enum';
import { IProfile } from '@shared/interfaces/profile';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject$: BehaviorSubject<any> = new BehaviorSubject<any>({
    nome: '',
    email: '',
    primeiroNome: '',
    segundoNome: '',
    id: '',
    nivel: '',
    empresa: '',
    ativo: '',
    foto: '',
    currentPosition: {
      lat: 0,
      lng: 0
    }
  });
  private storageService = inject(StorageService);

  constructor() {
    this.getDataUser();
  }

  public currentUser(): Observable<IProfile> {
    return this.userSubject$.asObservable();
  }
  public updateDataUser(payload: IProfile) {
    this.userSubject$.next(payload);
    this.storageService.setData<IProfile>(KEY_VALUE.authUser, payload);
  }

  public async isLoggedIn() {
    const userData = await this.getDataUser();
    return !!userData?.id;
  }

  public getUserLoged() {
    return this.userSubject$.getValue() as IProfile;
  }

  private async getDataUser() {
    const userData = await this.storageService.getData<IProfile>(KEY_VALUE.authUser);
    if (userData) {
      this.userSubject$.next(userData);
    }
    return userData;
  }
}
