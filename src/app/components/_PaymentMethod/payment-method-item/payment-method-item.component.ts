import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-method-item',
  standalone: true,
  imports: [],
  templateUrl: './payment-method-item.component.html',
  styleUrl: './payment-method-item.component.css'
})
export class PaymentMethodItemComponent {
  @Input() imageSrc!: string; // Ссылка на изображение
  @Input() title!: string; // Название способа оплаты

  selectPaymentMethod() {
    // Здесь можно добавить логику выбора метода оплаты
    console.log(`Selected payment method: ${this.title}`);
  }
}