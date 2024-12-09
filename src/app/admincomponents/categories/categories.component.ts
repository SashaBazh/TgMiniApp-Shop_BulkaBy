import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CategoriesService } from '../../services/_Admin/categories.service';
import { ImageStreamService } from '../../services/_Image/image-stream.service';
import { ProductCategory } from '../../interfaces/_Catalog/catalog.interface';
import { Attribute, AttributeResponse } from '../../interfaces/_Admin/attribute.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  createCategoryForm: FormGroup;
  categories: ProductCategory[] = [];
  originalImage: string | null = null;

  // Новые свойства для работы с атрибутами
  availableAttributes: AttributeResponse[] = [];
  selectedAttributes: number[] = []; // Массив ID выбранных атрибутов

  // Notification properties
  message: string = '';
  isSuccess: boolean = true;

  // Image handling for create form
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Edit mode properties
  editingCategoryId: number | null = null;
  editedCategory: {
    name: string;
    description: string;
    image?: File | null;
  } = {
      name: '',
      description: '',
      image: null,
    };
  editImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef,
    public imageService: ImageStreamService,
  ) {
    // Инициализация формы создания категории
    this.createCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      nameEn: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllAttributes(); // Загрузка всех атрибутов при инициализации
  }

  loadAvailableAttributes(categoryId: number): void {
    if (!categoryId) {
      console.error('ID категории не указан. Невозможно загрузить атрибуты.');
      this.showNotification('ID категории обязателен для загрузки атрибутов.', false);
      return;
    }

    this.categoriesService.getCategoryAttributes(categoryId).subscribe({
      next: (attributes) => {
        console.log('Attributes received from API:', attributes); // Логирование данных
        this.availableAttributes = attributes; // Прямое присвоение данных
        this.cdr.detectChanges(); // Принудительное обновление интерфейса
      },
      error: (err: any) => {
        this.showNotification('Не удалось загрузить атрибуты.', false);
        console.error('Ошибка при загрузке атрибутов:', err); // Логирование ошибки
      },
    });
  }

  // Notification method
  showNotification(msg: string, success: boolean = true) {
    this.message = msg;
    this.isSuccess = success;

    // Auto-close notification after 5 seconds
    setTimeout(() => this.closeNotification(), 5000);
  }

  closeNotification() {
    this.message = '';
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.showNotification('Не удалось загрузить категории', false);
        console.error(err);
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  submitCategoryForm() {
    if (this.createCategoryForm.valid && this.selectedImage) {
      const { name, nameEn, description } = this.createCategoryForm.value;

      // Формируем объект с фиксированными языками
      const categoryData = {
        name,
        description,
        translations: {
          ru: { name },        // Название на русском
          en: { name: nameEn } // Название на английском
        },
        image: this.selectedImage,
      };

      // Отправляем данные на сервер
      this.categoriesService.createCategory(categoryData).subscribe({
        next: () => {
          this.showNotification('Категория успешно создана');
          this.createCategoryForm.reset();
          this.selectedImage = null;
          this.imagePreview = null;
        },
        error: (error) => {
          this.showNotification('Ошибка при создании категории', false);
        },
      });
    } else {
      this.showNotification('Пожалуйста, заполните все обязательные поля', false);
    }
  }



  startEditing(category: ProductCategory) {
    this.editingCategoryId = category.id;
    this.editedCategory = {
      name: category.name || '',
      description: category.description || '',
      image: null,
    };
  
    // Сохраняем исходное изображение
    this.originalImage = category.image ? category.image : null;
  
    this.editImagePreview = category.image
      ? this.imageService.getImageUrl(category.image)
      : 'assets/default-image.png';
  
    // Загрузка атрибутов, связанных с категорией
    this.categoriesService.getCategoryAttributes(category.id).subscribe({
      next: (attributes) => {
        this.selectedAttributes = attributes.map(attr => attr.id);
        console.log('Attributes assigned to category:', this.selectedAttributes);
      },
      error: (err: any) => {
        this.showNotification('Не удалось загрузить атрибуты категории', false);
        console.error(err);
      },
    });
  }  


  cancelEditing() {
    this.editingCategoryId = null;
    this.editedCategory = { name: '', description: '', image: null };
    this.editImagePreview = null;
  }

  applyCategoryChanges() {
    if (!this.editedCategory || !this.editingCategoryId) {
      return;
    }
  
    const formData = new FormData();
  
    // Добавляем основные данные категории
    formData.append('category_data', JSON.stringify({
      id: this.editingCategoryId,
      name: this.editedCategory.name,
      description: this.editedCategory.description,
      translations: {
        ru: { name: this.editedCategory.name },
      },
    }));
  
    if (this.selectedImage) {
      // Если выбрано новое изображение, добавляем его
      formData.append('image', this.selectedImage, this.selectedImage.name);
    } else if (this.originalImage) {
      // Если изображение не выбрано, загружаем файл из URL текущего изображения
      this.fetchImageFile(this.originalImage).then((file) => {
        formData.append('image', file, 'current-image.jpg');
  
        // Отправляем данные
        this.sendCategoryUpdate(formData);
      }).catch((error) => {
        console.error('Ошибка при загрузке файла из URL:', error);
        this.showNotification('Ошибка при обновлении категории.', false);
      });
      return;
    }
  
    // Если новое изображение не выбрано и текущего URL нет, отправляем сразу
    this.sendCategoryUpdate(formData);
  }  

  private sendCategoryUpdate(formData: FormData) {
    this.categoriesService.updateCategory(formData).subscribe({
      next: () => {
        this.showNotification('Категория успешно обновлена');
        this.loadCategories();
        this.cancelEditing();
      },
      error: (err) => {
        console.error('Ошибка при обновлении категории:', err);
        this.showNotification('Ошибка при обновлении категории.', false);
      },
    });
  }
  
  

  private async fetchImageFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split('/').pop() || 'image.jpg'; // Извлекаем имя файла из URL
    return new File([blob], fileName, { type: blob.type });
  }
  
  
  
  







  onEditImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file; // Сохраняем файл изображения

      // Генерируем превью изображения
      const reader = new FileReader();
      reader.onload = () => {
        this.editImagePreview = reader.result as string; // Показываем превью
      };
      reader.readAsDataURL(file);
    }
  }




  assignAttributesToCategory(categoryId: number) {
    this.categoriesService.assignAttributesToCategory(categoryId, this.selectedAttributes).subscribe({
      next: () => {
        this.showNotification('Атрибуты успешно назначены категории');
        this.loadCategories(); // Перезагружаем список категорий
        this.cancelEditing();
      },
      error: (error) => {
        this.showNotification(
          error.error?.detail || 'Произошла ошибка при назначении атрибутов категории',
          false
        );
      },
    });
  }



  deleteCategory(categoryId: number) {
    const confirmDelete = confirm('Вы уверены, что хотите удалить эту категорию?');

    if (confirmDelete) {
      this.categoriesService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.showNotification('Категория успешно удалена');
          this.loadCategories();
        },
        error: (error) => {
          this.showNotification(
            error.error?.detail || 'Произошла ошибка при удалении категории',
            false
          );
        },
      });
    }
  }

  onAttributeCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const attributeId = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.selectedAttributes.push(attributeId);
    } else {
      this.selectedAttributes = this.selectedAttributes.filter(id => id !== attributeId);
    }
  }


  // Загрузка всех доступных атрибутов
  loadAllAttributes(): void {
    this.categoriesService.getAllAttributes().subscribe({
      next: (attributes) => {
        this.availableAttributes = attributes;
        console.log('All available attributes:', this.availableAttributes);
      },
      error: (err: any) => {
        this.showNotification('Не удалось загрузить атрибуты.', false);
        console.error('Ошибка при загрузке всех атрибутов:', err);
      },
    });
  }

}
