import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@shared/services';
import { TokenService } from '@shared/services/token.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService, private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = this.tokenService.getAccessToken();
    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          const error401 = error.status === 401;
          const error403 = error.status === 403;
          const notUrl =
            !authReq.url.includes('auth/login') || !authReq.url.includes('auth/refresh-token');
          if (error401 && notUrl) {
            return this.handle401Error(authReq, next);
          } else if (error403 && notUrl) {
            return this.handle403Error(authReq, next);
          }
        }
        // if (
        //   (error instanceof HttpErrorResponse &&
        //     error.status === 401 &&
        //     !authReq.url.includes('auth/login')) ||
        //     !authReq.url.includes('auth/refresh-token')
        //   ) {
        //   const error401 = error.status === 401;
        //   return this.handle401Error(authReq, next);
        // }

        return throwError(error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.tokenService.setAccessToken(token.accessToken);
          this.refreshTokenSubject.next(token.accessToken);

          return next.handle(this.addTokenHeader(request, token.accessToken));
        }),
        catchError(err => {
          this.isRefreshing = false;

          this.authService.logout();
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addTokenHeader(request, jwt));
        })
      );
    }
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request);
  }
}
