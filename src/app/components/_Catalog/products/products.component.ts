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
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CapitalizePipe, HeaderbackComponent, SearchComponent, FiltersComponent, ProductCardComponent, TranslateModule],
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

  constructor(
    private route: ActivatedRoute,
    private categoryAttributesService: CategoryService,
    private imageService: ImageStreamService,
    private router: Router // Инжектируем Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('category'); // Получаем ID категории из маршрута
      this.categoryId = id ? +id : null;
      if (this.categoryId !== null) {
        this.loadCategoryName(this.categoryId); // Загружаем имя категории
        this.loadFilters();
        this.loadProducts(this.categoryId);
      }
    });
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

  private loadFilters() {
    if (this.categoryId === null) return;

    this.categoryAttributesService.getCategoryAttributes(this.categoryId).subscribe({
      next: (data) => {
        this.filters = data.map((attribute: any) => ({
          id: attribute.id,  // Сохраняем ID атрибута
          name: attribute.name,
          options: attribute.options || [],
        }));
      },
      error: (err) => {
        console.error('Ошибка загрузки фильтров:', err);
      },
    });
  }


  private loadProducts(categoryId: number, search?: string) {
    console.log('Вызван метод loadProducts с categoryId:', categoryId, 'и поисковым запросом:', search);
    this.isLoading = true;

    const filters = this.selectedFilters; // Используем выбранные фильтры

    this.categoryAttributesService.getProductsByCategory(categoryId, filters, search).subscribe({
      next: (data) => {
        console.log('Полученные данные от API:', data);
        this.products = data.map((product) => ({
          ...product,
          image: product.media && product.media.length > 0
            ? this.imageService.getImageUrl(product.media[0]) // Используем только первый путь из media
            : 'assets/default-image.png', // Устанавливаем изображение по умолчанию
        }));
        console.log('Обработанные данные продуктов:', this.products);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки продуктов:', err);
        this.products = [];
        this.isLoading = false;
      },
    });
  }




  onFiltersChanged(filters: any) {
    console.log('Выбранные фильтры:', filters);
    this.selectedFilters = filters;

    if (this.categoryId !== null) {
      this.loadProducts(this.categoryId); // Загружаем продукты с выбранными фильтрами
    }
  }



  onSearch(query: string) {
    console.log('Поисковый запрос:', query);
    if (this.categoryId !== null) {
      this.loadProducts(this.categoryId, query); // Передаём query для фильтрации
    }
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
