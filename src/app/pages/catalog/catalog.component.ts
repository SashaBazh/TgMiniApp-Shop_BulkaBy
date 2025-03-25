import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { CataloggeneralComponent } from '../../components/_General/cataloggeneral/cataloggeneral.component';
import { TranslateModule } from '@ngx-translate/core';
import { CataloggenComponent } from '../../components/_General/cataloggen/cataloggen.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NavigationComponent, HeaderComponent, CataloggeneralComponent, TranslateModule, CataloggenComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})

export class CatalogComponent {

}
