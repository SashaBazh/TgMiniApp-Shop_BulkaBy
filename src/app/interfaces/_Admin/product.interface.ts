// interfaces/product.interface.ts

export interface ProductCreateData {
  category_id: number;
  name: string;
  description: string;
  price: number;
  attributes: any;
  images: File[]; // Массив файлов изображений
}

export interface ProductResponse {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  media?: string[]; // Массив ссылок на изображения
  attribute_values?: ProductAttributeValue[];
  mediaUrl?: string; // Поле для URL изображения (если требуется)
}

export interface ProductAttributeValue {
  id: number;
  attribute_id: number;
  attribute: {
    id: number;
    name: string;
    data_type: 'string' | 'integer' | 'float' | 'boolean' | 'enum';
  };
  value: string | number | boolean | null;
}
