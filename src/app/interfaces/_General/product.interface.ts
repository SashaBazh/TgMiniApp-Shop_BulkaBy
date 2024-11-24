export interface Product {
  id: number; // ID продукта
  category_id: number; // ID категории
  name: string; // Название продукта
  description?: string; // Описание продукта
  price: number; // Цена продукта
  media?: string[]; // Массив URL-ов изображений
  image?: string; // URL первого изображения из media
  currency: string; // Валюта (например, ₽)
}
