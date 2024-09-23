import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDTO } from '@shared/interfaces/cliente';
import { UserRole } from '@shared/interfaces/profile';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPromoterUser } from '../promoters/promoters.page';

@Injectable({ providedIn: 'root' })
export class PromoterService {
  private apiUrl = `${environment.baseUrl}${environment.apis}`;

  constructor(private http: HttpClient) {}

  getAllPromoters(filter: { role?: UserRole; active: boolean }) {
    if (!filter) {
      filter = { role: UserRole.PROMOTER, active: true };
    }
    return this.http
      .get<IDTO<IPromoterUser[]>>(`${this.apiUrl}/users/`, { params: filter })
      .pipe(map(res => res.data));
  }
}
