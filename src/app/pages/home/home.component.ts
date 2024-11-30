import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { ImageSliderComponent } from '../../components/_Home/image-slider/image-slider.component';
import { ImagesSlidersComponent } from '../../components/_Home/images-sliders/images-sliders.component';
import { NewJewelryComponent } from '../../components/_General/new-jewelry/new-jewelry.component';
import { CatalogButtonComponent } from '../../components/_Home/catalog-button/catalog-button.component';
import { CataloggeneralComponent } from '../../components/_General/cataloggeneral/cataloggeneral.component';
import { FiltersComponent } from '../../components/_General/filters/filters.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationComponent, HeaderComponent, ImageSliderComponent, ImagesSlidersComponent, NewJewelryComponent, CatalogButtonComponent, CataloggeneralComponent, FiltersComponent, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('ru');
  }
  
  items: any[] = [
    { name: 'Кольца' },
    { name: 'Серьги' },
    { name: 'Браслеты' },
    { name: 'Ожерелья' },
    { name: 'Подвески' }
  ];
}
