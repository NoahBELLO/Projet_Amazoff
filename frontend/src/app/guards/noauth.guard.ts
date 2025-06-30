import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthentificationService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkCookie().pipe(
      map(response => {
        if (response.loggedIn) {
          return this.router.parseUrl('/dashboard');
        } else {
          return true;
        }
      }),
      catchError(() => of(true))
    );
  }
}