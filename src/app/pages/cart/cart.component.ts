import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { ImageSliderComponent } from '../../components/_Home/image-slider/image-slider.component';
import { CartItemComponent } from '../../components/_Сart/cart-item/cart-item.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/_Cart/cart.service';
import { CartResponse } from '../../interfaces/_Cart/cart.interface';
import { ImageStreamService } from '../../services/_Image/image-stream.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavigationComponent, HeaderComponent, ImageSliderComponent, CartItemComponent, RouterModule, CommonModule, TranslateModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;
  maxPoints: number = 300; // Максимум баллов (заглушка)
  usedPoints: number = 0; // Используемые баллы
  initialTotalPrice: number = 0; // Исходная общая сумма

  constructor(private cartService: CartService, private imageService: ImageStreamService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = {
          ...data,
          items: data.items.map((item) => ({
            ...item,
            image: item.product.media && item.product.media.length > 0
              ? this.imageService.getImageUrl(item.product.media[0])
              : 'assets/default-image.png',
            discounted_price: item.discounted_price ?? null, // Гарантируем, что undefined заменяется на null
          })),
        };
        this.initialTotalPrice = this.cart?.total_price || 0;
      },
      error: (err) => {
        console.error('Ошибка при загрузке корзины:', err);
      },
    });
  }  
  
  
  

  onItemRemoved(productId: number) {
    console.log(`Товар с ID ${productId} удален`);
    this.loadCart(); // Перезагружаем данные корзины
  }

  // onQuantityChanged(event: { productId: number; quantity: number }) {
  //   console.log(`Количество товара с ID ${event.productId} изменено на ${event.quantity}`);
  //   this.cartService.getCart().subscribe({
  //     next: (data) => {
  //       this.cart = data; // Обновляем корзину с сервера
  //     },
  //     error: (err) => {
  //       console.error('Ошибка при обновлении корзины:', err);
  //     },
  //   });
  // }  


  onQuantityChanged(event: { productId: number; quantity: number }) {
    if (this.cart) {
      const item = this.cart.items.find(i => i.product_id === event.productId);
      if (item) {
        item.quantity = event.quantity; // Обновляем количество локально
        this.updateTotalPrice(); // Пересчитываем итоговую цену
        this.loadCart();
      }
    }
  }
  
  
  updateTotalPrice() {
    if (this.cart) {
      this.cart.total_price = this.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  }

  redirectToTelegram(): void {
    window.location.href = 'https://t.me/GEORG653';
  }

  onPointsChanged(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const points = parseInt(inputValue, 10) || 0;
    this.usedPoints = points;
    if (this.cart) {
      this.cart.total_price = this.initialTotalPrice - points;
    }
  }

  validatePointsInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
  
    // Убираем все символы, кроме цифр
    value = value.replace(/[^0-9]/g, '');
  
    // Преобразуем в число и проверяем диапазон
    const numericValue = Math.min(Math.max(Number(value), 0), this.maxPoints);
  
    // Обновляем значение инпута и переменной
    inputElement.value = numericValue.toString();
    this.usedPoints = numericValue;
  }
}