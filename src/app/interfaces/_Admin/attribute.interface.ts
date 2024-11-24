export interface AttributeOption {
  id: number;          // Идентификатор опции
  value: string;       // Значение опции (например, "Silver")
  title?: string;      // Необязательное поле для отображения
}


export interface AttributeResponse {
  id: number;
  name: string;
  data_type: 'string' | 'integer' | 'float' | 'boolean' | 'enum';
  options?: AttributeOption[];
  default_value?: boolean | string | number; // Added this property
}

export interface Attribute {
  id: number;
  name: string;
  data_type: string;
  is_filterable: boolean;
  options?: any[]; // Если есть опции у атрибута
}
