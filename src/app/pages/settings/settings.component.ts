import { Component } from '@angular/core';
import { OptionsComponent } from '../../components/_Settings/options/options.component';
import { HeadersettingsComponent } from '../../components/_Settings/headersettings/headersettings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeadersettingsComponent, OptionsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
