import {UnitOfMeasure} from "./unitOfMeasure";
import {Price} from "./price";
import {Country} from "./country";

export class Medicament {
  name: string;
  id: number;
  code: string;
  farmaceuticalForm: string;
  country: Country;
  manufacture: any;
  internationalMedicamentName: any;
  termsOfValidity: number;
  unitsOfMeasurement: UnitOfMeasure;  // for dose
  dose: string;
  division: string;
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
