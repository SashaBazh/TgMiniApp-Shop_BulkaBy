import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardRecomendationComponent } from '../../_General/product-card-recomendation/product-card-recomendation.component';
import { CategoryService } from '../../../services/_Catalog/category.service';
import { Product } from '../../../interfaces/_General/product.interface';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recomendations',
  standalone: true,
  imports: [ProductCardRecomendationComponent, CommonModule, TranslateModule],
  templateUrl: './recomendations.component.html',
  styleUrls: ['./recomendations.component.css']
})
export class RecomendationsComponent implements OnInit {
  recommendedProducts: Product[] = [];
  isLoading = false;
  categoryId: number | null = null; // Будем извлекать этот параметр из URL

  constructor(
    private categoryService: CategoryService,
    public imageService: ImageStreamService,
    private router: Router,
    private route: ActivatedRoute // Инжектируем ActivatedRoute
  ) {}

  ngOnInit() {
    // Получаем categoryId из пути
    this.route.paramMap.subscribe((params) => {
      const categoryIdParam = params.get('category'); // Извлекаем параметр 'category'
      this.categoryId = categoryIdParam ? +categoryIdParam : null; // Преобразуем в число
      console.log('Извлечённый categoryId:', this.categoryId);

      // Загружаем рекомендованные продукты
      this.loadRecommendedProducts();
    });
  }

  private loadRecommendedProducts() {
    this.isLoading = true;

    this.categoryService.getPersonalOffers(6).subscribe({
      next: (data) => {
        this.recommendedProducts = data.map((product) => ({
          ...product,
          image: product.media && product.media.length > 0
            ? this.imageService.getImageUrl(product.media[0])
            : 'assets/default-image.png',
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки персональных рекомендаций:', err);
        this.isLoading = false;
      },
    });
  }

  openProduct(product: Product) {
    this.router.navigate([`/catalog/${product.category_id}/${product.id}`]);
  }
  
}
