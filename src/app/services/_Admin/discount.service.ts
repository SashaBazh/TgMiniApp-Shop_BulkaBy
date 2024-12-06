import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private apiUrl = `${environment.apiUrl}/products/discount`;

  constructor(private http: HttpClient) {}

  private getTelegramHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
      'Content-Type': 'application/json',
    });
  }

  getDiscounts(): Observable<any[]> {
    const headers = this.getTelegramHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/`, { headers });
  }

  createDiscount(discountData: any): Observable<any> {
    const headers = this.getTelegramHeaders();
    return this.http.post(`${this.apiUrl}`, discountData, { headers });
  }

  updateDiscount(discountId: number, discountData: any): Observable<any> {
    const headers = this.getTelegramHeaders();
    return this.http.put(`${this.apiUrl}/${discountId}`, discountData, { headers });
  }

  deleteDiscount(discountId: number): Observable<any> {
    const headers = this.getTelegramHeaders();
    return this.http.delete(`${this.apiUrl}/${discountId}`, { headers });
  }
}
