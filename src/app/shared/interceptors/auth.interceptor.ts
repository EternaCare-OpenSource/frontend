import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {TokenService} from '../services/token.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        tokenService.clearCurrentUser();
        router.navigate(['/iam/login']);
      }

      // if (error.status === 403) {
      //   router.navigate(['/access-denied']);
      // }

      return throwError(() => error);
    })
  );


};
