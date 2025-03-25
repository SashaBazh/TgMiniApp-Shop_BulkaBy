import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-method-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method-item.component.html',
  styleUrls: ['./payment-method-item.component.css']
})
export class PaymentMethodItemComponent {
  @Input() imageSrc!: string; // Ссылка на изображение
  @Input() title!: string; // Название способа оплаты

  constructor(private router: Router) {}

  selectPaymentMethod() {
    // Логика выбора метода оплаты
    console.log(`Selected payment method: ${this.title}`);

    // Навигация на страницу оплаты с передачей выбранного метода оплаты
    this.router.navigate(['/payment'], { queryParams: { method: this.title } });
  }
}
