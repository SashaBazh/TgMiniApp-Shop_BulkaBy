import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

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

    const initData = (window as any).Telegram?.WebApp?.initData;
    if (!initData) {
      console.error('Telegram init data is missing');
    }
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
    });


    return this.http.post(`${this.apiUrl}/attributes`, formattedData, { headers });
  }

  updateAttribute(attributeId: number, attributeData: { name: string; data_type: string; is_filterable: boolean }): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
    });

    return this.http.put(`${this.apiUrl}/attributes/${attributeId}`, attributeData, { headers });
  }


  deleteAttribute(attributeId: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
    });

    return this.http.delete(`${this.apiUrl}/attributes/${attributeId}`, { headers });
  }



  createOption(optionData: { attribute_id: number; value: string; translations: { [key: string]: { value: string } } }): Observable<any> { 
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
      'Content-Type': 'application/json',
    });
  
    // Логирование данных
    console.log('Отправляемые данные для создания опции:', optionData);
  
    return this.http.post(`${this.apiUrl}/attribute/option`, optionData, { headers });
  }   

  deleteAttributeOption(optionId: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
    });

    return this.http.delete(`${this.apiUrl}/attribute/option/${optionId}`, { headers });
  }







}
