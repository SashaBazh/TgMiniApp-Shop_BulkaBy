import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardRecomendationComponent } from '../../_General/product-card-recomendation/product-card-recomendation.component';
import { CategoryService } from '../../../services/_Catalog/category.service';
import { Product } from '../../../interfaces/_General/product.interface';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';

@Component({
  selector: 'app-recomendations',
  standalone: true,
  imports: [ProductCardRecomendationComponent, CommonModule],
  templateUrl: './recomendations.component.html',
  styleUrls: ['./recomendations.component.css']
})
export class RecomendationsComponent implements OnInit {
  recommendedProducts: Product[] = [];
  isLoading = false;

  constructor(private categoryService: CategoryService, public imageService: ImageStreamService,) {}

  ngOnInit() {
    this.loadRecommendedProducts();
  }

  private loadRecommendedProducts() {
    this.isLoading = true;
  
    this.categoryService.getProductsByCategory(1).subscribe({
      next: (data) => {
        // Обработка продуктов
        this.recommendedProducts = data.slice(0, 6).map((product) => ({
          ...product,
          image: product.media && product.media.length > 0
            ? this.imageService.getImageUrl(product.media[0]) // Первая картинка из media
            : 'assets/default-image.png', // Изображение по умолчанию
        }));
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки рекомендованных продуктов:', err);
        this.isLoading = false;
      },
    });
  }
  
  
}
