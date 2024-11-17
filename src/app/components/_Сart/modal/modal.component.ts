import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderItemComponent } from '../order-item/order-item.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, OrderItemComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() items: { image: string; title: string; price: string }[] = [];
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit(); // Сообщить о закрытии
  }

  contactManager() {
    console.log('Связаться с менеджером');
    this.closeModal();
  }

  navigateHome() {
    console.log('Перейти на главную');
    this.closeModal();
  }
}
