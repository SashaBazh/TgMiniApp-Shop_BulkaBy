export interface AddProduct {
    product_id: number;
    quantity: number;
  }
  
  export interface CartItem {
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    media?: string[]; // Массив URL изображений
    image?: string; // Первое изображение из media
  }
  
  export interface CartResponse {
    items: CartItem[];
    total_price: number;
  }
  