import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageStreamService {
  private apiUrl = `${environment.apiUrl}/data`;

  getImageUrl(imagePath: string): string {
    return `${this.apiUrl}/stream?image_path=${encodeURIComponent(imagePath)}`;
  }
}
