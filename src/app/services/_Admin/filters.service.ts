import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAllAttributes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attributes/all`);
  }

  createAttribute(attributeData: { name: string; data_type: string; is_filterable: boolean }): Observable<any> {
    const formattedData = {
      ...attributeData,
      data_type: attributeData.data_type.toLowerCase(),
    };

    return this.http.post(`${this.apiUrl}/attributes`, formattedData);
  }

  updateAttribute(attributeId: number, attributeData: { name: string; data_type: string; is_filterable: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/attributes/${attributeId}`, attributeData);
  }

  deleteAttribute(attributeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attributes/${attributeId}`);
  }

  createOption(optionData: { attribute_id: number; value: string; translations: { [key: string]: { value: string } } }): Observable<any> {
    return this.http.post(`${this.apiUrl}/attribute/option`, optionData);
  }

  deleteAttributeOption(optionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attribute/option/${optionId}`);
  }
}
