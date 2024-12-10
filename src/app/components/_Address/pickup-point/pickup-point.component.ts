import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupPoint } from '../../../interfaces/_Address/pickup-point.interface';

@Component({
  selector: 'app-pickup-point',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pickup-point.component.html',
  styleUrls: ['./pickup-point.component.css']
})
export class PickupPointComponent implements OnInit {
  @Input() pickupPoint!: PickupPoint;

  starOffsets: number[] = [];

  ngOnInit(): void {
    this.calculateStarOffsets();
  }

  private calculateStarOffsets(): void {
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
}
