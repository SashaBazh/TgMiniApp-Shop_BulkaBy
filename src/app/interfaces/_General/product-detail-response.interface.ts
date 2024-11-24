export interface AttributeOptionResponse {
    id: number;
    value: string;
  }
  
  export interface AttributeResponse {
    id: number;
    name: string;
    data_type: string; // Можно заменить на enum, если у вас есть соответствующий
    is_filterable: boolean;
    options?: AttributeOptionResponse[];
  }
  
  export interface ProductAttributeValueResponse {
    id: number;
    attribute_id: number;
    attribute: AttributeResponse;
    value: any; // Значение может быть любого типа
  }
  
  export interface ProductResponse {
    id: number;
    category_id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
  }
  
  export interface ProductDetailResponse extends ProductResponse {
    attribute_values: ProductAttributeValueResponse[];
  }
  