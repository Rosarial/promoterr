import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '@shared/interfaces/authuser';
import { IDTO } from '@shared/interfaces/cliente';
import { Observable, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfileService } from './profile.service';
import { StorageService } from './storage.service';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}${environment.apis}`;
  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private userService: UserService,
    private tokenService: TokenService,
    protected profileService: ProfileService
  ) {}

  login(data: { email: string; senha: string }) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
    return this.http.post<IDTO<ILogin>>(`${this.apiUrl}/auth/login`, data, httpOptions).pipe(
      map(r => r.data),
      tap(async response => {
        if (response?.accessToken) {
          const refreshToken = response.refreshToken;
          const accessToken = response.accessToken;
          this.tokenService.setAccessToken(accessToken);
          this.tokenService.setRefreshToken(refreshToken);
        }
      }),
      switchMap(() => this.profileService.getProfile()),
      map(res => {
        const userData = res;
        this.userService.updateDataUser(userData);
        return userData;
      })
    );
  }
  refreshToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post(`${this.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        this.tokenService.setAccessToken(response.accessToken);
      })
    );
  }
  logout() {
    this.storageService.clear();
    this.tokenService.clearTokens();
  }
}
