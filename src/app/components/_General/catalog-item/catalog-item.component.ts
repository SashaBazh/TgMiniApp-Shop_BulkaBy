import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-item',
  standalone: true,
  imports: [],
  templateUrl: './catalog-item.component.html',
  styleUrl: './catalog-item.component.css'
})
export class CatalogItemComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() imageSrc!: string;

  imageLoaded: boolean = false;

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageLoaded = true; // Даже если изображение не загрузилось, убираем эффект загрузки
  }
}
