import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDTO, IStoreData } from '@shared/interfaces/cliente';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // https://galaxyteste.online/apis/apis/clientes/
  private baseUrl = `${environment.baseUrl}${environment.apis}/stores`;
  constructor(private http: HttpClient, private userService: UserService) {}

  obterLojas(
    date?: string,
    locationFilters?: {
      latitude: number;
      longitude: number;
      maxDistance: number;
    }
  ) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
    const payload = {
      nome: 'nomes',
      limit: 10,
      start: 0
    };

    // <ILojas[]>
    if (date || locationFilters) {
      return this.http
        .get<IDTO<IStoreData[]>>(
          `${this.baseUrl}${date ? `?date=${date}` : ''}${
            locationFilters
              ? `${date ? '&' : '?'}currentLocation[latitude]=${
                  locationFilters.latitude
                }&currentLocation[longitude]=${locationFilters.longitude}&maxDistance=${
                  locationFilters.maxDistance
                }&filterByUser=false`
              : ''
          }`,
          httpOptions
        )
        .pipe(
          map(res => {
            console.log(res?.data);
            return res?.data;
          })
        );
    }
    return this.http.get<IDTO<IStoreData[]>>(this.baseUrl, httpOptions).pipe(
      map(res => {
        console.log(res?.data);
        return res?.data;
      })
    );
  }
}
