import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { HeaderbackComponent } from '../../_General/headerback/headerback.component';
import { SearchComponent } from '../search/search.component';
import { FiltersComponent } from '../../_General/filters/filters.component';
import { CategoryService } from '../../../services/_Catalog/category.service';
import { Product } from '../../../interfaces/_General/product.interface';
import { ProductCardComponent } from '../../_General/product-card/product-card.component';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HeaderbackComponent, SearchComponent, FiltersComponent, ProductCardComponent, TranslateModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categoryName: string | null = null;
  categoryId: number | null = null;
  filters: any[] = [];
  selectedFilters: any = {}; // Храним выбранные фильтры
  isLoading = false;
  isSearchActive = false; // Для контроля отображения поиска
  isFiltersActive = false; // Для контроля отображения фильтров
  private languageSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private categoryAttributesService: CategoryService,
    private imageService: ImageStreamService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('category'); // Получаем ID категории из маршрута
      this.categoryId = id ? +id : null;
      if (this.categoryId !== null) {
        this.loadCategoryName(this.categoryId); // Загружаем имя категории
        this.loadFilters();
        this.restoreFiltersFromUrl(); // Восстанавливаем фильтры из URL
        this.loadProducts(this.categoryId);
      }
    });
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      this.isFiltersActive = false; // Закрываем фильтры, если открываем поиск
    }
  }

  toggleFilters() {
    this.isFiltersActive = !this.isFiltersActive;
    if (this.isFiltersActive) {
      this.isSearchActive = false; // Закрываем поиск, если открываем фильтры
    }
  }

  private loadCategoryName(categoryId: number) {
    this.categoryAttributesService.getCategories().subscribe({
      next: (categories) => {
        const category = categories.find((cat) => cat.id === categoryId);
        this.categoryName = category ? category.name : null;
      },
      error: (err) => {
        console.error('Ошибка загрузки имени категории:', err);
        this.categoryName = null;
      },
    });
  }

  private loadFilters(filterable: boolean = true) {
    if (this.categoryId === null) return;
  
    this.categoryAttributesService.getCategoryAttributes(this.categoryId, filterable).subscribe({
      next: (data) => {
        this.filters = data.map((attribute: any) => ({
          id: attribute.id, // Сохраняем ID атрибута
          name: attribute.name,
          options: attribute.options || [],
        }));
      },
      error: (err) => {
        console.error('Ошибка загрузки фильтров:', err);
      },
    });
  }

  private restoreFiltersFromUrl() {
    const queryParams = this.route.snapshot.queryParams;
    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        this.selectedFilters[key] = queryParams[key].split(',');
      }
    }
  }

  private saveFiltersToUrl() {
    const queryParams: any = {};
    for (const key in this.selectedFilters) {
      if (this.selectedFilters[key]?.length > 0) {
        queryParams[key] = this.selectedFilters[key].join(',');
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // Сохраняем существующие параметры
    });
  }

  private async loadProductsSequentially(categoryId: number, search?: string) {
    console.log('Вызван метод loadProductsSequentially с categoryId:', categoryId, 'и поисковым запросом:', search);
    this.isLoading = true;
  
    const filters = this.selectedFilters;
  
    try {
      const products = await this.categoryAttributesService.getProductsByCategory(categoryId, filters, search).toPromise();
      console.log('Полученные данные от API:', products);
  
      if (!products || products.length === 0) {
        console.warn('Список продуктов пуст или не определён');
        this.products = [];
        return;
      }
  
      // Изначально заполняем массив серыми карточками
      this.products = products.map((product) => ({
        ...product,
        image: 'assets/default-image.png', // Устанавливаем серый фон
        imageLoading: true, // Флаг для отображения состояния загрузки
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
          imageLoading: false, // Снимаем флаг загрузки
        };
        console.log(`Изображение загружено для продукта: ${product.name}`);
      }
  
      console.log('Все продукты успешно обработаны:', this.products);
    } catch (err) {
      console.error('Ошибка загрузки продуктов:', err);
      this.products = [];
    } finally {
      this.isLoading = false;
    }
  }
  
  private loadImage(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.imageService.getImageUrl(imageUrl);
  
      img.onload = () => resolve(this.imageService.getImageUrl(imageUrl));
      img.onerror = () => {
        console.error('Ошибка загрузки изображения:', imageUrl);
        resolve('assets/default-image.png'); // Возвращаем изображение по умолчанию в случае ошибки
      };
    });
  } 

  private loadProducts(categoryId: number, search?: string) {
    this.loadProductsSequentially(categoryId, search);
  }

  onFiltersChanged(filters: any) {
    console.log('Выбранные фильтры:', filters);
    this.selectedFilters = filters;
    this.saveFiltersToUrl(); // Сохраняем выбранные фильтры в URL
    // this.isFiltersActive = false; // Закрываем панель фильтров после применения

    if (this.categoryId !== null) {
      this.loadProducts(this.categoryId); // Загружаем продукты с выбранными фильтрами
    }
  }

  onSearch(query: string) {
    console.log('Поисковый запрос:', query);
    if (this.categoryId !== null) {
        this.loadProducts(this.categoryId, query);
    }
    // this.isSearchActive = false; // Уберите эту строку
}


  getRows(products: any[]): any[][] {
    const rows = [];
    for (let i = 0; i < products.length; i += 2) {
      rows.push(products.slice(i, i + 2)); // Разбиваем на строки по 2 элемента
    }
    return rows;
  }

  openProduct(productId: number) {
    if (this.categoryId !== null) {
      this.router.navigate([`/catalog/${this.categoryId}/${productId}`]); // Переход на детальную страницу товара
    }
  }
}