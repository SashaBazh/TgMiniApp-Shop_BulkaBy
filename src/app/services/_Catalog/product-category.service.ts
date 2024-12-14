import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductCategory } from '../../interfaces/_Catalog/catalog.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ProductCategory[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    console.log('Подготовка к запросу категорий...');
    console.log('Заголовки:', headers);
  
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/category?timestamp=${new Date().getTime()}`, { headers }).pipe(
      tap({
        next: (categories) => {
          console.log('Категории успешно получены:', categories);
        },
        error: (error) => {
          console.error('Ошибка при получении категорий:', error);
        },
      })
    );
  }
  
  
}
