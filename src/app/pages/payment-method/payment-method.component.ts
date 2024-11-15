import { Component } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentMethodItemComponent } from '../../components/_PaymentMethod/payment-method-item/payment-method-item.component';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [HeaderbackComponent, CommonModule, RouterModule, PaymentMethodItemComponent],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css'
})
export class PaymentMethodComponent {

}
