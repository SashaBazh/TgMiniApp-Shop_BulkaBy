import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogItemComponent } from '../catalog-item/catalog-item.component';
import { ProductCategoryService } from '../../../services/_Catalog/product-category.service';
import { ProductCategory } from '../../../interfaces/_Catalog/catalog.interface';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../services/_Language/language.service';

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
  isLoading = true;
  error: string | null = null;
  private languageSubscription!: Subscription;

  constructor(
    private router: Router,
    private productCategoryService: ProductCategoryService,
    private imageService: ImageStreamService,
    private languageService: LanguageService,
  ) { }

  ngOnInit() {
    this.loadCategories();

    this.languageSubscription = this.languageService.languageChange$.subscribe(() => {
      console.log('Language change detected. Reloading categories...');
      this.loadCategories();
      console.log('Категории обновлены');
    });
  }

  ngOnDestroy() {
    // Отписываемся, чтобы избежать утечек памяти
    if (this.languageSubscription) {
      console.log('Unsubscribing from language changes...');
      this.languageSubscription.unsubscribe();
    }
  }

  public loadCategories() {
    console.log('Категории начинают обновляться');
    this.productCategoryService.getCategories().subscribe({
      next: (categories) => {
        this.isLoading = false;
        if (categories && categories.length) {
          this.categories = (this.displayCount ? categories.slice(0, this.displayCount) : categories).map((category) => ({
            ...category,
            image: category.image ? this.imageService.getImageUrl(category.image) : 'assets/default-image.png',
          }));
        } else {
          this.categories = [];
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message || 'Не удалось загрузить данные.';
      },
    });
  }

  navigateToCategory(categoryId: number) {
    this.router.navigate(['/catalog', categoryId]);
  }
}
