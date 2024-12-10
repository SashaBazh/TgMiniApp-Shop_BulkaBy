import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OrderItemComponent } from '../order-item/order-item.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, OrderItemComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() items: { image: string; title: string; price: string }[] = [];
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  closeModal() {
    this.close.emit();
  }

  contactManager() {
    this.redirectToTelegram();
    this.closeModal();
  }

  navigateHome() {
    this.router.navigate(['/home']).then(() => {
      this.closeModal();
    });
  }

  redirectToTelegram(): void {
    window.location.href = 'https://t.me/GEORG653';
  }
}
