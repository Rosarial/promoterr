import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessTokenKey = `${environment.appInfo.bundledId}_access_token`;
  private refreshTokenKey = `${environment.appInfo.bundledId}refresh_token`;

  setAccessToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }
  removeRefreshToken(): void {
    localStorage.removeItem(this.refreshTokenKey);
  }
}
