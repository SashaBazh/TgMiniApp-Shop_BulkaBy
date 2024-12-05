import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { ProductCreateData, ProductResponse } from '../../interfaces/_Admin/product.interface';
import { Product } from '../../interfaces/_General/product.interface';
import { AttributeResponse } from '../../interfaces/_Admin/attribute.interface';
import { ProductDetailResponse } from '../../interfaces/_General/product-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  createProduct(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
    });
  
    // Логируем содержимое FormData
    console.log('FormData содержит:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: File (name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
  
    // Отправляем FormData на сервер
    return this.http.post(`${this.apiUrl}/`, formData, { headers });
  }
  
  
  
  
  

  getProducts(params: { category_id?: number, filters?: any, search?: string, limit?: number, offset?: number } = {}): Observable<Product[]> {
    const { category_id, filters = {}, search, limit = 50, offset = 0 } = params;

    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (search) {
      httpParams = httpParams.set('search', search);
    }

    // Добавляем фильтры в параметры запроса, если необходимо

    const url = category_id
      ? `${this.apiUrl}/category/${category_id}`
      : this.apiUrl;

    return this.http.get<Product[]>(url, { headers, params: httpParams });
  }

  getCategoryAttributes(categoryId: number): Observable<AttributeResponse[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });

    const url = `${this.apiUrl}/category/${categoryId}/attributes`;
    console.log('Making GET request to:', url, 'with headers:', headers); // Логирование запроса

    return this.http.get<AttributeResponse[]>(url, { headers })
      .pipe(
        tap((attributes: any) => console.log('Attributes received from API in service:', attributes)) // Логирование ответа
      );
  }

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

  updateProduct(productId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/`, formData, {
      headers: {
        'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
      },
    });
  }  
  
  

  deleteProduct(productId: number): Observable<any> {
    const headers = {
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
    };
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers });
  }
  
  




}