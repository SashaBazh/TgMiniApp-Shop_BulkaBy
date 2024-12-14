import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { ProductDetailResponse } from '../../interfaces/_General/product-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  private headers = new HttpHeaders({
    'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
  });

  constructor(private http: HttpClient) {}

  getProductDetail(productId: number): Observable<ProductDetailResponse> {
    console.log('Запрос деталей продукта начат...');
    console.log('ID продукта:', productId);
    console.log('Заголовки:', this.headers);
  
    return this.http.get<ProductDetailResponse>(`${this.apiUrl}/${productId}?timestamp=${new Date().getTime()}`, {
      headers: this.headers,
    }).pipe(
      tap({
        next: (productDetail) => {
          console.log('Детали продукта успешно получены:', productDetail);
        },
        error: (error) => {
          console.error('Ошибка при получении деталей продукта:', error);
        },
      })
    );
  }
  
}
