import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.css'
})
export class OrderItemComponent {
  @Input() imageSrc: string = ''; // Добавьте типы
  @Input() title: string = '';
  @Input() price: string = '';

  quantity: number = 1; // Начальное количество

}
