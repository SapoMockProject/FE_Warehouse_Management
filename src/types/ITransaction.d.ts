export interface TransactionRequest {
    amount: number;
    paymentMethodId: string | null;
    referenceCode: string;
    processedOn: string; //thoi gian ghi nhan thanh toan
}