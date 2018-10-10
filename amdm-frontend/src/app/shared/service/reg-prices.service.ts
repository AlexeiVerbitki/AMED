import {Injectable} from '@angular/core';
import {DocumentService} from './document.service';
import {CompanyService} from './company.service';
import {Observable} from 'rxjs';
import {Company} from '../../models/company';
import {MedicamentService} from './medicament.service';
import {Medicament} from '../../models/medicament';

@Injectable({providedIn: 'root'})
export class PricesRegService {

  constructor(private docService: DocumentService,
              private companyService: CompanyService,
              private medicamentService: MedicamentService) {}

   getCompanies(): Observable<Company[]> {
      return this.companyService.getCompanies();
   }

   generateDocNumber(): Observable<any> {
      return this.docService.generateDocNr();
   }

   getCompanyMedicaments(companyId): Observable<Medicament[]> {
      return this.medicamentService.getCompanyMedicaments(companyId);
   }
}
