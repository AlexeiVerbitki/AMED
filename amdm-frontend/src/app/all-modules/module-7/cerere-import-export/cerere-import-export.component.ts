import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select} from '../../../models/select';
import {Document} from "../../../models/document";
import {Observable, Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {map, startWith} from "rxjs/operators";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {MedicamentTypeService} from "../../../shared/service/medicamenttype.service";
import {MedicamentGroupService} from "../../../shared/service/medicamentgroup.service";
import {PharmaceuticalFormsService} from "../../../shared/service/pharmaceuticalforms.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
  selector: 'app-cerere-import-export',
  templateUrl: './cerere-import-export.component.html',
  styleUrls: ['./cerere-import-export.component.css']
})
export class CerereImportExportComponent implements OnInit {

  cerereImpExpForm: FormGroup;
  documents: Document [] = [];
  formSubmitted: boolean;
  currentDate: Date;
  private subscriptions: Subscription[] = [];
  generatedDocNrSeq: number;
  companies: any[];
  filteredOptions: Observable<any[]>;
  isWrongValueCompany: boolean;
  medicamentTypes: any[];
  medicamentGroups: any[];
  pharmaceuticalForms: any[];
  unitsOfMeasurement: any[];
  paymentTotal : number;
  paymentOrdersList: PaymentOrder[] = [];
  receiptsList: Receipt[] = [];
  docTypes: any[];
  activeSubstancesTable: any[] = [];

  authorizationTypes: Select[] = [
    {value: 'none', viewValue: '(None)'},
    {value: 'Import', viewValue: 'Import'},
    {value: 'Export', viewValue: 'Export'},
  ];

    constructor(private fb: FormBuilder, private administrationService: AdministrationService, private medicamentService: MedicamentService,
              private medicamentTypeService: MedicamentTypeService, private medicamentGroupService: MedicamentGroupService,
              private pharmaceuticalFormsService: PharmaceuticalFormsService, private activatedRoute: ActivatedRoute, private router: Router,
              private requestService : RequestService, private authService : AuthService, private documentService: DocumentService) {
    this.cerereImpExpForm = fb.group({
        'id': [],
        'data': {disabled: true, value: new Date()},
        'startDate': [],
        'requestNumber': [null, Validators.required],
        'company': [''],
        'currentStep' : ['E'],
        'documents': [],
        'medicament':
            fb.group({
                'id': [],
                'name': ['', Validators.required],
                'company': ['', Validators.required],
                'companyValue': [''],
                'pharmaceuticalForm': [null, Validators.required],
                'documents': [],
                'unitsQuantity': [null, Validators.required],
                'unitsOfMeasurement': [null, Validators.required],
                'dose': [null, Validators.required],
                'serialNr': [null, Validators.required],
                'medicamentType': [],
                'activeSubstances': [],
                'group': []
            }),
        'requestHistories': [],
        'type': [],
        'typeValue': {disabled: true, value: null},
        //'activeSubstance': [],
        //'activeSubstanceQuantity': [null],
        //'activeSubstanceUnit': [null]
    });
  }

