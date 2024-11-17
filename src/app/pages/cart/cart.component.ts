import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { ImageSliderComponent } from '../../components/_Home/image-slider/image-slider.component';
import { CartItemComponent } from '../../components/_Сart/cart-item/cart-item.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../components/_Сart/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavigationComponent, HeaderComponent, ImageSliderComponent, CartItemComponent, RouterModule, ModalComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  showModal = false;

  items = [
    {
      image: '../../../assets/products/1.png',
      title: 'Кольцо обручальное из розового золота 106010',
      price: '1242 р.',
    },
    {
      image: '../../../assets/products/2.png',
      title: 'Кольцо обручальное из розового золота 106010',
      price: '1242 р.',
    },
  ];

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
