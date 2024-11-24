import { Component, OnInit } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentMethodItemComponent } from '../../components/_PaymentMethod/payment-method-item/payment-method-item.component';
import { PaymentService } from '../../services/_Payment/payment.service';
import { PaymentInitializeResponse } from '../../interfaces/_Payment/paymen.interface';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [HeaderbackComponent, CommonModule, RouterModule, PaymentMethodItemComponent],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  orderId: number | null = null;
  showNetworkDropdown = false; // Показывать ли выпадающий список
  selectedPaymentMethod: string | null = null; // Выбранный метод оплаты
  paymentUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    // Извлекаем `orderId` из параметров маршрута
    this.route.queryParamMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (!this.orderId) {
        console.error('Идентификатор заказа не найден.');
      } else {
        console.log('Текущий orderId:', this.orderId);
      }
    });
  }

  toggleNetworkDropdown(paymentMethod: string): void {
    this.showNetworkDropdown = this.selectedPaymentMethod !== paymentMethod || !this.showNetworkDropdown;
    this.selectedPaymentMethod = paymentMethod;
  }

  handleNetworkClick(network: string): void {
    console.log(`Нажата кнопка: ${network}`);
    this.selectNetwork(network);
  }

  selectNetwork(network: string): void {
    if (!this.orderId) {
      console.error('Ошибка: orderId не может быть null.');
      return;
    }

    const paymentRequest = {
      order_id: this.orderId, // Здесь гарантированно number
      currency: network,
      email: 'nelox001@gmail.com'
    };

    console.log('Отправка запроса:', paymentRequest);

    this.paymentService.createPayment(paymentRequest).subscribe({
      next: (response: PaymentInitializeResponse) => {
        if (response.payment_url) {
          console.log('Перенаправление на:', response.payment_url);
          window.location.href = response.payment_url;
        } else {
          console.error('Ошибка: Ссылка на оплату отсутствует.');
        }
      },
      error: (err) => {
        console.error('Ошибка при создании платежа:', err);
      }
    });
  }
  
}
