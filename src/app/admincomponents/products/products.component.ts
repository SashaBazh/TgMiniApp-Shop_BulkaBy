import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CategoriesService } from '../../services/_Admin/categories.service';
import { ImageStreamService } from '../../services/_Image/image-stream.service';
import { ProductCategory } from '../../interfaces/_Catalog/catalog.interface';
import { ProductsService } from '../../services/_Admin/products.service';
import { ProductResponse } from '../../interfaces/_Admin/product.interface';
import { AttributeResponse } from '../../interfaces/_Admin/attribute.interface';
import { ProductDetailResponse } from '../../interfaces/_General/product-detail-response.interface';
import { SearchComponent } from '../../components/_Catalog/search/search.component';

interface ViewingProduct extends ProductDetailResponse { }

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SearchComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  createProductForm: FormGroup;
  categories: ProductCategory[] = [];
  products: ProductResponse[] = [];
  categoryAttributes: AttributeResponse[] = [];
  isLoading = false;
  selectedFilters: any = {}; // Храним выбранные фильтры
  selectedImages: File[] = []; // Обновлено: массив файлов
  imagePreviews: (string | ArrayBuffer | null)[] = [];

  viewingProductForm: FormGroup;
  isEditingProduct = false;
  isViewingProduct = false;
  editProductForm: FormGroup;
  currentEditingProductId: number | null = null;
  viewingProduct: ViewingProduct | null = null;


  // ID текущей выбранной категории
  categoryId: number | null = null;
  showCategorySelector = false;

  // Notification properties
  message: string = '';
  isSuccess: boolean = true;

  // Image handling
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    public imageService: ImageStreamService
  ) {
    this.createProductForm = this.fb.group({
      category_id: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      attributes: this.fb.group({}) // Dynamic attributes group
    });

    // Listen for category changes to fetch attributes and products
    this.createProductForm.get('category_id')?.valueChanges.subscribe(categoryId => {
      console.log('Category ID changed:', categoryId); // Логирование изменения категории
      if (categoryId) {
        this.categoryId = categoryId; // Устанавливаем текущую категорию
        this.fetchCategoryAttributes(categoryId);
        this.loadProducts(categoryId); // Загружаем товары для выбранной категории
      } else {
        this.categoryId = null;
        this.clearCategoryAttributes();
        this.products = []; // Очищаем список товаров
      }
    });

    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
    });

    this.viewingProductForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Загружаем категории
    if (this.categoryId !== null) {
      this.loadProducts(this.categoryId); // Загружаем товары, если категория выбрана
    }
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err: any) => {
        this.showNotification('Не удалось загрузить категории', false);
        console.error(err);
      }
    });
  }

  loadProducts(categoryId: number, search?: string): void {
    if (!categoryId) {
      console.error('Category ID is required to load products.');
      return;
    }
  
    console.log('Вызван метод loadProducts с categoryId:', categoryId, 'и поисковым запросом:', search);
    this.isLoading = true;
  
    const filters = this.selectedFilters || {};
  
    this.productsService.getProducts({ category_id: categoryId, filters, search }).subscribe({
      next: (data) => {
        console.log('Полученные данные от API:', data);
    
        this.products = data.map((product: ProductResponse) => {
          const firstImage = product.media && product.media.length > 0 
            ? this.imageService.getImageUrl(product.media[0]) // Преобразуем первый путь из media
            : '../../../assets/products/5.png'; // Изображение по умолчанию
    
          return {
            ...product,
            mediaUrl: firstImage // Добавляем поле mediaUrl для шаблона
          };
        });
    
        console.log('Обработанные данные продуктов:', this.products);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки продуктов:', err);
        this.showNotification('Ошибка загрузки продуктов', false);
        this.products = [];
        this.isLoading = false;
      },
    });
    
    
  }  
  


  fetchCategoryAttributes(categoryId: number) {
    console.log('Fetching attributes for category ID:', categoryId); // Логирование вызова метода
    this.productsService.getCategoryAttributes(categoryId).subscribe({
      next: (attributes) => {
        console.log('Attributes received from API:', attributes); // Логирование ответа
        this.categoryAttributes = attributes;
        this.updateAttributesForm(attributes);
      },
      error: (err: any) => {
        this.showNotification('Failed to load category attributes', false);
        console.error('Error fetching attributes:', err); // Логирование ошибки
      }
    });
  }

  updateAttributesForm(attributes: AttributeResponse[]) {
    const attributesGroup = this.createProductForm.get('attributes') as FormGroup;
    Object.keys(attributesGroup.controls).forEach(key => {
      attributesGroup.removeControl(key);
    });

    attributes.forEach(attr => {
      let control: FormControl;

      switch (attr.data_type) {
        case 'string':
          control = this.fb.control('', Validators.required);
          break;
        case 'integer':
          control = this.fb.control('', [Validators.required, Validators.pattern(/^\d+$/)]);
          break;
        case 'float':
          control = this.fb.control('', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]);
          break;
        case 'boolean':
          control = this.fb.control(attr.default_value ?? false); // Ensure `false` is assigned if undefined
          break;
        case 'enum':
          control = this.fb.control('', Validators.required);
          break;
        default:
          control = this.fb.control('');
      }

      attributesGroup.addControl(`attribute_${attr.id}`, control);
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImages = Array.from(input.files);
      this.imagePreviews = [];

      this.selectedImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }


  submitProductForm() {
    if (this.createProductForm.valid && this.selectedImages.length > 0) {
      const formValue = this.createProductForm.value;

      // Prepare attributes for submission
      const attributeValues: Record<number, any> = {};
      const attributesGroup = this.createProductForm.get('attributes') as FormGroup;

      this.categoryAttributes.forEach((attr) => {
        const controlName = `attribute_${attr.id}`;
        const value = attributesGroup.get(controlName)?.value;

        if (value !== null && value !== undefined) {
          if (attr.options && attr.options.length > 0) {
            // Если это атрибут с опциями, используем выбранный ID опции
            attributeValues[attr.id] = parseInt(value, 10);
          } else {
            // Для остальных типов сохраняем значение как есть
            attributeValues[attr.id] = value;
          }
        }
      });

      // Отправляем данные на сервер
      this.productsService
        .createProduct({
          ...formValue,
          images: this.selectedImages, // Обновлено: передаем массив файлов
          attributes: attributeValues,
        })
        .subscribe({
          next: () => {
            this.showNotification('Product successfully created');
            this.createProductForm.reset();
            this.selectedImages = [];
            this.imagePreviews = [];
            if (this.categoryId !== null) {
              this.loadProducts(this.categoryId);
            } else {
              console.error('Category ID is null, cannot load products.');
            }
          },
          error: (error) => {
            this.showNotification(
              error.error?.detail || 'Error creating product',
              false
            );
          },
        });
    }
  }

  clearCategoryAttributes() {
    const attributesGroup = this.createProductForm.get('attributes') as FormGroup;
    Object.keys(attributesGroup.controls).forEach(key => {
      attributesGroup.removeControl(key);
    });
  }

  // Helper method for checking attribute validity
  isAttributeInvalid(attribute: AttributeResponse): boolean {
    const control = this.createProductForm.get('attributes')?.get(`attribute_${attribute.id}`);
    // Проверяем, существует ли control и приводим его тип
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // Notification methods
  showNotification(msg: string, success: boolean = true) {
    this.message = msg;
    this.isSuccess = success;
    setTimeout(() => this.closeNotification(), 5000);
  }

  closeNotification() {
    this.message = '';
  }

  toggleCategorySelection(): void {
    this.showCategorySelector = !this.showCategorySelector;
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = parseInt(target.value, 10);
    if (!isNaN(categoryId)) {
      this.categoryId = categoryId;
      this.loadProducts(categoryId); // Загружаем товары для выбранной категории
      this.showCategorySelector = false; // Скрываем селектор после выбора
    }
  }

  viewProduct(productId: number): void {
    this.productsService.getProductDetail(productId).subscribe({
      next: (product) => {
        if (product) {
          this.viewingProduct = product;
          this.viewingProductForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
          });
          this.isViewingProduct = true;
        } else {
          console.error('Продукт не найден.');
          this.showNotification('Ошибка: продукт не найден.', false);
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки данных продукта:', err);
        this.showNotification('Ошибка загрузки данных продукта.', false);
      },
    });
  }

  updateAttributeValue(attributeId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value; // Получаем значение из input
    if (this.viewingProduct) {
      const attribute = this.viewingProduct.attribute_values.find((attr) => attr.attribute.id === attributeId);
      if (attribute) {
        attribute.value = value;
      }
    }
  }


  submitViewingProductForm(): void {
    if (this.viewingProductForm.valid && this.viewingProduct) {
      const updatedData = {
        ...this.viewingProductForm.value,
        attributes: this.viewingProduct.attribute_values.map((attr) => ({
          id: attr.attribute.id,
          value: attr.value,
        })),
      };

      this.productsService.updateProduct(this.viewingProduct.id, updatedData).subscribe({
        next: () => {
          this.showNotification('Продукт успешно обновлен.');
          this.closeViewModal();
          if (this.categoryId) {
            this.loadProducts(this.categoryId);
          }
        },
        error: (err) => {
          console.error('Ошибка обновления продукта:', err);
          this.showNotification('Ошибка обновления продукта.', false);
        },
      });
    }
  }

  closeViewModal(): void {
    this.isViewingProduct = false;
    this.viewingProduct = null;
    this.viewingProductForm.reset();
  }


  onSearch(query: string) {
    console.log('Поисковый запрос:', query);
    if (this.categoryId !== null) {
      this.loadProducts(this.categoryId, query); // Передаём query для фильтрации
    }
  }



}
