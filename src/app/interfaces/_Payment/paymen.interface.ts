export interface PaymentInitializeResponse {
    payment_id: number;
    payment_url?: string;
    status_url?: string;
    qrcode_url?: string;
    checkout_form_content?: string;
    payment_page_url?: string;
    pay_with_iyzico_page_url?: string;
    // Add new fields for the new payment service
    new_service_specific_field?: string;
    message?: string;
  }


export interface CreatePaymentRequest {
    order_id: number | null; // Измените здесь, если сервер допускает null
    currency: string;
    email: string;
}

// export interface CreatePaymentRequest {
//   order_id: number;
//   payment_type: string; // Добавьте это свойство
//   currency: string;
// }


export enum PaymentType {
    IYZIPAY = "iyzipay",
    COINPAYMENTS = "coinpayments",
    CASH = "cash"
  }