import {Currency} from "./currency";

export class CurrencyHistory {
    id: number;
    period: Date;
    value: string;
    multiplicity: number;
    currency: Currency;
}