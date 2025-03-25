import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-item2',
  standalone: true,
  imports: [],
  templateUrl: './catalog-item2.component.html',
  styleUrl: './catalog-item2.component.css'
})
export class CatalogItem2Component {
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
