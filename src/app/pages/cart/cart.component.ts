import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { ImageSliderComponent } from '../../components/_Home/image-slider/image-slider.component';
import { CartItemComponent } from '../../components/_Сart/cart-item/cart-item.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../components/_Сart/modal/modal.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/_Cart/cart.service';
import { CartResponse } from '../../interfaces/_Cart/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavigationComponent, HeaderComponent, ImageSliderComponent, CartItemComponent, RouterModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;
  imageService: any;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data) => {
        // Обработка media для каждого товара
        this.cart = {
          ...data,
          items: data.items.map((item) => ({
            ...item,
            image: item.media && item.media.length > 0
              ? this.imageService.getImageUrl(item.media[0]) // Первая картинка из media
              : 'assets/default-image.png', // Изображение по умолчанию
          })),
        };
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
  
}