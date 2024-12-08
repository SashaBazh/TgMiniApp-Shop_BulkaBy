import { Component } from '@angular/core';
import { MyPurchasesComponent } from '../../components/_Profile/my-purchases/my-purchases.component';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [MyPurchasesComponent, HeaderbackComponent, TranslateModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent {

}
