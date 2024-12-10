import { Component, OnInit } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentMethodItemComponent } from '../../components/_PaymentMethod/payment-method-item/payment-method-item.component';
import { PaymentService } from '../../services/_Payment/payment.service';
import { PaymentInitializeResponse } from '../../interfaces/_Payment/paymen.interface';
import { TranslateModule } from '@ngx-translate/core';
import { TelegramService } from '../../services/_Telegram/telegram.service';

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
    private paymentService: PaymentService,
    private telegramService: TelegramService
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
  
    if (!this.orderId) {
      console.error('orderId отсутствует.');
      return;
    }
  
    // Для CoinPayments переходим на PaymentModal с параметрами
    this.router.navigate(['/cart/address/payment/modal'], {
      queryParams: {
        orderId: this.orderId,
        payment_type: 'coinpayments',
        currency: network,
      },
    });
  }
  
  handlePaymentMethodClick(paymentMethod: string): void {
    console.log(`[PaymentMethodComponent] Обработка метода оплаты: ${paymentMethod}`);
    
    if (paymentMethod === 'iyzipay') {
      // Для Iyzico переходим на PaymentModal с параметрами
      this.router.navigate(['/cart/address/payment/modal'], {
        queryParams: {
          orderId: this.orderId,
          payment_type: 'iyzipay',
        },
      });
    } else if (['LIRE', 'USD', 'RUB'].includes(paymentMethod)) {
      // Для последних методов оплаты показываем уведомление
      this.showContactManagerMessage();
    } else {
      console.error('[PaymentMethodComponent] Ошибка: Неподдерживаемый метод оплаты.');
    }
  }
  
  
  

  showContactManagerMessage(): void {
    if (this.telegramService.isTelegramWebAppAvailable()) {
      this.telegramService.showTelegramAlert('С вами скоро свяжется менеджер');
    } else {
      alert('С вами скоро свяжется менеджер'); // Фолбэк для обычных браузеров
    }
  }
}
