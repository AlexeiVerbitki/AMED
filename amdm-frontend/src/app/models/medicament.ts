import {UnitOfMeasure} from "./unitOfMeasure";
import {Price} from "./price";

export class Medicament {
  name: string;
  id: number;
  code: string;
  internationalMedicamentName: any;
  termsOfValidity: number;
  unitsOfMeasurement: UnitOfMeasure;  // for dose
  dose: number;
  expirationDate: Date;
  unitsQuantity: number;
  unitsQuantityMeasurement: UnitOfMeasure; // for units
  storageQuantity: number;
  storageQuantityMeasurement: UnitOfMeasure; // for storage
  volumeQuantityMeasurement: UnitOfMeasure; // for volume;
  prices: Price[];
  referencePrices: Price[];
  volume: number;
  medicamentType: any;
}
