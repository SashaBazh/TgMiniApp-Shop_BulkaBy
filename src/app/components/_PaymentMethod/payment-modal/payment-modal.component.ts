import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/_Payment/payment.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TelegramService } from '../../../services/_Telegram/telegram.service';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.css'
})
export class PaymentModalComponent implements OnInit {
  paymentData = {
    order_id: null as number | null,
    currency: 'USD',
    payment_type: 'iyzipay',
    email: '', // Добавлено поле email на верхнем уровне
    buyer: {
      id: '', // ID заказа будет установлен автоматически
      name: '',
      surname: '',
      identity_number: '',
      email: '', // Это значение будет дублироваться на верхнем уровне
      gsm_number: '',
      registration_date: '',
      last_login_date: '',
      registration_address: '',
      city: '',
      country: '',
      zip_code: '',
      ip: '', // IP будет установлен автоматически
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

  isCoinpayments = false;
  paymentUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private paymentService: PaymentService,
    private telegramService: TelegramService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const orderId = params.get('orderId');
      const paymentType = params.get('payment_type');
      const currency = params.get('currency');

      if (orderId) {
        this.paymentData.order_id = Number(orderId);
        this.paymentData.buyer.id = `${orderId}`;
        console.log('Order ID установлен:', orderId);
      } else {
        console.error('Не удалось получить идентификатор заказа из маршрута.');
      }

      if (paymentType === 'fiat' && currency) {
        this.isCoinpayments = false;
        this.paymentData.payment_type = 'fiat';
        this.paymentData.currency = currency;

        this.paymentData.buyer = {
          id: `${orderId}`,
          name: '',
          surname: '',
          identity_number: '',
          email: '', // Оставляем только email
          gsm_number: '',
          registration_date: '',
          last_login_date: '',
          registration_address: '',
          city: '',
          country: '',
          zip_code: '',
          ip: '',
      };
      }

      if (paymentType === 'coinpayments' && currency) {
        // Для coinpayments оставляем только email
        this.isCoinpayments = true;
        this.paymentData.payment_type = 'coinpayments';
        this.paymentData.currency = currency;
        // Очищаем лишние поля, если хотите
        // Можно просто их игнорировать при сабмите
      } else {
        // Обычный сценарий iyzipay, если таковой есть
      }
    });

    // Устанавливаем даты и IP, если нужно
    const currentDate = this.formatDateToIyzico(new Date());
    this.paymentData.buyer.registration_date = currentDate;
    this.paymentData.buyer.last_login_date = currentDate;
    this.fetchIpAddress();
  }

  fetchIpAddress(): void {
    this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe({
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
    this.router.navigate(['/cart/address/payment'], { queryParams: { orderId: this.paymentData.order_id } });
  }

  submitPayment(): void {
    if (!this.paymentData.order_id) {
      console.error('Ошибка: Идентификатор заказа не задан!');
      return;
    }
  
    // Для CoinPayments
    if (this.isCoinpayments) {
      const paymentRequest = {
        order_id: this.paymentData.order_id,
        currency: this.paymentData.currency,
        payment_type: 'coinpayments',
        email: this.paymentData.email, // Берем email с верхнего уровня
      };
  
      console.log('[PaymentModalComponent] Отправка запроса для CoinPayments:', paymentRequest);
  
      this.paymentService.createPayment(paymentRequest).subscribe({
        next: (response) => {
          console.log('Ответ сервера для CoinPayments:', response);
  
          if (response.payment_url) {
            // Открываем ссылку в новой вкладке
            window.location.href = response.payment_url;
          } else {
            console.error('Ошибка: Ссылка на оплату отсутствует.');
          }
        },
        error: (error) => {
          console.error('Ошибка при создании платежа для CoinPayments:', error);
        },
      });
  
      return; // Прекращаем выполнение, так как обработали CoinPayments
    }
  
    // Для фиатных платежей (RUB, USD, LIRE)
    if (this.paymentData.payment_type === 'fiat') {
      const paymentRequest = {
        order_id: this.paymentData.order_id,
        currency: this.paymentData.currency,
        payment_type: 'fiat',
        email: this.paymentData.email,
      };
  
      console.log('[PaymentModalComponent] Отправка запроса для Fiat:', paymentRequest);
  
      this.paymentService.createPayment(paymentRequest).subscribe({
        next: (response) => {
          console.log('Фиатный платеж успешно создан:', response);
  
          if (this.telegramService.isTelegramWebAppAvailable()) {
            this.telegramService.showTelegramAlert('Платеж успешно создан. Ожидайте подтверждения от менеджера.');
          } else {
            alert('Платеж успешно создан. Ожидайте подтверждения от менеджера.');
          }
  
          // Перенаправление на страницу с заказом
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Ошибка при создании фиатного платежа:', error);
          if (this.telegramService.isTelegramWebAppAvailable()) {
            this.telegramService.showTelegramAlert('Ошибка при создании платежа. Попробуйте еще раз.');
          } else {
            alert('Ошибка при создании платежа. Попробуйте еще раз.');
          }
        },
      });
      return; // Завершаем выполнение для фиатных платежей
    }
  
    // Для Iyzico
    this.paymentData.email = this.paymentData.buyer.email; // Копируем email из buyer в верхний уровень
    console.log('[PaymentModalComponent] Отправка данных для Iyzico:', this.paymentData);
  
    this.paymentService.createPayment(this.paymentData).subscribe({
      next: (response) => {
        console.log('Ответ сервера для Iyzico:', response);
  
        if (response.payment_page_url) {
          // Перенаправляем на компонент payment-link
          this.router.navigate(['/payment-link'], {
            queryParams: {
              url: response.payment_page_url,
              orderId: this.paymentData.order_id,
            },
          });
        } else {
          console.error('Ошибка: Ссылка на оплату отсутствует.');
        }
      },
      error: (error) => {
        console.error('Ошибка при создании платежа для Iyzico:', error);
      },
    });
  }
  

  showSuccessNotification(): void {
    if (this.paymentData.payment_type === 'fiat') {
      this.paymentData.currency && alert(`Платеж в валюте ${this.paymentData.currency} успешно создан.`);
    }
  }
  
  showErrorNotification(): void {
    alert('Ошибка при создании фиатного платежа. Попробуйте еще раз.');
  }
  

  private formatDateToIyzico(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