  ngOnInit() {

      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
              this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                      this.cerereImpExpForm.get('id').setValue(data.id);
                      this.cerereImpExpForm.get('medicament.id').setValue(data.medicament.id);
                      this.cerereImpExpForm.get('medicament.name').setValue(data.medicament.name);
                      this.cerereImpExpForm.get('startDate').setValue(data.startDate);
                      this.cerereImpExpForm.get('requestNumber').setValue(data.requestNumber);
                      this.cerereImpExpForm.get('medicament.documents').setValue(data.medicament.documents);
                      this.cerereImpExpForm.get('medicament.company').setValue(data.medicament.company);
                      this.cerereImpExpForm.get('medicament.companyValue').setValue(data.medicament.company.name);
                      this.cerereImpExpForm.get('requestHistories').setValue(data.requestHistories);
                      this.cerereImpExpForm.get('type').setValue(data.type);
                      this.cerereImpExpForm.get('typeValue').setValue(data.type.code);
                      this.cerereImpExpForm.get('company').setValue(data.medicament.company);
                      this.cerereImpExpForm.get('medicament.unitsQuantity').setValue(data.medicament.unitsQuantity);
                      this.cerereImpExpForm.get('medicament.dose').setValue(data.medicament.dose);
                      this.cerereImpExpForm.get('medicament.serialNr').setValue(data.medicament.serialNr);
                      this.cerereImpExpForm.get('medicament.medicamentType').setValue(data.medicament.medicamentType);
                      this.cerereImpExpForm.get('medicament.group').setValue(data.medicament.group);
                      this.cerereImpExpForm.get('medicament.pharmaceuticalForm').setValue(data.medicament.pharmaceuticalForm);
                      this.cerereImpExpForm.get('medicament.unitsOfMeasurement').setValue(data.medicament.unitsOfMeasurement);
                      this.cerereImpExpForm.get('medicament.activeSubstances').setValue(data.medicament.activeSubstances);
                      this.documents = data.medicament.documents;
                      this.documents.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
                      this.activeSubstancesTable = data.medicament.activeSubstances;
                      let xs = this.documents;
                      xs = xs.map(x => {
                          x.isOld = true;
                          return x;
                      });
                  })
              );
          })
      );

      this.subscriptions.push(
          this.administrationService.generateDocNr().subscribe(data => {
                  this.generatedDocNrSeq = data;
                  this.cerereImpExpForm.get('requestNumber').setValue(this.generatedDocNrSeq);
              },
              error => console.log(error)
          )
      );

      this.subscriptions.push(
          this.administrationService.getAllCompanies().subscribe(data => {
                  this.companies = data;
                  this.filteredOptions = this.cerereImpExpForm.get('company').valueChanges
                      .pipe(
                          startWith<string | any>(''),
                          map(value => typeof value === 'string' ? value : value.name),
                          map(name => this._filter(name))
                      );
              },
              error => console.log(error)
          )
      );

      this.subscriptions.push(
          this.medicamentTypeService.getMedicamentTypesList().subscribe(data => {
                  this.medicamentTypes = data;
              },
              error => console.log(error)
          )
      );

      this.subscriptions.push(
          this.medicamentGroupService.getMedicamentGroupList().subscribe(data => {
                  this.medicamentGroups = data;
              },
              error => console.log(error)
          )
      );

      this.subscriptions.push(
          this.pharmaceuticalFormsService.getPharmaceuticalFormsList().subscribe(data => {
                  this.pharmaceuticalForms = data;
              },
              error => console.log(error)
          )
      );

      this.subscriptions.push(
          this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                  this.unitsOfMeasurement = data;
              },
              error => console.log(error)
          )
      );

      this.subscriptions.push(
          this.administrationService.getAllDocTypes().subscribe(data => {
                  this.docTypes = data;
                  this.docTypes = this.docTypes.filter(r => r.category === 'DD');
              },
              error => console.log(error)
          )
      );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.companies.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  saveRequest() {

      this.formSubmitted = true;

      if (this.cerereImpExpForm.invalid || this.paymentTotal<0) {
          return;
      }

      this.formSubmitted = false;

      this.cerereImpExpForm.get('company').setValue(this.cerereImpExpForm.value.company);

      let modelToSubmit : any = this.cerereImpExpForm.value;

      modelToSubmit.requestHistories.push({
          startDate: this.cerereImpExpForm.get('data').value, endDate: new Date(),
          username: this.authService.getUserName(), step: 'E'
      });

      modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
      modelToSubmit.medicament.receipts = this.receiptsList;

      console.log(modelToSubmit);

      this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
              this.router.navigate(['dashboard/module']);
          }, error => console.log(error))
      );

  }

  paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
  }

}