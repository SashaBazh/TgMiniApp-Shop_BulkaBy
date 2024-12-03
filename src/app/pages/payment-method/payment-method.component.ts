import { Component, OnInit } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentMethodItemComponent } from '../../components/_PaymentMethod/payment-method-item/payment-method-item.component';
import { PaymentService } from '../../services/_Payment/payment.service';
import { PaymentInitializeResponse } from '../../interfaces/_Payment/paymen.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [HeaderbackComponent, CommonModule, RouterModule, PaymentMethodItemComponent, TranslateModule],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
})
export class PaymentMethodComponent implements OnInit {
  orderId: number | null = null;
  showNetworkDropdown = false; // Показывать ли выпадающий список
  selectedPaymentMethod: string | null = null; // Выбранный метод оплаты
  paymentUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    console.log('[PaymentMethodComponent] Инициализация компонента.');
    this.route.queryParamMap.subscribe((params) => {
      console.log('[PaymentMethodComponent] Параметры маршрута:', params.keys, params.toString());
      this.orderId = Number(params.get('orderId'));
      if (!this.orderId) {
        console.error('[PaymentMethodComponent] Ошибка: Идентификатор заказа не найден.');
      } else {
        console.log('[PaymentMethodComponent] Текущий orderId:', this.orderId);
      }
    });
  }

  toggleNetworkDropdown(paymentMethod: string): void {
    this.showNetworkDropdown = this.selectedPaymentMethod !== paymentMethod || !this.showNetworkDropdown;
    this.selectedPaymentMethod = paymentMethod;
  }

  handleNetworkClick(network: string): void {
    console.log(`Нажата кнопка: ${network}`);
    this.selectNetwork(network, 'coinpayments');
  }

  selectNetwork(network: string, paymentType: string): void {
    if (!this.orderId) {
      console.error('[PaymentMethodComponent] Ошибка: orderId не может быть null.');
      return;
    }

    const paymentRequest = {
      order_id: this.orderId, // Здесь гарантированно number
      currency: network,
      payment_type: paymentType, // Добавлено поле payment_type
      email: 'nelox001@gmail.com',
    };

    console.log('[PaymentMethodComponent] Отправка запроса:', paymentRequest);

    this.paymentService.createPayment(paymentRequest).subscribe({
      next: (response: PaymentInitializeResponse) => {
        if (response.payment_url) {
          console.log('[PaymentMethodComponent] Перенаправление на:', response.payment_url);
          window.location.href = response.payment_url;
        } else {
          console.error('[PaymentMethodComponent] Ошибка: Ссылка на оплату отсутствует.');
        }
      },
      error: (err) => {
        console.error('[PaymentMethodComponent] Ошибка при создании платежа:', err);
      },
    });
  }

  handlePaymentMethodClick(paymentMethod: string): void {
    console.log(`[PaymentMethodComponent] Обработка метода оплаты: ${paymentMethod}`);
    if (paymentMethod === 'iyzipay') {
      // Переход на новый маршрут, с добавлением параметра queryParams
      this.router.navigate(['/cart/address/payment/modal'], {
        queryParams: { orderId: this.orderId },
      });
    } else {
      console.error('[PaymentMethodComponent] Ошибка: Неподдерживаемый метод оплаты.');
    }
  }
}
