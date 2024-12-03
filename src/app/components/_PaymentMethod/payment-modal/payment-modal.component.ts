import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/_Payment/payment.service';

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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const orderId = params.get('orderId');
      if (orderId) {
        this.paymentData.order_id = Number(orderId);
        this.paymentData.buyer.id = `${orderId}`;
        console.log('Order ID установлен:', orderId);
      } else {
        console.error('Не удалось получить идентификатор заказа из маршрута.');
      }
    });

    // Устанавливаем даты регистрации и последнего входа
    const currentDate = this.formatDateToIyzico(new Date());
    this.paymentData.buyer.registration_date = currentDate;
    this.paymentData.buyer.last_login_date = currentDate;

    // Получение текущего IP-адреса
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

    // Копируем email из buyer в верхний уровень
    this.paymentData.email = this.paymentData.buyer.email;

    console.log('Отправка данных для оплаты:', this.paymentData);

    this.paymentService.createPayment(this.paymentData).subscribe({
      next: (response) => {
        console.log('Ответ сервера:', response);

        if (response.payment_page_url) {
          window.location.href = response.payment_page_url;
        }
        else {
          console.error('Ошибка: Ссылка на оплату отсутствует.');
        }
      },
      error: (error) => {
        console.error('Ошибка при создании платежа:', error);
      },
    });
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
