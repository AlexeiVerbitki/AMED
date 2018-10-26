import {UnitOfMeasure} from "./unitOfMeasure";
import {Price} from "./price";

export class Medicament {
  name: string;
  id: number;
  code: string;
  internationalMedicamentName: string;
  termsOfValidity: number;
  unitsOfMeasurement: UnitOfMeasure;  // for dose
  dose: number;
  expirationDate: Date;
  unitsQuantity: number;
  unitsQuantityMeasurement: UnitOfMeasure; // for units
  storageQuantity: number;
  storageQuantityMeasurement: UnitOfMeasure; // for storage;
  prices: Price[];
  referencePrices: Price[];
  volume: number;
}
