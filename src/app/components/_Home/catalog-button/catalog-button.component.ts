import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-catalog-button',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './catalog-button.component.html',
  styleUrl: './catalog-button.component.css'
})
export class CatalogButtonComponent {

}
