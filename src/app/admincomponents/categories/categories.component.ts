import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
      const { name, description } = this.createCategoryForm.value;
      const image = this.selectedImage;

      this.categoriesService.createCategory({ name, description, image }).subscribe({
        next: () => {
          this.showNotification('Категория успешно создана');
          this.createCategoryForm.reset();
          this.selectedImage = null;
          this.imagePreview = null;
          this.loadCategories();
        },
        error: (error) => {
          this.showNotification(
            error.error?.detail || 'Произошла ошибка при создании категории',
            false
          );
        },
      });
    } else {
      this.showNotification('Пожалуйста, заполните все поля и выберите изображение', false);
    }
  }

  startEditing(category: ProductCategory) {
    this.editingCategoryId = category.id;
    this.editedCategory = {
      name: category.name || '',
      description: category.description || '',
      image: null,
    };
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

  onEditImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.editImagePreview = reader.result;
      };
      reader.readAsDataURL(selectedFile);

      this.editedCategory.image = selectedFile;
    }
  }

  applyCategoryChanges() {
    if (this.editingCategoryId !== null) {
      const updatedCategoryData = {
        name: this.editedCategory.name,
        description: this.editedCategory.description,
        image: this.editedCategory.image,
      };

      this.categoriesService.updateCategory(this.editingCategoryId, updatedCategoryData).subscribe({
        next: () => {
          this.assignAttributesToCategory(this.editingCategoryId!);
        },
        error: (error) => {
          this.showNotification(
            error.error?.detail || 'Произошла ошибка при обновлении категории',
            false
          );
        },
      });
    }
  }

  assignAttributesToCategory(categoryId: number) {
    this.categoriesService.assignAttributesToCategory(categoryId, this.selectedAttributes).subscribe({
      next: () => {
        this.showNotification('Категория успешно обновлена');
        this.loadCategories();
        this.cancelEditing();
      },
      error: (error: { error: { detail: any } }) => {
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
