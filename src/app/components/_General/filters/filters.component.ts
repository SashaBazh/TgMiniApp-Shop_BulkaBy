import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnChanges {
  @Input() items: any[] | undefined;
  @Input() preselectedFilters: any = {};
  @Output() filtersChanged = new EventEmitter<any>();

  selectedIndex: number | null = null;
  selectedOptions: Map<number, Set<number>> = new Map(); 
  private preselectedApplied = false;

  ngOnChanges(changes: SimpleChanges) {
    // Применяем preselectedFilters только один раз при первом изменении
    if (!this.preselectedApplied && this.preselectedFilters && Object.keys(this.preselectedFilters).length > 0) {
      Object.keys(this.preselectedFilters).forEach((attributeId) => {
        // Преобразуем значения в числа
        const options = this.preselectedFilters[attributeId].map((val: string) => Number(val));
        this.selectedOptions.set(Number(attributeId), new Set(options));
      });
      this.preselectedApplied = true;
    }
  }

  toggleExpanded(index: number): void {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  isSelected(attributeId: number, option: any): boolean {
    // Предполагается, что option.id - число
    return this.selectedOptions.get(attributeId)?.has(option.id) || false;
  }

  toggleOption(attributeId: number, option: any): void {
    if (!this.selectedOptions.has(attributeId)) {
      this.selectedOptions.set(attributeId, new Set());
    }

    const options = this.selectedOptions.get(attributeId)!;

    if (options.has(option.id)) {
      options.delete(option.id);
    } else {
      options.add(option.id);
    }

    this.filtersChanged.emit(this.getSelectedFilters());
  }

  getSelectedFilters(): any {
    const filters: any = {};
    this.selectedOptions.forEach((optionsSet, attributeId) => {
      if (optionsSet.size > 0) {
        // Преобразуем Set обратно в массив
        filters[attributeId] = Array.from(optionsSet);
      }
    });
    return filters;
  }
}
