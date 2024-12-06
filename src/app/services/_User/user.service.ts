import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterUser {
  telegram_id: number;
  name: string;
  username?: string;
  lang?: string;
  points?: number;
  image?: string;
  birthday?: string; // либо Date, если вы будете конвертировать
  referrer_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://your-backend-url.com/register';

  constructor(private http: HttpClient) {}

  registerUser(data: RegisterUser): Observable<any> {
    // Если требуется авторизация, добавьте её в headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // например: 'Authorization': 'Bearer <your_token>'
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}
