import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../services/_Order/order.service';
import { DeliveryMethod, OrderCreateRequest } from '../../interfaces/_Order/order.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-address',
  standalone: true,
  imports: [HeaderbackComponent, TranslateModule, FormsModule],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.css'
})
export class DeliveryAddressComponent implements OnInit {
  address: string = '';
  usedPoints: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const usedPointsParam = this.route.snapshot.queryParamMap.get('usedPoints');
    if (usedPointsParam) {
      this.usedPoints = Number(usedPointsParam);
    }
  }

  confirmOrder(): void {
    if (!this.address.trim()) {
      console.error('Адрес доставки не указан.');
      return;
    }
  
    const orderData: OrderCreateRequest = {
      delivery_method: DeliveryMethod.DELIVERY,
      points_to_use: this.usedPoints,
      delivery_address: this.address.trim() // Добавляем адрес в тело запроса
    };
  
    this.orderService.createOrder(orderData).subscribe({
      next: (orderResponse) => {
        console.log('Доставка успешно оформлена:', orderResponse);
        // Переход на страницу оплаты доставки
        this.router.navigate(['/cart/deliveryaddress/payment'], { queryParams: { orderId: orderResponse.id } });
      },
      error: (err) => {
        console.error('Ошибка при создании заказа:', err);
      }
    });
  }
  
}
