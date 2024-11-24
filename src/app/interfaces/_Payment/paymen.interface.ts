export interface PaymentInitializeResponse {
    payment_id: number;
    payment_url?: string; // Поле может быть undefined
    status_url?: string;
    qrcode_url?: string;
}


export interface CreatePaymentRequest {
    order_id: number | null; // Измените здесь, если сервер допускает null
    currency: string;
    email: string;
}
