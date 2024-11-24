import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Импортируем HttpClient и HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { ProductDetailResponse } from '../../interfaces/_General/product-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProductDetail(productId: number): Observable<ProductDetailResponse> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data':
        (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    return this.http.get<ProductDetailResponse>(
      `${this.apiUrl}/${productId}`,
      { headers }
    );
  }
}
