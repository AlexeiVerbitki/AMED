import {Currency} from "./currency";
import {Country} from "./country";
import {Document} from "./document";

export class Price {
    id: number;
    description: string;
    value: string;
    currency: Currency;
    country: Country;  //only for referencePrice type
    type: any;
    documents: Document[];
    medicamentId: number;
    expirationReason: any;
    expirationDate: Date;
}