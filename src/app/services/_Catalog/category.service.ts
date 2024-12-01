import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Product } from '../../interfaces/_General/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  

  getCategoryAttributes(categoryId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any[]>(`${this.apiUrl}/category/${categoryId}/attributes`, { headers })
      .pipe(
        tap((response: any) => {
          console.log('Полученные данные от API (getCategoryAttributes):', response);
        })
      );
  }





  getCategories(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiUrl}/category`, { headers });
  }

  // Новый метод для получения продуктов по категории
  getProductsByCategory(
    categoryId: number,
    filters: any = {},
    search?: string,
    limit: number = 50,
    offset: number = 0
  ): Observable<Product[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });
  
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
  
    if (search) {
      params = params.set('search', search);
    }
  
    // Добавляем фильтры в параметры запроса в формате filter_{attributeId}
    for (const attributeId in filters) {
      const values = filters[attributeId];
      const filterKey = `filter_${attributeId}`;
      if (Array.isArray(values)) {
        values.forEach((value: string) => {
          params = params.append(filterKey, value);
        });
      } else {
        params = params.append(filterKey, values);
      }
    }
  
    // Логируем сформированные параметры запроса
    console.log('Параметры запроса:', params.toString());
  
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`, { headers, params });
  }

  getPersonalOffers(limit: number = 10): Observable<Product[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });
  
    const params = new HttpParams().set('limit', limit.toString());
  
    return this.http.get<Product[]>(`${this.apiUrl}/personal-offers`, { headers, params }).pipe(
      tap((response) => {
        console.log('Полученные персональные рекомендации:', response);
      })
    );
  }
  


  getNewProducts(limit: number = 10, offset: number = 0): Observable<Product[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });
  
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
  
    return this.http.get<Product[]>(`${this.apiUrl}/new`, { headers, params }).pipe(
      tap((response) => {
        console.log('Полученные новые продукты:', response);
      })
    );
  }
}
