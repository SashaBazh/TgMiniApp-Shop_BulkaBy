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
  
  private async loadNewProducts() {
    this.isLoading = true;
  
    try {
      const products = await this.categoryService.getNewProducts(6).toPromise();
  
      if (!products || products.length === 0) {
        console.warn('Новые продукты не найдены');
        this.products = [];
        return;
      }
  
      // Инициализируем продукты с серым фоном
      this.products = products.map((product) => ({
        ...product,
        image: 'assets/default-image.png',
        imageLoading: true,
      }));
  
      // Последовательная загрузка изображений
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const imageUrl = product.media && product.media.length > 0
          ? await this.loadImage(product.media[0])
          : 'assets/default-image.png';
  
        this.products[i] = {
          ...product,
          image: imageUrl,
          imageLoading: false,
        };
        console.log(`Изображение загружено для продукта: ${product.name}`);
      }
  
      console.log('Все новые продукты успешно обработаны:', this.products);
    } catch (err) {
      console.error('Ошибка загрузки новых продуктов:', err);
      this.products = [];
    } finally {
      this.isLoading = false;
    }
  }
  
  // Метод загрузки изображения
  private loadImage(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.imageService.getImageUrl(imageUrl);
  
      img.onload = () => resolve(this.imageService.getImageUrl(imageUrl));
      img.onerror = () => {
        console.error('Ошибка загрузки изображения:', imageUrl);
        resolve('assets/default-image.png');
      };
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
