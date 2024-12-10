import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

export interface RegisterUser {
  telegram_id: number; // Исправлено на тип number
  name: string; // Исправлено на тип string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/auth/register`;

  constructor(private http: HttpClient) {}

  registerUser(data: RegisterUser): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': 'eee3f863-ce17-42e2-a9ae-15d3ee832705'
    });

    // Передача данных в формате JSON
    return this.http.post(this.apiUrl, JSON.stringify(data), { headers });
  }
}
