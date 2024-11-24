import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogItemComponent } from '../catalog-item/catalog-item.component';
import { ProductCategoryService } from '../../../services/_Catalog/product-category.service';
import { ProductCategory } from '../../../interfaces/_Catalog/catalog.interface';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';

@Component({
  selector: 'app-cataloggeneral',
  standalone: true,
  imports: [CommonModule, CatalogItemComponent],
  templateUrl: './cataloggeneral.component.html',
  styleUrls: ['./cataloggeneral.component.css'],
})

export class CataloggeneralComponent implements OnInit {
  @Input() displayCount?: number;
  categories: ProductCategory[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private productCategoryService: ProductCategoryService,
    private imageService: ImageStreamService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.productCategoryService.getCategories()
      .subscribe({
        next: (categories) => {
          if (categories && categories.length) {
            this.categories = (this.displayCount ? categories.slice(0, this.displayCount) : categories)
              .map(category => ({
                ...category,
                image: category.image ? this.imageService.getImageUrl(category.image) : 'assets/default-image.png'
              }));
          } else {
            this.categories = [];
          }
        },
        error: (error) => {
          this.error = error.message || 'Не удалось загрузить данные.';
        }
      });
  }
  
  navigateToCategory(categoryId: number) {
    this.router.navigate(['/catalog', categoryId]); // Передаем ID категории
  }  
}
