import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  navItems = [
    { 
      path: '/home',
      label: 'Главная',
      icon: '../../../../assets/icons/home.svg'
    },
    {
      path: '/catalog',
      label: 'Каталог',
      icon: '../../../../assets/icons/catalog.svg'
    },
    {
      path: '/cart',
      label: 'Корзина',
      icon: '../../../../assets/icons/cart.svg'
    },
    {
      path: '/profile',
      label: 'Профиль',
      icon: '../../../../assets/icons/profile.svg'
    }
  ];
}