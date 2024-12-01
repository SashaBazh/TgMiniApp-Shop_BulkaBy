import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CategoryService } from '../../../services/_Catalog/category.service';
import { Product } from '../../../interfaces/_General/product.interface';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-jewelry',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './new-jewelry.component.html',
  styleUrls: ['./new-jewelry.component.css']
})
export class NewJewelryComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  categoryId: number | null = null;

  constructor(private categoryService: CategoryService, private imageService: ImageStreamService, private router: Router) {
    this.categoryId = 1;
  }

  ngOnInit() {
    this.loadNewProducts();
  }
  
  private loadNewProducts() {
    this.isLoading = true;
  
    this.categoryService.getNewProducts(6).subscribe({
      next: (data) => {
        this.products = data.map((product) => ({
          ...product,
          image: product.media && product.media.length > 0
            ? this.imageService.getImageUrl(product.media[0]) // Первая картинка из media
            : 'assets/default-image.png', // Изображение по умолчанию
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки новых продуктов:', err);
        this.isLoading = false;
      },
    });
  }
  
  

  // Получение первой строки (3 элемента)
  get firstRowProducts(): Product[] {
    return this.products.slice(0, 3);
  }

  // Получение второй строки (3 элемента)
  get secondRowProducts(): Product[] {
    return this.products.slice(3, 6);
  }

  items: any[] = [
    { name: 'Кольца' },
    { name: 'Серьги' },
    { name: 'Браслеты' },
    { name: 'Ожерелья' },
    { name: 'Подвески' }
  ];

  openProduct(productId: number) {
    if (this.categoryId !== null) {
      this.router.navigate([`/catalog/${this.categoryId}/${productId}`]); // Переход на детальную страницу товара
    }
  }
}
