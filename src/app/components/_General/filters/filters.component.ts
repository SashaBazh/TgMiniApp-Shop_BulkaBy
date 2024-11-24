import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Input() items: any[] | undefined;
  @Output() filtersChanged = new EventEmitter<any>(); // Добавлено событие

  selectedIndex: number | null = null;
  selectedOptions: Map<number, Set<string>> = new Map(); // Храним выбранные значения для каждого атрибута

  toggleExpanded(index: number): void {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  isSelected(attributeId: number, option: any): boolean {
    return this.selectedOptions.get(attributeId)?.has(option.id) || false;
  }
  
  

  toggleOption(attributeId: number, option: any): void {
    if (!this.selectedOptions.has(attributeId)) {
      this.selectedOptions.set(attributeId, new Set());
    }
  
    const options = this.selectedOptions.get(attributeId)!;
  
    if (options.has(option.id)) {
      options.delete(option.id); // Убираем ID опции
    } else {
      options.add(option.id); // Добавляем ID опции
    }
  
    // Уведомляем родительский компонент о выбранных фильтрах
    this.filtersChanged.emit(this.getSelectedFilters());
  }
  
  
  

  getSelectedFilters(): any {
    const filters: any = {};
    this.selectedOptions.forEach((optionsSet, attributeId) => {
      if (optionsSet.size > 0) {
        filters[attributeId] = Array.from(optionsSet); // Массив ID выбранных опций
      }
    });
    return filters;
  }
  
  
  
}
