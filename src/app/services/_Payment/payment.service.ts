import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { CreatePaymentRequest, PaymentInitializeResponse } from '../../interfaces/_Payment/paymen.interface';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  createPayment(paymentRequest: CreatePaymentRequest): Observable<PaymentInitializeResponse> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    return this.http.post<PaymentInitializeResponse>(`${this.apiUrl}/create`, paymentRequest, { headers });
  }
}
