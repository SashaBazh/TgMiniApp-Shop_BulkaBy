// categories.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Attribute, AttributeResponse } from '../../interfaces/_Admin/attribute.interface';

export interface ProductCategoryResponse {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  createCategory(categoryData: { name: string; description: string; translations: { ru: { name: string }; en: { name: string } }; image: File }): Observable<any> {
    const formData = new FormData();
  
    // Основные данные
    formData.append('category_data', JSON.stringify({
      name: categoryData.name,
      description: categoryData.description,
      translations: categoryData.translations, // Добавляем переводы
    }));
  
    // Изображение
    formData.append('image', categoryData.image, categoryData.image.name);

    // Добавляем заголовки, если необходимо
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
      // Не указываем Content-Type, браузер сам его установит для FormData
    });

    return this.http.post(`${this.apiUrl}/categories`, formData, { headers });
  }

  getCategories(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiUrl}/category`, { headers });
  }

  // Обновление категории
  updateCategory(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
    });
  
    return this.http.put(`${this.apiUrl}/categories`, formData, { headers });
  }
  


  // Удаление категории
  deleteCategory(categoryId: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    const url = `${this.apiUrl}/categories/${categoryId}`;
  
    return this.http.delete(url, { headers })
  }
  

  getCategoryAttributes(categoryId: number): Observable<AttributeResponse[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });

    const url = `${this.apiUrl}/category/${categoryId}/attributes`;

    return this.http.get<AttributeResponse[]>(url, { headers })
      .pipe(
        tap((attributes: any) => console.log('Attributes received from API in service:', attributes)) // Логирование ответа
      );
  }

  assignAttributesToCategory(categoryId: number, attributeIds: number[]): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
      'Content-Type': 'application/json',
    });
  
    const url = `${this.apiUrl}/categories/attributes`;
  
    // Создаем массив запросов, по одному на каждый атрибут
    const requests = attributeIds.map(attributeId => {
      const payload = { category_id: categoryId, attribute_id: attributeId };
      console.log('Sending POST request for attribute:', payload); // Логируем отправляемые данные
      return this.http.post(url, payload, { headers });
    });
  
    // Возвращаем массив запросов, который можно обработать дальше
    return forkJoin(requests);
  }


  // categories.service.ts

  getAllAttributes(): Observable<AttributeResponse[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });

    const url = `${this.apiUrl}/attributes/all`; // Предполагаем, что этот эндпоинт возвращает все атрибуты
    return this.http.get<AttributeResponse[]>(url, { headers });
  }


}
