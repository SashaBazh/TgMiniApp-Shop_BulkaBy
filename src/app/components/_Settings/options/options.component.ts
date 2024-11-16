import { Component } from '@angular/core';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
  selectOption(option: string) {
    console.log(`Selected option: ${option}`);
    // Добавьте вашу логику для обработки выбора
  }
}
