// interfaces/product.interface.ts
export interface ProductCreateData {
  category_id: number;
  name: string;
  description: string;
  price: number;
  attributes: any;
  images: File[]; // Обновлено: массив файлов
}

export interface ProductResponse {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  media?: string[]; // Массив строк для ссылок на изображения
  attribute_values?: ProductAttributeValue[];
  mediaUrl?: string; // Новое свойство для преобразованного URL
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