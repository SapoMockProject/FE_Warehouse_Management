export interface IStatisticResponse {
    numberOfEmployees: number;
    numberOfCategories: number;
    numberOfProducts: number;
    inventoryOverTime: {first: string; second: number}[];
}