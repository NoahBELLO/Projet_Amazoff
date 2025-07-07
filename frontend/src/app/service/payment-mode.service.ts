import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentMode {
  _id?: string;
  userId: string;
  method: string;
  description?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentModeService {
  private apiUrl = 'http://localhost:6006/paymentMode';
  //@dur
  private userId = '677bee6f001291cbbef4eda4';

  constructor(private http: HttpClient) { }


  getUserPaymentModes(): Observable<PaymentMode[]> {
    return this.http.get<PaymentMode[]>(`${this.apiUrl}/user?userId=${this.userId}`);
  }


  createPaymentMode(mode: Partial<PaymentMode>): Observable<PaymentMode> {
    return this.http.post<PaymentMode>(`${this.apiUrl}/create`, { ...mode, userId: this.userId });
  }

  updatePaymentMode(id: string, update: Partial<PaymentMode>): Observable<PaymentMode> {
    return this.http.put<PaymentMode>(`${this.apiUrl}/update/${id}?userId=${this.userId}`, update);
  }

  deletePaymentMode(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?userId=${this.userId}`);
  }
}
