import { Component, Input } from '@angular/core';
import { Product } from '../../../interfaces/_General/product.interface';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card-recomendation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-card-recomendation.component.html',
  styleUrls: ['./product-card-recomendation.component.css']
})
export class ProductCardRecomendationComponent {
  @Input() product!: Product;

  imageLoading: boolean = true; // Состояние загрузки изображения

  onImageLoad() {
    this.imageLoading = false; // Убираем серый фон после загрузки
  }

  setDefaultImage(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/default-image.png'; // Изображение по умолчанию
    this.imageLoading = false; // Убираем серый фон после ошибки загрузки
  }
}
