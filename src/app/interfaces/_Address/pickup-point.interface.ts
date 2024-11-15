export interface PickupPoint {
    id: number;
    name: string;
    rating: number; // Оценка от 0 до 5
    workingHours: string;
    selected: boolean; // Для определения, выбран ли пункт выдачи
  }
  