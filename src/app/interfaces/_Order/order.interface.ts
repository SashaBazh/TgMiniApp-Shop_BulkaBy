export enum DeliveryMethod {
    DELIVERY = "delivery",
    PICKUP = "pickup"
}

export interface OrderCreateRequest {
    delivery_method: DeliveryMethod;
    delivery_address?: string;
    pickup_location_id?: number;
}

export interface OrderResponse {
    id: number;
    user_id: number;
    status: string;
    delivery_method: DeliveryMethod;
    delivery_address?: string;
    pickup_location_id?: number;
}