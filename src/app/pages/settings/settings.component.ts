import { Component } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { OptionsComponent } from '../../components/_Settings/options/options.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderbackComponent, OptionsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
