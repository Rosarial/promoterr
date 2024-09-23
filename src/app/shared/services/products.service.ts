import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDTO } from '@shared/interfaces/cliente';
import { IProduct } from '@shared/interfaces/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.baseUrl}${environment.apis}/products/`;

  constructor(private http: HttpClient) {}
  getAll() {
    return this.http.get<IDTO<IProduct[]>>(this.baseUrl);
  }
}
