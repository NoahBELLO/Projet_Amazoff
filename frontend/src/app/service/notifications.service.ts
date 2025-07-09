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
        const url = `${this.baseUrl}my-notifications?userId=${userId}`;
        return this.http.get(url).pipe(
          tap((response: any) => {
            if (response) {
              this.notificationsUser.next(response);
              const count = response.length;
              this.nombreNotifications.next(count);
            } else {
              console.log("Aucune notification trouvé dans la réponse");
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

  deleteNotification(id: string): Observable<any> {
    return this.auth.checkCookie().pipe(
      switchMap((response) => {
        return this.http.delete(`${this.baseUrl}${id}`).pipe(
          tap(() => {
            this.notificationsUser.next([]);
            this.nombreNotifications.next(0);
          }),
          catchError(error => {
            console.error('Erreur lors de la suppression de toutes les notifications:', error);
            return throwError(() => error);
          })
        );
      })
    );
  }

  deleteAllNotifications(): Observable<any> {
    return this.auth.checkCookie().pipe(
      switchMap((response) => {
        const userId = response.userId;
        return this.http.delete(`${this.baseUrl}delete-by-user-ids/${userId}`).pipe(
          tap(() => {
            this.notificationsUser.next([]);
            this.nombreNotifications.next(0);
          }),
          catchError(error => {
            console.error('Erreur lors de la suppression de toutes les notifications:', error);
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
