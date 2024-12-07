import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-link.component.html',
  styleUrls: ['./payment-link.component.css'] // Исправлено: styleUrl -> styleUrls
})
export class PaymentLinkComponent implements OnInit {
  paymentUrl: string | null = null;
  safePaymentUrl: SafeResourceUrl | null = null;
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer, // Добавляем DomSanitizer
    
  ) {}

  ngOnInit(): void {
    // Получаем ссылку на оплату и orderId из query-параметров
    this.paymentUrl = this.route.snapshot.queryParamMap.get('url');
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');

    if (this.paymentUrl) {
      // Обрабатываем небезопасный URL
      this.safePaymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.paymentUrl);
    }
  }

  goBack(): void {
    // Возвращаемся на страницу modal с тем же orderId
    // Путь: /cart/address/payment/modal?orderId=17
    if (this.orderId) {
      this.router.navigate(['/cart/address/payment/modal'], { queryParams: { orderId: this.orderId } });
    } else {
      // Если orderId отсутствует, можно задать логику по умолчанию:
      this.router.navigate(['/cart/address/payment']);
    }
  }
}
