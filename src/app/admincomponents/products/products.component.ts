import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CategoriesService } from '../../services/_Admin/categories.service';
import { ImageStreamService } from '../../services/_Image/image-stream.service';
import { ProductCategory } from '../../interfaces/_Catalog/catalog.interface';
import { ProductsService } from '../../services/_Admin/products.service';
import { ProductResponse } from '../../interfaces/_Admin/product.interface';
import { AttributeResponse } from '../../interfaces/_Admin/attribute.interface';
import { SearchComponent } from '../../components/_Catalog/search/search.component';

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

  isEditingProduct = false;
  editProductForm: FormGroup;
  currentEditingProductId: number | null = null;
  editedImage: File | null = null; // Для хранения нового загруженного изображения
  editedImagePreview: string | ArrayBuffer | null = null; // Для предварительного просмотра

  editedImages: File[] = []; // Новые изображения
  editedImagesPreview: (string | ArrayBuffer | null)[] = [];


  // ID текущей выбранной категории
  categoryId: number | null = null;
  showCategorySelector = false;

  // Notification properties
  message: string = '';
  isSuccess: boolean = true;

  // Image handling
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  isViewingProduct: boolean = false;
  viewingProduct: any = null;
  viewingProductForm: FormGroup = new FormGroup({});
  currentMediaIndex: number = 0;

  mediaItems: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    public imageService: ImageStreamService
  ) {
    this.createProductForm = this.fb.group({
      category_id: ['', Validators.required],
      nameRu: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionRu: [''],
      descriptionEn: [''],
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

  onEditImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.editedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.editedImagePreview = reader.result; // Показываем предварительный просмотр
      };
      reader.readAsDataURL(this.editedImage);
    }
  }


  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Категории загружены:', this.categories);
      },
      error: (err) => {
        console.error('Ошибка при загрузке категорий:', err);
        this.showNotification('Не удалось загрузить категории', false);
      },
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
  
    // Очищаем старые контролы
    Object.keys(attributesGroup.controls).forEach(key => {
      attributesGroup.removeControl(key);
    });
  
    attributes.forEach(attr => {
      let control: FormControl;
  
      if (attr.options && attr.options.length > 0) {
        // Для атрибутов с опциями — массив выбранных значений
        control = this.fb.control([], Validators.required);
      } else {
        // Для остальных типов, как и раньше
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
            control = this.fb.control(attr.default_value ?? false);
            break;
          default:
            control = this.fb.control('');
        }
      }
  
      attributesGroup.addControl(`attribute_${attr.id}`, control);
    });
  }

  onOptionCheckboxChange(attributeId: number, optionId: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const attributesGroup = this.createProductForm.get('attributes') as FormGroup;
    const control = attributesGroup.get('attribute_' + attributeId) as FormControl;
  
    const currentValue: number[] = control.value || [];
    if (checkbox.checked) {
      // Добавляем опцию, если её ещё нет в массиве
      if (!currentValue.includes(optionId)) {
        control.setValue([...currentValue, optionId]);
      }
    } else {
      // Удаляем опцию
      control.setValue(currentValue.filter(v => v !== optionId));
    }
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
            // Теперь value — это массив чисел (ID опций)
            // Если пользователь не выбрал ни одной опции, массив будет пустым []
            attributeValues[attr.id] = value.map((v: string | number) => parseInt(v as string, 10));
          } else {
            // Для остальных атрибутов - как прежде
            attributeValues[attr.id] = value;
          }
        }
      });
      

      // Prepare translations for submission
      const translations = {
        ru: {
          name: formValue.nameRu,
          description: formValue.descriptionRu,
        },
        en: {
          name: formValue.nameEn,
          description: formValue.descriptionEn,
        }
      };

      // Формируем FormData
      const formData = new FormData();
      formData.append(
        'product_data',
        JSON.stringify({
          category_id: formValue.category_id,
          name: formValue.nameEn, // Добавляем поле name (на английском языке)
          price: formValue.price,
          attributes: attributeValues,
          translations,
        })
      );

      // Добавляем изображения в FormData
      this.selectedImages.forEach((file) => {
        formData.append('files', file, file.name);
      });

      // Отправляем данные на сервер
      this.productsService.createProduct(formData).subscribe({
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
    } else {
      this.showNotification('Please fill all required fields and upload images', false);
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
    if (this.showCategorySelector) {
      this.categoryId = null; // Сбрасываем выбранную категорию
    }
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = parseInt(target.value, 10);
    if (!isNaN(categoryId)) {
      this.categoryId = categoryId;
      this.loadProducts(categoryId); // Загружаем товары для выбранной категории
      this.showCategorySelector = false; // Скрываем выпадающий список после выбора
      console.log('Выбрана категория с ID:', this.categoryId); // Логирование
    } else {
      console.error('Некорректный ID категории:', target.value);
    }
  }


  onCategoryClick(categoryId: number): void {
    console.log('Категория выбрана (click):', categoryId);
    if (this.categoryId !== categoryId) {
      this.categoryId = categoryId;
      this.loadProducts(categoryId); // Загружаем товары для выбранной категории
    } else {
      console.log('Выбрана текущая категория, обновление товаров.');
      this.loadProducts(categoryId); // Принудительно обновляем товары
    }
  }



  viewProduct(productId: number): void {
    this.productsService.getProductDetail(productId).subscribe({
      next: (product) => {
        if (product) {
          this.viewingProduct = product;
          console.log('Медиа продукта:', this.viewingProduct.media); // Добавьте логирование
          if (this.viewingProduct.media && this.viewingProduct.media.length > 0) {
            this.mediaItems = this.viewingProduct.media.map((mediaUrl: string) =>
              this.imageService.getImageUrl(mediaUrl)
            );
          } else {
            console.error('У продукта отсутствуют медиа.');
          }
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

  onSearch(query: string) {
    console.log('Поисковый запрос:', query);
    if (this.categoryId !== null) {
      this.loadProducts(this.categoryId, query); // Передаём query для фильтрации
    }
  }

  // Проверка наличия медиа
  hasMedia(): boolean {
    return !!(this.viewingProduct?.media && this.viewingProduct.media.length > 0);
  }

  // Получение текущего медиа
  get currentMedia(): string | null {
    return this.mediaItems.length > 0 ? this.mediaItems[this.currentMediaIndex] : null;
  }


  // Проверка, является ли медиа изображением
  isImage(mediaUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
  }

  // Проверка, является ли медиа видео
  isVideo(mediaUrl: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(mediaUrl);
  }

  // Навигация по медиа
  selectMedia(index: number): void {
    this.currentMediaIndex = index;
  }

  prevMedia(): void {
    this.currentMediaIndex =
      (this.currentMediaIndex - 1 + this.viewingProduct.media.length) %
      this.viewingProduct.media.length;
  }

  nextMedia(): void {
    this.currentMediaIndex =
      (this.currentMediaIndex + 1) % this.viewingProduct.media.length;
  }

  closeViewModal(): void {
    this.isViewingProduct = false;
  }

  submitViewingProductForm(): void {
    if (this.viewingProduct && this.viewingProductForm.valid) {
      const formValue = this.viewingProductForm.value;
  
      // Подготавливаем данные продукта для отправки
      const productData = {
        id: this.viewingProduct.id,
        category_id: this.viewingProduct.category_id,
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        media: this.viewingProduct.media, // Текущие изображения
        attributes: this.viewingProduct.attributes, // Если есть атрибуты
        translations: this.viewingProduct.translations, // Если есть переводы
      };
  
      // Формируем FormData
      const formData = new FormData();
      formData.append('product_data', JSON.stringify(productData));
  
      // Добавляем новые изображения в FormData
      this.editedImages.forEach((file) => {
        formData.append('files', file, file.name);
      });
  
      // Отправляем данные на сервер
      this.productsService.updateProduct(this.viewingProduct.id, formData).subscribe({
        next: (response) => {
          console.log('Продукт успешно обновлен:', response);
          this.showNotification('Продукт успешно обновлен');
          this.isViewingProduct = false; // Закрываем модальное окно
          if (this.categoryId !== null) {
            this.loadProducts(this.categoryId); // Обновляем список продуктов в категории
          }
        },
        error: (err) => {
          console.error('Ошибка обновления продукта:', err);
          this.showNotification('Ошибка обновления продукта', false);
        },
      });
    } else {
      console.error('Форма недействительна.');
      this.showNotification('Пожалуйста, заполните все обязательные поля', false);
    }
  }


  onEditImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editedImages = Array.from(input.files);
      this.editedImagesPreview = [];
  
      // Генерация превью для новых изображений
      this.editedImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.editedImagesPreview.push(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }





  deleteProduct(productId: number): void {
    if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          this.showNotification('Продукт успешно удалён', true);
          // Удаляем продукт из локального списка
          this.products = this.products.filter(product => product.id !== productId);
        },
        error: (err) => {
          console.error('Ошибка при удалении продукта:', err);
          this.showNotification('Ошибка при удалении продукта', false);
        },
      });
    }
  }


  updateAttributeValue(attributeId: number, event: Event): void {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    const value = input.value; // Получаем значение из input или select
    if (this.viewingProduct) {
      const attribute = this.viewingProduct.attribute_values.find(
        (attr: { attribute: { id: number } }) => attr.attribute.id === attributeId
      );
      if (attribute) {
        attribute.value = value;
      }
    }
  }



}
