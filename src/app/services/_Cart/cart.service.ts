import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { AddProduct, CartResponse } from '../../interfaces/_Cart/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart/`;

  // Заголовок Telegram Init Data
  private headers = new HttpHeaders({
    'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
  });

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl, { headers: this.headers });
  }

  addItemToCart(productId: number, quantity: number = 1): Observable<any> {
    const payload: AddProduct = { product_id: productId, quantity };
    return this.http.post(this.apiUrl, payload, { headers: this.headers });
  }

  removeItemFromCart(productId: number): Observable<any> {
    const params = new HttpParams().set('product_id', productId.toString());
    return this.http.delete(this.apiUrl, { params, headers: this.headers });
  }

  updateItemQuantity(productId: number, quantity: number): Observable<any> {
    const payload: AddProduct = { product_id: productId, quantity };
    return this.http.put(this.apiUrl, payload, { headers: this.headers });
  }

  getOrderHistory(limit: number = 10, offset: number = 0): Observable<any[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
  
    const request = this.http.get<any[]>(`${this.apiUrl}order/history`, {
      params,
      headers: this.headers,
    });
  
    // Выводим запрос и полученные данные в консоль
    request.subscribe({
      next: (data) => console.log('[getOrderHistory] Полученные данные:', data),
      error: (error) => console.error('[getOrderHistory] Ошибка:', error),
    });
  
    return request;
  }

  getOrderDetails(orderId: number): Observable<any> {
    const request = this.http.get<any>(`${this.apiUrl}order/${orderId}`, {
      headers: this.headers,
    });
  
    // Выводим запрос и полученные данные в консоль
    request.subscribe({
      next: (data) => console.log('[getOrderDetails] Полученные данные:', data),
      error: (error) => console.error('[getOrderDetails] Ошибка:', error),
    });
  
    return request;
  }
}
