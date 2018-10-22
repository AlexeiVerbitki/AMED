import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver, ComponentRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {Company} from '../../../models/company';
import {Medicament} from '../../../models/medicament';
import {Document} from '../../../models/document';
import {MatDialog} from '@angular/material';
import {PricesRegService} from '../../../shared/service/reg-prices.service';
import {saveAs} from 'file-saver';
import {ReferencePriceComponent} from "../reference-price/reference-price.component";
import {Country} from "../../../models/country";
import {Currency} from "../../../models/currency";


@Component({
  selector: 'app-price-reg-med',
  templateUrl: './price-reg-med.component.html',
  styleUrls: ['./price-reg-med.component.css']
})
export class PriceRegMedComponent implements OnInit, OnDestroy {

      MAX_REFERENCE_PRICES: number = 9;
      PriceRegForm: FormGroup;
      documents: Document[] = [];
      private subscriptions: Subscription[] = [];
      private getMedSubscr: Subscription;
      private generatedDocNrSeq: any;
      companies: Company[] = [];
      countries: Country[] = [];
      currencies: Currency[] = [];
      companyMedicaments: Medicament[];
      formSubmitted: boolean;
      @ViewChild("priceReferenceContainer", { read: ViewContainerRef }) priceReferenceContainer;
      priceReferenceComponentRef: ComponentRef<ReferencePriceComponent> [] = [];
      priceRefIndex: number = 0;
      componentFactory: ComponentFactory<ReferencePriceComponent> = this.resolver.resolveComponentFactory(ReferencePriceComponent);


  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private priceService: PricesRegService,
              private resolver: ComponentFactoryResolver) {

        this.PriceRegForm = fb.group({
          nrCerereInput:    {disabled: true, value: null},
          dataReg:          {disabled: true, value: new Date()},
          company:          [null, Validators.required],
          medicament:       [null, Validators.required],
          unityOfMess:      {disabled: true, value: null},
          quantity:         [null, Validators.required],
          medCode:          {disabled: true, value: null},
          proposedPrice:    [null, Validators.required],
          proposedCurrency: [null, Validators.required],
        });
  }


  ngOnInit() {
   //     this.addReferencePriceRow();

        this.subscriptions.push(
          this.priceService.generateDocNumber().subscribe(generatedNumber => {
              this.generatedDocNrSeq = generatedNumber;
              this.PriceRegForm.get('nrCerereInput').setValue(this.generatedDocNrSeq);
            },
            error => console.log(error)
          )
        );

        this.subscriptions.push(
          this.priceService.getCompanies().subscribe(companiesData => {
              this.companies = companiesData;
            },
            error => console.log(error)
        ));

      this.subscriptions.push(
          this.priceService.getCountries().subscribe(countriesData => {
                  this.countries = countriesData;
              },
              error => console.log(error)
          ));

      this.subscriptions.push(
          this.priceService.getCurrenciesShort().subscribe(currenciesData => {
                  this.currencies = currenciesData;
              },
              error => console.log(error)
          ));
  }

    // ngAfterContentInit() {
    //     alert('ngAfterContentInit');
    //     // this.footer now points to the instance of `FooterComponent`
    // }
    //
    // ngAfterViewInit() {
    //     alert('ngAfterViewInit');
    // }

    addReferencePriceRow() {
        if(this.priceRefIndex < this.MAX_REFERENCE_PRICES) {
            this.priceReferenceComponentRef[this.priceRefIndex] = this.priceReferenceContainer.createComponent(this.componentFactory);
            this.priceReferenceComponentRef[this.priceRefIndex].instance.countries = this.countries;
            this.priceReferenceComponentRef[this.priceRefIndex++].instance.currencies = this.currencies;
        }
    }

  private onCompanySelected(event) {
      this.getMedicaments(event.id);
  }

  private onMedSelected(event) {
      this.PriceRegForm.get('unityOfMess').setValue((event as Medicament).unitsOfMeasurement.description);
      this.PriceRegForm.get('medCode').setValue((event as Medicament).code);
  }


  private onRemoveMed() {
      this.PriceRegForm.get('unityOfMess').reset();
      this.PriceRegForm.get('medCode').reset();
  }


  private onRemoveCompany() {
      this.PriceRegForm.get('medicament').reset();
      this.onRemoveMed();
      this.companyMedicaments = [];
  }

  private getMedicaments(id) {
    this.PriceRegForm.controls['medicament'].reset();
    if (id !== undefined) {
      if (this.getMedSubscr !== undefined) {
          this.getMedSubscr.unsubscribe();
      }

      this.getMedSubscr = this.priceService.getCompanyMedicaments(id).subscribe(
              medicaments => this.companyMedicaments = medicaments
          );
    }
  }


    nextStep() {
        this.formSubmitted = true;
        this.priceReferenceComponentRef.forEach(form => form.instance.formSubmitted = true);

        if(this.documents.length === 0 || !this.PriceRegForm.get('medicament.company').valid || !this.PriceRegForm.get('type.id').valid || !this.PriceRegForm.get('medicament.name').valid)
        {
            return;
        }

        this.priceReferenceComponentRef.forEach(form => form.instance.formSubmitted = false);
        this.formSubmitted = false;

        this.PriceRegForm.get('endDate').setValue(new Date());
        this.PriceRegForm.get('company').setValue(this.PriceRegForm.value.medicament.company);

        let modelToSubmit : any = this.PriceRegForm.value;
        // modelToSubmit.requestHistories = [{startDate : this.PriceRegForm.get('startDate').value,endDate : this.PriceRegForm.get('endDate').value,
        //     username : this.authService.getUserName(), step : 'R' }];
        // modelToSubmit.medicament.documents = this.documents;
        //
        // this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
        //         this.router.navigate(['dashboard/module/medicament-registration/evaluate/'+data.body]);
        //     })
        // );
    }


  ngOnDestroy() {
      this.subscriptions.forEach(value => value.unsubscribe());
      this.priceReferenceComponentRef.forEach(row => row.destroy());
  }
}
