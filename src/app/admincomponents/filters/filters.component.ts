import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FiltersService } from '../../services/_Admin/filters.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Attribute } from '../../interfaces/_Admin/attribute.interface';
import { firstValueFrom } from 'rxjs';

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
  options: { value: string }[] = [];
  isChoiceType: boolean = false; // Проверка, является ли атрибут типа CHOICE
  message: string = '';
  isSuccess: boolean = true;


  constructor(private fb: FormBuilder, private filtersService: FiltersService) {
    this.createAttributeForm = this.fb.group({
      nameRu: ['', Validators.required],  // Поле для русского названия
      nameEn: ['', Validators.required],  // Поле для английского названия
      data_type: ['', Validators.required], // Поле для типа данных
      is_filterable: [false], // Опциональное поле для фильтруемости
      options: this.fb.array([]) // Массив для опций
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
      while (this.optionsArray.length) {
        this.optionsArray.removeAt(0);
      }
    } else {
      this.addOption();
    }
  }

  get optionsArray() {
    return this.createAttributeForm.get('options') as FormArray;
  }

  addOption() {
    const optionsArray = this.createAttributeForm.get('options') as FormArray;
    optionsArray.push(
      this.fb.group({
        valueRu: ['', Validators.required], // Русское значение
        valueEn: ['', Validators.required]  // Английское значение
      })
    );
  }

  removeOption(index: number) {
    const optionsArray = this.createAttributeForm.get('options') as FormArray;
    optionsArray.removeAt(index);
  }

  

  updateOptionValue(index: number, value: string) {
    this.options[index] = { ...this.options[index], value: value };
    console.log('Обновленные опции:', this.options); // для отладки
  }

  createOptions(attributeId: number) {
    // Получаем значения из FormArray
    const options = this.optionsArray.value;
  
    // Фильтруем пустые значения и создаем массив промисов
    const optionRequests = options
      .filter((option: { valueRu: string; valueEn: string }) => option.valueRu.trim() !== '' && option.valueEn.trim() !== '')
      .map((option: { valueRu: string; valueEn: string }) => {
        const optionData = {
          attribute_id: attributeId,
          value: option.valueRu.trim(), // Основное значение (русский)
          translations: {
            ru: { value: option.valueRu.trim() }, // Перевод на русском
            en: { value: option.valueEn.trim() }  // Перевод на английском
          }
        };
  
        // Логируем данные перед отправкой
        console.log('Отправка данных опции:', optionData);
  
        // Возвращаем промис для каждого запроса
        return this.filtersService.createOption(optionData).toPromise();
      });
  
    // Если есть опции для создания
    if (optionRequests.length > 0) {
      // Ждем выполнения всех запросов
      Promise.all(optionRequests)
        .then(() => {
          console.log('Все опции успешно созданы');
          this.message = 'Атрибут и опции успешно созданы';
          this.isSuccess = true;
          this.createAttributeForm.reset();
          this.loadAttributes();
        })
        .catch((error) => {
          console.error('Ошибка при создании опций:', error);
          this.message = 'Ошибка при создании опций';
          this.isSuccess = false;
        });
    } else {
      console.warn('Нет опций для создания.');
    }
  }
  
  
  // И обновим метод submitAttributeForm
  submitAttributeForm() {
    if (this.createAttributeForm.valid) {
      const formData = this.createAttributeForm.value;
  
      const attributeData = {
        name: formData.nameRu,
        data_type: formData.data_type,
        is_filterable: formData.is_filterable === null ? false : formData.is_filterable, // Устанавливаем false, если значение null
        translations: {
          ru: { name: formData.nameRu },
          en: { name: formData.nameEn },
        },
      };
  
      // Отправляем данные для создания атрибута
      this.filtersService.createAttribute(attributeData).subscribe({
        next: (response) => {
          console.log('Атрибут создан:', response);
  
          const attributeId = response.attribute_id; // Получаем ID атрибута из ответа
  
          if (!attributeId) {
            console.error('ID атрибута отсутствует в ответе сервера');
            this.message = 'Ошибка: сервер не вернул ID атрибута';
            this.isSuccess = false;
            return;
          }
  
          // Создаем опции, если они есть
          if (this.isChoiceType && this.optionsArray.length > 0) {
            this.createOptions(attributeId);
          } else {
            this.message = 'Атрибут успешно создан';
            this.isSuccess = true;
            this.createAttributeForm.reset();
            this.loadAttributes();
          }
        },
        error: (err) => {
          console.error('Ошибка создания атрибута:', err);
          this.message = 'Ошибка создания атрибута';
          this.isSuccess = false;
        }
      });
    }
  }     
  

  startEditing(attribute: Attribute) {
    this.editingAttribute = attribute;
  
    // Заполняем форму для редактирования
    this.editAttributeForm.patchValue({
      name: attribute.name,
      data_type: attribute.data_type,
      is_filterable: attribute.is_filterable,
    });
  
    // Проверяем, есть ли опции у атрибута
    if (attribute.options?.length) {
      console.log('Опции для редактирования:', attribute.options);
    } else {
      console.log('У атрибута нет опций.');
    }
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

  deleteAttributeWithOptions(attributeId: number, options: { id: number }[]) {
    // Сначала удаляем все опции
    this.deleteAllAttributeOptions(options)
      .then(() => {
        console.log('Все опции удалены, теперь удаляем атрибут');
        return firstValueFrom(this.filtersService.deleteAttribute(attributeId));
      })
      .then(() => {
        console.log('Атрибут успешно удален');
        this.message = 'Атрибут и его опции успешно удалены';
        this.isSuccess = true;
        this.loadAttributes();
      })
      .catch(err => {
        console.error('Ошибка при удалении атрибута или его опций:', err);
        this.message = 'Ошибка при удалении атрибута или его опций';
        this.isSuccess = false;
      });
  }

  deleteAttribute(attribute: Attribute) {
    if (attribute.options && attribute.options.length > 0) {
      this.deleteAttributeWithOptions(attribute.id, attribute.options);
    } else {
      // Если у атрибута нет опций, просто удаляем его
      this.filtersService.deleteAttribute(attribute.id).subscribe({
        next: () => {
          console.log('Атрибут успешно удален');
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
  }
  
  
  

  closeNotification() {
    this.message = '';
  }

  deleteOption(optionId: number, index: number) {
    // Проверяем, что editingAttribute существует и содержит options
    if (this.editingAttribute === null || this.editingAttribute.options === undefined) {
      console.error('Нет атрибута для редактирования или опций');
      return;
    }
  
    this.filtersService.deleteAttributeOption(optionId).subscribe({
      next: () => {
        // Удаляем опцию из локального массива
        this.editingAttribute!.options!.splice(index, 1);
        console.log(`Опция с ID ${optionId} удалена.`);
        this.message = 'Опция успешно удалена';
        this.isSuccess = true;
      },
      error: (err) => {
        console.error('Ошибка при удалении опции:', err);
        this.message = 'Ошибка при удалении опции';
        this.isSuccess = false;
      },
    });
  }
  
  
  
  

  deleteAllAttributeOptions(options: { id: number }[]): Promise<any> {
    const deleteRequests = options.map(option =>
      firstValueFrom(this.filtersService.deleteAttributeOption(option.id))
        .catch(err => {
          console.error(`Ошибка при удалении опции с ID ${option.id}:`, err);
          throw new Error(`Не удалось удалить опцию с ID ${option.id}`);
        })
    );
  
    return Promise.all(deleteRequests);
  }
  
  
}
