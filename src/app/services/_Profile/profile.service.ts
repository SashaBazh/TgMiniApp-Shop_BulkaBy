import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { UserProfileResponse } from '../../interfaces/_Profile/friend.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/user/profile`;

  constructor(private http: HttpClient) {}
  
  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(this.apiUrl);
  }
}
