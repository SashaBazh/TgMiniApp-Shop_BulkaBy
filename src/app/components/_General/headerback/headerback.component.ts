import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-headerback',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './headerback.component.html',
  styleUrls: ['./headerback.component.css']
})
export class HeaderbackComponent {
  @Input() pageTitle: string = 'Главная';

  constructor(private location: Location, private router: Router) {}

  goBack() {
    const currentUrl = this.router.url; // Получаем текущий URL

    if (currentUrl.startsWith('/cart/address/payment')) {
      // Перенаправляем на /cart/address, если URL начинается с /cart/address/payment
      this.router.navigate(['/cart/address']);
    } else if (currentUrl === '/cart/address') {
      // Перенаправляем на /cart, если URL равен /cart/address
      this.router.navigate(['/cart']);
    } else {
      // Выполняем обычный возврат назад
      this.location.back();
    }
  }
}