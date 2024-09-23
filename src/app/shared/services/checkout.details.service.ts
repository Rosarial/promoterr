import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICheckoutDetatils } from '@shared/interfaces/checkout.details';
import { IDTO } from '@shared/interfaces/cliente';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CheckoutDetailsService {
  private apiUrl = `${environment.baseUrl}${environment.apis}`;

  constructor(private http: HttpClient) {}

  public getDetails(data: { storeId: number; checkinId: number }) {
    return this.http
      .get<IDTO<ICheckoutDetatils>>(`${this.apiUrl}/checkout/details`, {
        params: data
      })
      .pipe(map(res => res.data));
  }
}
