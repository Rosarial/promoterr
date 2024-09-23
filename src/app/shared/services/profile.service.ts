import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDTO } from '@shared/interfaces/cliente';
import { IProfile } from '@shared/interfaces/profile';
import { map, retry, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.baseUrl}${environment.apis}`;

  constructor(private http: HttpClient) {}

  updateProfile(data: IProfile) {
    return this.http
      .put<IDTO<IProfile>>(`${this.apiUrl}/users/profile`, data)
      .pipe(map(res => res.data));
  }
  getProfile() {
    return this.http.get<IDTO<IProfile>>(`${this.apiUrl}/users/profile`).pipe(
      retry(3),
      take(1),
      map(res => res.data)
    );
  }
}
