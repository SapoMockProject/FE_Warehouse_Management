export interface IStatisticResponse {
  numberOfEmployees: number;
  numberOfCategories: number;
  numberOfProducts: number;
  numberOfGoodsReceipts: number;
  goodsReceiptItemCountMap: {first: number; second: number}[];
  statisticOverTime: {first: string; second: number}[];
}