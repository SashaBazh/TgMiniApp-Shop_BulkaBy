import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { AddProduct, CartResponse } from '../../interfaces/_Cart/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    const headers = this.getHeaders();
    return this.http.get<CartResponse>(this.apiUrl, { headers });
  }

  addItemToCart(productId: number, quantity: number = 1): Observable<any> {
    const headers = this.getHeaders();
    const payload: AddProduct = { product_id: productId, quantity };
    return this.http.post(this.apiUrl, payload, { headers });
  }

  removeItemFromCart(productId: number): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('product_id', productId.toString());
    return this.http.delete(this.apiUrl, { headers, params });
  }

  updateItemQuantity(productId: number, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    const payload: AddProduct = { product_id: productId, quantity };
    return this.http.put(this.apiUrl, payload, { headers });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });
  }
}
