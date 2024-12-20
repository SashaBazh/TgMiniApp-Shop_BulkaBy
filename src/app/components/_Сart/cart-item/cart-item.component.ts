import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../services/_Cart/cart.service';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent {
  @Input() imageSrc!: string;
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() quantity: number = 1;
  @Input() productId: number = 0;
  @Input() discountedPrice: number | null = null;

  @Output() itemRemoved = new EventEmitter<number>();
  @Output() quantityChanged = new EventEmitter<{ productId: number; quantity: number }>();

  imageLoading: boolean = true; // Переменная для отслеживания состояния загрузки изображения

  constructor(
    private cartService: CartService,
    public imageService: ImageStreamService
  ) { }

  increaseQuantity() {
    this.quantity++;
    this.updateQuantity();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateQuantity();
    }
  }

  updateQuantity() {
    this.cartService.updateItemQuantity(this.productId, this.quantity).subscribe({
      next: () => {
        this.quantityChanged.emit({ productId: this.productId, quantity: this.quantity });
      },
      error: (err) => {
        console.error('Ошибка при обновлении количества:', err);
      },
    });
  }

  removeItem() {
    this.cartService.removeItemFromCart(this.productId).subscribe({
      next: () => {
        console.log('Товар удален из корзины');
        this.itemRemoved.emit(this.productId); 
      },
      error: (err) => {
        console.error('Ошибка при удалении товара из корзины:', err);
      },
    });
  }

  setDefaultImage(event: Event): void {
    (event.target as HTMLImageElement).src = '../../../../assets/products/2.png';
    this.imageLoading = false; // Останавливаем состояние загрузки при ошибке
  }

  onImageLoad() {
    this.imageLoading = false; // Останавливаем состояние загрузки при успешной загрузке изображения
  }
}
