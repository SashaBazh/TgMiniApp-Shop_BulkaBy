export interface PickupPoint {
  id: number;
  name: string;
  description?: string;
  image?: string;
  address: string;
  rating: number;
  selected?: boolean;
  link?: string;
}