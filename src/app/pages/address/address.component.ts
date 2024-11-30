import { Component, OnInit } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { PickupPointComponent } from '../../components/_Address/pickup-point/pickup-point.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { PickupPoint } from '../../interfaces/_Address/pickup-point.interface';
import { PickupPointService } from '../../services/_Address/pickup-point.service';
import { OrderService } from '../../services/_Order/order.service';
import { DeliveryMethod, OrderCreateRequest } from '../../interfaces/_Order/order.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [HeaderbackComponent, PickupPointComponent, CommonModule, RouterModule, TranslateModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  pickupPoints: PickupPoint[] = [];

  constructor(
    private pickupPointService: PickupPointService,
    private orderService: OrderService, // Добавляем сервис заказа
    private router: Router // Для навигации после создания заказа
  ) {}

  ngOnInit(): void {
    this.loadPickupPoints();
  }

  loadPickupPoints(): void {
    this.pickupPointService.getPickupPoints().subscribe({
      next: (data: PickupPoint[]) => {
        this.pickupPoints = data.map(point => ({ ...point, selected: false }));
      },
      error: (err: any) => {
        console.error('Не удалось загрузить пункты выдачи:', err);
      }
    });
  }

  // Метод для обработки выбора пункта выдачи
  selectPickupPoint(selectedPoint: PickupPoint): void {
    // Сбрасываем выбор у всех пунктов
    this.pickupPoints.forEach(point => point.selected = false);
    // Устанавливаем выбор на выбранном пункте
    selectedPoint.selected = true;
  }

  // Геттер для проверки, выбран ли пункт выдачи
  get isPickupPointSelected(): boolean {
    return this.pickupPoints.some(p => p.selected);
  }

  // Метод для создания заказа
  confirmOrder(): void {
    const selectedPoint = this.pickupPoints.find(p => p.selected);
    if (!selectedPoint) {
      console.error('Пункт выдачи не выбран.');
      return;
    }
  
    const orderData: OrderCreateRequest = {
      delivery_method: DeliveryMethod.PICKUP,
      pickup_location_id: selectedPoint.id,
    };
  
    this.orderService.createOrder(orderData).subscribe({
      next: (orderResponse) => {
        console.log('Заказ успешно создан:', orderResponse);
        // Переход на страницу оплаты
        this.router.navigate(['/cart/address/payment'], { queryParams: { orderId: orderResponse.id } });
      },
      error: (err) => {
        console.error('Ошибка при создании заказа:', err);
      }
    });
  }
  
}
