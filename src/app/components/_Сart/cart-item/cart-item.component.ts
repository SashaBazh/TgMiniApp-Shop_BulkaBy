import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'] // Исправлено на styleUrls
})
export class CartItemComponent {
  @Input() imageSrc!: string; // Ссылка на изображение
  @Input() title!: string;    // Название товара
  @Input() price!: string;    // Цена

  quantity: number = 1; // Начальное количество

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
