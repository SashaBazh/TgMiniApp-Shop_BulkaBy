import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CatalogItemComponent } from '../catalog-item/catalog-item.component';

@Component({
  selector: 'app-cataloggeneral',
  standalone: true,
  imports: [CommonModule, CatalogItemComponent],
  templateUrl: './cataloggeneral.component.html',
  styleUrls: ['./cataloggeneral.component.css']
})
export class CataloggeneralComponent implements OnInit {
  @Input() displayCount?: number; // Количество отображаемых элементов (опционально)
  
  fullItems = [
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

  items = this.fullItems; // По умолчанию показываем все элементы

  ngOnInit() {
    if (this.displayCount) {
      this.items = this.fullItems.slice(0, this.displayCount); // Ограничиваем количество элементов
    }
  }
}
