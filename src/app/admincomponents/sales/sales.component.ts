import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DiscountService } from '../../services/_Admin/discount.service';
import { ProductsService } from '../../services/_Admin/products.service';
import { CategoriesService } from '../../services/_Admin/categories.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  discounts: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  discountForm: FormGroup;
  isEditing = false;
  editingDiscountId: number | null = null;
  categoryId: number | null = null;

  message: string = '';
  isSuccess: boolean = true;

  constructor(
    private fb: FormBuilder,
    private discountsService: DiscountService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {
    this.discountForm = this.fb.group({
      name: ['', Validators.required],
      discount_percentage: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      start_date: [''],
      end_date: [''],
      product_id: [''],
      category_id: [''],
      min_quantity: [1, [Validators.required, Validators.min(1)]],
      max_quantity: [''],
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
    this.loadCategories();
  }

  formatDisplayDate(dateString: string): string {
    if (!dateString) return 'Не указана';

    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  loadDiscounts() {
    this.discountsService.getDiscounts().subscribe({
      next: (data: any[]) => {
        this.discounts = data;
      },
      error: (err: any) => {
        console.error('Failed to load discounts:', err);
        this.showNotification('Failed to load discounts', false);
      },
    });
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data: any[]) => {
        this.categories = data;
      },
      error: (err: any) => {
        console.error('Failed to load categories:', err);
      },
    });
  }

  loadProducts(categoryId: number) {
    this.productsService.getProducts({ category_id: categoryId }).subscribe({
      next: (data: any[]) => {
        this.products = data;
      },
      error: (err: any) => {
        console.error('Failed to load products:', err);
      },
    });
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const categoryId = parseInt(target.value, 10);
    if (!isNaN(categoryId)) {
      this.categoryId = categoryId;
      this.discountForm.patchValue({ category_id: categoryId });
      this.loadProducts(categoryId);
    }
  }

  submitDiscountForm() {
    if (this.discountForm.valid) {
      const formValue = this.discountForm.value;

      const discountData = {
        ...formValue,
        start_date: formValue.start_date
          ? this.formatDateToISOWithMicroseconds(formValue.start_date)
          : null,
        end_date: formValue.end_date
          ? this.formatDateToISOWithMicroseconds(formValue.end_date)
          : null,
        product_id: formValue.product_id
          ? parseInt(formValue.product_id, 10)
          : null,
        category_id: formValue.category_id
          ? parseInt(formValue.category_id, 10)
          : null,
      };

      console.log('Отправляемые данные:', discountData);

      if (this.isEditing && this.editingDiscountId) {
        // Обновление скидки
        this.discountsService
          .updateDiscount(this.editingDiscountId, discountData)
          .subscribe({
            next: () => {
              this.showNotification('Скидка успешно обновлена');
              this.resetForm();
              this.loadDiscounts();
            },
            error: (err: any) => {
              console.error('Ошибка при обновлении скидки:', err);
              this.showNotification('Ошибка при обновлении скидки', false);
            },
          });
      } else {
        // Создание новой скидки
        this.discountsService.createDiscount(discountData).subscribe({
          next: () => {
            this.showNotification('Скидка успешно создана');
            this.resetForm();
            this.loadDiscounts();
          },
          error: (err: any) => {
            console.error('Ошибка при создании скидки:', err);
            this.showNotification('Ошибка при создании скидки', false);
          },
        });
      }
    }
  }

  formatDateToISOWithMicroseconds(dateString: string): string {
    const date = new Date(dateString);
    const isoString = date.toISOString(); // Формат ISO 8601: '2024-12-05T07:57:48.449Z'
    return isoString.replace('T', ' ').replace('Z', ''); // Преобразуем в нужный формат
  }

  editDiscount(discount: any) {
    this.isEditing = true;
    this.editingDiscountId = discount.id;
    this.discountForm.patchValue(discount);
    if (discount.category_id) {
      this.loadProducts(discount.category_id);
    }
  }

  deleteDiscount(discountId: number) {
    if (confirm('Are you sure you want to delete this discount?')) {
      this.discountsService.deleteDiscount(discountId).subscribe({
        next: () => {
          this.showNotification('Discount deleted successfully');
          this.loadDiscounts();
        },
        error: (err: any) => {
          console.error('Failed to delete discount:', err);
          this.showNotification('Failed to delete discount', false);
        },
      });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingDiscountId = null;
    this.discountForm.reset();
    this.discountForm.patchValue({ discount_percentage: 0, min_quantity: 1 });
  }

  showNotification(message: string, isSuccess: boolean = true) {
    this.message = message;
    this.isSuccess = isSuccess;
    setTimeout(() => (this.message = ''), 5000);
  }

  closeNotification() {
    this.message = '';
  }
}
