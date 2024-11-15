import { Component } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { PickupPoint } from '../../interfaces/_Address/pickup-point.interface';
import { PickupPointComponent } from '../../components/_Address/pickup-point/pickup-point.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [HeaderbackComponent, PickupPointComponent, CommonModule, RouterModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  pickupPoints: PickupPoint[] = [
    {
      id: 1,
      name: 'Улица. Пушкина, Дом Б32, Сектор 2',
      rating: 4,
      workingHours: 'Ежедневно 08:00-22:00',
      selected: false
    },
    {
      id: 2,
      name: 'Улица. Пушкина, Дом Б32, Сектор 2',
      rating: 3.3,
      workingHours: 'Ежедневно 08:00-22:00',
      selected: false
    },
    {
      id: 3,
      name: 'Улица. Пушкина, Дом Б32, Сектор 2',
      rating: 4.6,
      workingHours: 'Ежедневно 08:00-22:00',
      selected: false
    },
    // Добавьте дополнительные пункты выдачи по необходимости
  ];

  // Метод для обработки выбора пункта выдачи
  selectPickupPoint(selectedPoint: PickupPoint): void {
    // Сбрасываем выбор у всех пунктов
    this.pickupPoints.forEach(point => point.selected = false);
    // Устанавливаем выбор на выбранном пункте
    selectedPoint.selected = true;
  }
}
