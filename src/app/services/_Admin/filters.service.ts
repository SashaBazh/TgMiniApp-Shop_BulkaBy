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

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'authorization': '1'
    });
  }

  getAllAttributes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attributes/all`, { headers: this.getHeaders() });
  }

  createAttribute(attributeData: { name: string; data_type: string; is_filterable: boolean }): Observable<any> {
    const formattedData = {
      ...attributeData,
      data_type: attributeData.data_type.toLowerCase(),
    };
  
    return this.http.post(`${this.apiUrl}/attributes`, formattedData, { headers: this.getHeaders() });
  }

  createOption(optionData: { attribute_id: number; value: string; translations: { [key: string]: { value: string } } }): Observable<any> {
    return this.http.post(`${this.apiUrl}/attribute/option`, optionData, { headers: this.getHeaders() });
  }

  updateAttribute(attributeId: number, attributeData: { name: string; data_type: string; is_filterable: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/attributes/${attributeId}`, attributeData, { headers: this.getHeaders() });
  }

  deleteAttribute(attributeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attributes/${attributeId}`, { headers: this.getHeaders() });
  }

  deleteAttributeOption(optionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attribute/option/${optionId}`, { headers: this.getHeaders() });
  }

}
