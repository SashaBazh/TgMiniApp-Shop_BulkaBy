import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FiltersService } from '../../services/_Admin/filters.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Attribute } from '../../interfaces/_Admin/attribute.interface';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  createAttributeForm: FormGroup;
  editAttributeForm: FormGroup;
  attributes: Attribute[] = [];
  editingAttribute: Attribute | null = null;
  options: string[] = []; // Список опций для атрибута
  isChoiceType: boolean = false; // Проверка, является ли атрибут типа CHOICE
  message: string = '';
  isSuccess: boolean = true;

  constructor(private fb: FormBuilder, private filtersService: FiltersService) {
    this.createAttributeForm = this.fb.group({
      name: ['', Validators.required],
      data_type: ['', Validators.required],
      is_filterable: [false],
    });

    this.editAttributeForm = this.fb.group({
      name: ['', Validators.required],
      data_type: ['', Validators.required],
      is_filterable: [false],
    });
  }

  ngOnInit(): void {
    this.loadAttributes();
  }

  loadAttributes() {
    this.filtersService.getAllAttributes().subscribe({
      next: (data: Attribute[]) => {
        this.attributes = data;
      },
      error: (err: any) => {
        console.error('Ошибка при загрузке атрибутов:', err);
      },
    });
  }

  onDataTypeChange(event: Event) {
    const dataType = (event.target as HTMLSelectElement).value;
    this.isChoiceType = dataType === 'choice';
    if (!this.isChoiceType) {
      this.options = []; // Очищаем опции, если тип данных изменен
    }
  }

  addOption() {
    this.options.push('');
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  submitAttributeForm() {
    if (this.createAttributeForm.valid) {
      const attributeData = this.createAttributeForm.value;
      this.filtersService.createAttribute(attributeData).subscribe({
        next: (response) => {
          if (this.isChoiceType && this.options.length > 0) {
            this.createOptions(response.id); // Создаем опции для атрибута
          } else {
            this.message = 'Атрибут успешно создан';
            this.isSuccess = true;
            this.createAttributeForm.reset();
            this.loadAttributes();
          }
        },
        error: (err) => {
          console.error('Ошибка при создании атрибута:', err);
          this.message = 'Ошибка при создании атрибута';
          this.isSuccess = false;
        },
      });
    }
  }

  createOptions(attributeId: number) {
    const optionsData = this.options.map((option) => ({
      attribute_id: attributeId,
      value: option, // Здесь value должно быть строкой
    }));
  
    this.filtersService.createOptions(optionsData).subscribe({
      next: () => {
        this.message = 'Атрибут и его опции успешно созданы';
        this.isSuccess = true;
        this.createAttributeForm.reset();
        this.loadAttributes();
      },
      error: (err) => {
        console.error('Ошибка при создании опций:', err);
        this.message = 'Ошибка при создании опций';
        this.isSuccess = false;
      },
    });
  }
  

  startEditing(attribute: Attribute) {
    this.editingAttribute = attribute;
    this.editAttributeForm.patchValue(attribute);
  }

  updateAttribute() {
    if (this.editingAttribute && this.editAttributeForm.valid) {
      const updatedData = this.editAttributeForm.value;
      this.filtersService.updateAttribute(this.editingAttribute.id, updatedData).subscribe({
        next: () => {
          this.message = 'Атрибут успешно обновлен';
          this.isSuccess = true;
          this.editingAttribute = null;
          this.loadAttributes();
        },
        error: (err) => {
          console.error('Ошибка при обновлении атрибута:', err);
          this.message = 'Ошибка при обновлении атрибута';
          this.isSuccess = false;
        },
      });
    }
  }

  cancelEditing() {
    this.editingAttribute = null;
    this.editAttributeForm.reset();
  }

  deleteAttribute(attributeId: number) {
    this.filtersService.deleteAttribute(attributeId).subscribe({
      next: () => {
        this.message = 'Атрибут успешно удален';
        this.isSuccess = true;
        this.loadAttributes();
      },
      error: (err) => {
        console.error('Ошибка при удалении атрибута:', err);
        this.message = 'Ошибка при удалении атрибута';
        this.isSuccess = false;
      },
    });
  }

  closeNotification() {
    this.message = '';
  }
}
