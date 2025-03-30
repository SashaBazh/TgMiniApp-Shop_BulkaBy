import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/_Payment/payment.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TelegramService } from '../../../services/_Telegram/telegram.service';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.css',
})
export class PaymentModalComponent implements OnInit {
  isCardPayment = false;
  
  // Добавим свойства для форматированного отображения
  formattedCardNumber = '•••• •••• •••• ••••';
  formattedCardExpiry = 'MM/ГГ';
  
  paymentData = {
    order_id: null as number | null,
    currency: 'USD',
    payment_type: 'fiat',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardHolder: '',
    buyer: {
      id: '',
      name: '',
      surname: '',
      identity_number: '',
      email: '',
      gsm_number: '',
      registration_date: '',
      last_login_date: '',
      registration_address: '',
      city: '',
      country: '',
      zip_code: '',
      ip: '',
    },
    shipping_address: {
      contact_name: '',
      city: '',
      country: '',
      address: '',
      zip_code: '',
    },
    billing_address: {
      contact_name: '',
      city: '',
      country: '',
      address: '',
      zip_code: '',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private paymentService: PaymentService,
    private telegramService: TelegramService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const orderId = params.get('orderId');
      const paymentType = params.get('payment_type');
      const currency = params.get('currency');
      const isCard = params.get('isCard') === 'true';

      if (orderId) {
        this.paymentData.order_id = Number(orderId);
      }

      if (paymentType === 'fiat' && currency) {
        this.isCardPayment = isCard;
        this.paymentData.payment_type = 'fiat';
        this.paymentData.currency = currency;
      }
    });
    
    this.fetchIpAddress();
  }

  // Метод форматирования номера карты (ввод: "1234567812345678", вывод: "1234 5678 1234 5678")
  formatCardNumber(value: string): string {
    // Удаляем все нецифровые символы
    const val = value.replace(/\D/g, '');
    
    // Ограничиваем длину до 16 цифр
    const cardNumber = val.substring(0, 16);
    
    // Форматируем по 4 цифры с пробелами
    const parts = [];
    for (let i = 0; i < cardNumber.length; i += 4) {
      parts.push(cardNumber.substring(i, i + 4));
    }
    
    // Обновляем отформатированное значение для отображения
    this.formattedCardNumber = parts.join(' ');
    if (this.formattedCardNumber.trim() === '') {
      this.formattedCardNumber = '•••• •••• •••• ••••';
    }
    
    // Возвращаем неформатированное значение (только цифры) для хранения в модели
    return cardNumber;
  }

  // Обработчик изменения номера карты
  onCardNumberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.paymentData.cardNumber = this.formatCardNumber(input.value);
    
    // Устанавливаем курсор в правильную позицию после форматирования
    const cursorPosition = input.selectionStart || 0;
    setTimeout(() => {
      input.value = this.formattedCardNumber;
      // Рассчитываем новую позицию курсора (добавляем пробелы)
      const newPosition = Math.min(
        this.formattedCardNumber.length,
        cursorPosition + Math.floor((cursorPosition - 1) / 4)
      );
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  // Метод форматирования срока действия (ввод: "1234", вывод: "12/34")
  formatCardExpiry(value: string): string {
    // Удаляем все нецифровые символы
    const val = value.replace(/\D/g, '');
    
    // Ограничиваем длину до 4 цифр
    const expiry = val.substring(0, 4);
    
    // Форматируем как MM/YY
    let formattedExpiry = '';
    if (expiry.length > 0) {
      formattedExpiry = expiry.substring(0, 2);
      if (expiry.length > 2) {
        formattedExpiry += '/' + expiry.substring(2);
      }
    }
    
    // Обновляем отформатированное значение для отображения
    this.formattedCardExpiry = formattedExpiry || 'MM/ГГ';
    
    // Возвращаем неформатированное значение для хранения в модели
    return expiry;
  }

  // Обработчик изменения срока действия карты
  onCardExpiryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.paymentData.cardExpiry = this.formatCardExpiry(input.value);
    
    // Устанавливаем курсор в правильную позицию после форматирования
    const cursorPosition = input.selectionStart || 0;
    setTimeout(() => {
      input.value = this.formattedCardExpiry === 'MM/ГГ' ? '' : this.formattedCardExpiry;
      // Рассчитываем новую позицию курсора (учитываем символ '/')
      const newPosition = Math.min(
        (this.formattedCardExpiry === 'MM/ГГ' ? 0 : this.formattedCardExpiry.length),
        cursorPosition + (cursorPosition > 2 ? 1 : 0)
      );
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  fetchIpAddress(): void {
    this.http
      .get<{ ip: string }>('https://api.ipify.org?format=json')
      .subscribe({
        next: (response) => {
          this.paymentData.buyer.ip = response.ip;
          console.log('IP-адрес установлен:', response.ip);
        },
        error: (err) => {
          console.error('Ошибка получения IP-адреса:', err);
        },
      });
  }

  closePage(): void {
    console.log('Отмена ввода данных');
    this.router.navigate(['/cart/address/payment'], {
      queryParams: { orderId: this.paymentData.order_id },
    });
  }

  submitPayment(): void {
    console.log('Email перед отправкой:', this.paymentData.email);
  
    if (!this.paymentData.order_id) {
      console.error('Ошибка: Идентификатор заказа не задан!');
      return;
    }
  
    if (!this.paymentData.email) {
      console.error('Ошибка: Email не задан!');
      return;
    }
  
    if (this.paymentData.payment_type === 'fiat') {
      const paymentRequest = {
        order_id: this.paymentData.order_id,
        currency: this.paymentData.currency,
        payment_type: 'fiat',
        email: this.paymentData.email,
      };
  
      console.log(
        '[PaymentModalComponent] Отправка запроса для Fiat:',
        paymentRequest
      );
  
      this.paymentService.createPayment(paymentRequest).subscribe({
        next: (response) => {
          console.log('Фиатный платеж успешно создан:', response);
          this.router.navigate(['/home']);
  
          if (this.telegramService.isTelegramWebAppAvailable()) {
            this.telegramService.showTelegramAlert(
              'Платеж успешно создан. Ожидайте подтверждения от менеджера.'
            );
          } else {
            alert(
              'Платеж успешно создан. Ожидайте подтверждения от менеджера.'
            );
          }
  
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Ошибка при создании фиатного платежа:', error);
          if (this.telegramService.isTelegramWebAppAvailable()) {
            this.telegramService.showTelegramAlert(
              'Ошибка при создании платежа. Попробуйте еще раз.'
            );
          } else {
            alert('Ошибка при создании платежа. Попробуйте еще раз.');
          }
        },
      });
      return;
    }
  }

  showSuccessNotification(): void {
    if (this.paymentData.payment_type === 'fiat') {
      this.paymentData.currency &&
        alert(`Платеж в валюте ${this.paymentData.currency} успешно создан.`);
    }
  }

  showErrorNotification(): void {
    alert('Ошибка при создании фиатного платежа. Попробуйте еще раз.');
  }

  confirmOrder(): void {
    this.router.navigate(['/home']);
  }
}