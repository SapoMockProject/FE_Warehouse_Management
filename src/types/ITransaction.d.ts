export interface TransactionRequest {
    amount: number;
    paymentMethodId: number | null;
    referenceCode: string;
    processedOn: string; //thoi gian ghi nhan thanh toan
}

export interface TransactionResponse {
    id: number | null,
    amount: number;
    paymentMethodId: number | null;
    paymentMethodName: string | null;
    goodsReceiptId: number;
    processedOn: string; //thoi gian ghi nhan thanh toan
}