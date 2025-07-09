import { Injectable } from '@angular/core';
import { Notifications } from './article.interface';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsUser = new BehaviorSubject<Notifications[]>([]);
  private nombreNotifications = new BehaviorSubject<number>(0);

  notificationsUser$ = this.notificationsUser.asObservable();
  nombreNotifications$ = this.nombreNotifications.asObservable();

  private baseUrl = 'http://localhost:3001/notifications/';

  constructor(private http: HttpClient, private auth: AuthentificationService) { }

  getNotificationUser(): Observable<any> {
    return this.auth.checkCookie().pipe(
      map((response) => {
        return response.userId;
      }),
      switchMap((userId: string) => {
        const url = `${this.baseUrl}/${userId}`;
        return this.http.get(url).pipe(
          tap((response: any) => {
            if (response && response.rs && response.rs.articles) {
              this.notificationsUser.next(response.rs.articles);
              const count = response.rs.articles.length; //compteur articles
              this.nombreNotifications.next(count);
            } else {
              console.log("Aucun article trouvé dans la réponse");
              this.notificationsUser.next([]);
              this.nombreNotifications.next(0);
            }
          }),
          catchError(error => {
            console.error('Erreur:', error);
            this.notificationsUser.next([]);
            this.nombreNotifications.next(0);
            return throwError(() => error);
          })
        );
      })
    );
  }
  getNombreNotifications() {
    return this.nombreNotifications$;
  }
}
