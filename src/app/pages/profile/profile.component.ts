import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { ProfileInfoComponent } from '../../components/_Profile/profile-info/profile-info.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavigationComponent, HeaderComponent, ProfileInfoComponent, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [TranslateService]
})
export class ProfileComponent {

}
