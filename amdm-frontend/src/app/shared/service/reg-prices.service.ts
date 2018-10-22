import {Injectable} from '@angular/core';
import {CompanyService} from './company.service';
import {Observable} from 'rxjs';
import {Company} from '../../models/company';
import {MedicamentService} from './medicament.service';
import {Medicament} from '../../models/medicament';
import {AdministrationService} from './administration.service';
import {Country} from "../../models/country";
import {Currency} from "../../models/currency";

@Injectable({providedIn: 'root'})
export class PricesRegService {

  constructor(private administrationService: AdministrationService,
              private companyService: CompanyService,
              private medicamentService: MedicamentService) {}

   getCompanies(): Observable<Company[]> {
      return this.administrationService.getAllCompaniesMinimal();
   }

   generateDocNumber(): Observable<any> {
      return this.administrationService.generateDocNr();
   }

   getCompanyMedicaments(companyId): Observable<Medicament[]> {
      return this.medicamentService.getCompanyMedicaments(companyId);
   }

   getCountries(): Observable<Country[]> {
      return this.administrationService.getCountries();
   }

    getCurrenciesShort(): Observable<Currency[]> {
        return this.administrationService.getCurrenciesShort();
    }
}
