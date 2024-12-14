import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { Product } from '../../interfaces/_General/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/products`;

  private headers = new HttpHeaders({
    'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
  });

  constructor(private http: HttpClient) {}

  getCategoryAttributes(categoryId: number, filterable: boolean = true): Observable<any[]> {
    const url = `${this.apiUrl}/category/${categoryId}/attributes?filterable=${filterable}&timestamp=${new Date().getTime()}`;
    console.log('Отправляем запрос:', url);
    return this.http.get<any[]>(url, { headers: this.headers }).pipe(
      map((response) => {
        console.log('Ответ сервера:', response);
        return response;
      })
    );
  }

  getCategories(): Observable<any[]> {
    const url = `${this.apiUrl}/category?timestamp=${new Date().getTime()}`;
    return this.http.get<any[]>(url, { headers: this.headers }).pipe(
      map((response) => {
        console.log('Получены категории:', response);
        return response;
      })
    );
  }

  getProductsByCategory(
    categoryId: number,
    filters: any = {},
    search?: string,
    limit: number = 50,
    offset: number = 0
  ): Observable<Product[]> {
    let url = `${this.apiUrl}/category/${categoryId}?limit=${limit}&offset=${offset}&timestamp=${new Date().getTime()}`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    for (const attributeId in filters) {
      const values = filters[attributeId];
      if (Array.isArray(values)) {
        values.forEach((value: string) => {
          url += `&filter_${attributeId}=${encodeURIComponent(value)}`;
        });
      } else {
        url += `&filter_${attributeId}=${encodeURIComponent(values)}`;
      }
    }

    return this.http.get<Product[]>(url, { headers: this.headers }).pipe(
      map((response) => {
        console.log('Получены продукты категории:', response);
        return response;
      })
    );
  }

  getPersonalOffers(limit: number = 10): Observable<Product[]> {
    const url = `${this.apiUrl}/personal-offers?limit=${limit}&timestamp=${new Date().getTime()}`;
    return this.http.get<Product[]>(url, { headers: this.headers }).pipe(
      map((response) => {
        console.log('Персональные предложения:', response);
        return response;
      })
    );
  }

  getNewProducts(limit: number = 10, offset: number = 0): Observable<Product[]> {
    const url = `${this.apiUrl}/new?limit=${limit}&offset=${offset}&timestamp=${new Date().getTime()}`;
    return this.http.get<Product[]>(url, { headers: this.headers }).pipe(
      map((response) => {
        console.log('Новые продукты:', response);
        return response;
      })
    );
  }
}
