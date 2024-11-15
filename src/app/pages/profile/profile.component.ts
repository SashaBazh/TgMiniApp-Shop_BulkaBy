import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { ProfileInfoComponent } from '../../components/_Profile/profile-info/profile-info.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavigationComponent, HeaderComponent, ProfileInfoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
