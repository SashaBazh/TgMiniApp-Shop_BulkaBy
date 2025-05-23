import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupPoint } from '../../../interfaces/_Address/pickup-point.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pickup-point',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pickup-point.component.html',
  styleUrls: ['./pickup-point.component.css']
})
export class PickupPointComponent implements OnInit {
  @Input() pickupPoint!: PickupPoint;
  @Output() selectPoint = new EventEmitter<PickupPoint>();

  starOffsets: number[] = [];

  ngOnInit(): void {
    if (this.pickupPoint) {
      this.calculateStarOffsets();
    }
  }

  private calculateStarOffsets(): void {
    if (!this.pickupPoint || this.pickupPoint.rating === undefined) return;

    this.starOffsets = [0, 1, 2, 3, 4].map(index => {
      const rating = this.pickupPoint.rating;

      if (index + 1 <= rating) {
        return 100;
      } else if (index < rating) {
        const fractionalPart = rating - index;
        return fractionalPart * 100;
      } else {
        return 0;
      }
    });
  }

  getClipPath(offset: number): string {
    return `inset(0 ${100 - offset}% 0 0)`;
  }

  selectPickupPoint(): void {
    this.selectPoint.emit(this.pickupPoint);
  }

  getPickupImage(id: number): string {
    const images = [
      '../../../../assets/payments/pickup1.png',
      '../../../../assets/payments/pickup2.png',
      '../../../../assets/payments/pickup3.png'
    ];
    return images[id % images.length]; // Использует остаток от деления, если id больше 2
  }
  
}
