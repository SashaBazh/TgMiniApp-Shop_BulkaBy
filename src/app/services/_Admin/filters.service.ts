import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllAttributes(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    return this.http.get<any[]>(`${this.apiUrl}/attributes/all`, { headers });
  }
  

  createAttribute(attributeData: { name: string; data_type: string; is_filterable: boolean }): Observable<any> {
    const formattedData = {
      ...attributeData,
      data_type: attributeData.data_type.toLowerCase(), // Приводим тип данных к нижнему регистру
    };

  
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '', // Добавляем нужные заголовки
    });

  
    return this.http.post(`${this.apiUrl}/attributes`, formattedData, { headers });

    
  }

  updateAttribute(attributeId: number, attributeData: { name: string; data_type: string; is_filterable: boolean }): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    return this.http.put(`${this.apiUrl}/attributes/${attributeId}`, attributeData, { headers });
  }
  

  deleteAttribute(attributeId: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    return this.http.delete(`${this.apiUrl}/attributes/${attributeId}`, { headers });
  }

  createOptions(options: { attribute_id: number; value: string }[]): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });
  
    return this.http.post(`${this.apiUrl}/products/attribute/option`, options, { headers });
  }
  
  
  
    
}
