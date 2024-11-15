import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CatalogItemComponent } from '../catalog-item/catalog-item.component';

@Component({
  selector: 'app-cataloggeneral',
  standalone: true,
  imports: [CommonModule, CatalogItemComponent],
  templateUrl: './cataloggeneral.component.html',
  styleUrl: './cataloggeneral.component.css'
})
export class CataloggeneralComponent {
  items = [
    { id: 1, name: 'Кольца', imageSrc: '../../../../assets/catalog/1.png' },
    { id: 2, name: 'Серьги', imageSrc: '../../../../assets/catalog/2.png' },
    { id: 3, name: 'Браслеты', imageSrc: '../../../../assets/catalog/1.png' },
    { id: 4, name: 'Кольца', imageSrc: '../../../../assets/catalog/1.png' },
    { id: 5, name: 'Серьги', imageSrc: '../../../../assets/catalog/2.png' },
    { id: 6, name: 'Браслеты', imageSrc: '../../../../assets/catalog/1.png' },
    { id: 7, name: 'Кольца', imageSrc: '../../../../assets/catalog/1.png' },
    { id: 8, name: 'Серьги', imageSrc: '../../../../assets/catalog/2.png' },
    { id: 9, name: 'Браслеты', imageSrc: '../../../../assets/catalog/1.png' },
  ];
}
