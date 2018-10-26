import { Component, OnInit } from '@angular/core';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs/index";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {MedicamentService} from "../../../shared/service/medicament.service";

import {debounceTime} from 'rxjs/operators';
import {AdministrationService} from "../../../shared/service/administration.service";
import {Receipt} from "../../../models/receipt";
import {PaymentOrder} from "../../../models/paymentOrder";
import {AuthService} from "../../../shared/service/authetication.service";
import {MatRadioChange} from "@angular/material";
import {MatRadioButton} from "@angular/material/radio";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
  selector: 'app-a-evaluarea-primara',
  templateUrl: './a-evaluarea-primara.component.html',
  styleUrls: ['./a-evaluarea-primara.component.css']
})
export class AEvaluareaPrimaraComponent implements OnInit {
    private readonly SEARCH_STRING_LENGTH: number = 2;
    private readonly CURRENT_STEP: string = 'E';

    private subscriptions: Subscription[] = [];
    evaluateClinicalTrailForm: FormGroup;
    docs: Document[] = [];

    //Treatments
    treatmentId: number;
    treatmentList : any[] = [
        {'id':1, 'description':'Unicentric', 'code':'U'},
        {'id':2, 'description':'Multicentric', 'code':'M'}
    ];

    //Provenances
    provenanceId : number;
    provenanceList : any[] = [
        {'id':3, 'description':'Național', 'code':'N'},
        {'id':4, 'description':'Internațional', 'code':'I'}
    ];

    medicamentForm: FormGroup;
    medicamentSearches: any[] = [];
    referenceProductFormn: FormGroup;
    referenceProductSearches: any[] = [];

    //Investigators controls
    addInvestigatorForm: FormGroup;
    investigatorsList: any[] = [];

    //Payments control
    receiptsList: Receipt[] = [];
    paymentOrdersList: PaymentOrder[] = [];
    paymentTotal: number = 0;

    docTypes: any[];

    disabledState: boolean = false;


  constructor(private fb: FormBuilder,
              private requestService : RequestService,
              private medicamentService: MedicamentService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private documentService: DocumentService,
              private administrationService: AdministrationService,
              private authService : AuthService,) {
      this.evaluateClinicalTrailForm = fb.group({
          'id':[''],
          'requestNumber': {value:'', disabled: true},
          'startDate': {value: new Date(), disabled: true},
          'company': [''],
          'currentStep' : [this.CURRENT_STEP],
          'type': [''],
          'typeCode': [''],
          'clinicalTrails': this.fb.group({
              'id':[''],
              'documents': [],
              'title':['title', Validators.required],
              'treatment' :  ['',  Validators.required],
              'provenance' : ['',  Validators.required],

              'sponsor':['sponsor', Validators.required],
              'phase' : ['faza', Validators.required],
              'eudraCtNr' : ['eudraCtNr', Validators.required],
              'code' : ['code', Validators.required],
              'medicalInstitution' : ['medicalInstitution', Validators.required],
              'trialPopulation' : ['5446', [Validators.required, Validators.pattern("^[0-9]*$")]],
              'medicament':  [],
              'referenceProduct': [],
              'investigators':[],
              'status' : ['P'],
              'receipts': [],
              'paymentOrders':[],
              'medicamentCommitteeOpinion':[],
              'eticCommitteeOpinion':[],
              'approvalOrder':[],
              'pharmacovigilance':[],
              'openingDeclarationId':[]
          }),

          'requestHistories': []
      });

      this.medicamentForm = this.fb.group({
          'searchField':[''],
          'producer':[{value:'', disabled: true}],
          'dose':[{value:'', disabled: true}],
          'group':[{value:'', disabled: true}],
          'pharmaceuticalForm':[{value:'', disabled: true}],
          'administeringMode':[{value:'', disabled: true}],
      }),

      this.referenceProductFormn = this.fb.group({
          'searchField':[''],
          'producer':[{value:'', disabled: true}],
          'dose':[{value:'', disabled: true}],
          'group':[{value:'', disabled: true}],
          'pharmaceuticalForm':[{value:'', disabled: true}],
          'administeringMode':[{value:'', disabled: true}],
      }),

      this.addInvestigatorForm = this.fb.group({
          'id':[null],
          'clinicalTrailsId':[null],
          'firstName':['', Validators.required],
          'lastName':['', Validators.required],
          'title':['', Validators.required]
      });
  }

  ngOnInit() {

      this.initPage();
      this.controlMedicamentsSearch();
      this.controlReferenceProductSearch();
      this.cleanMedicamentFormGroup();
      this.cleanReferenceProductFormGroup();

      this.subscriptions.push(
          this.administrationService.getAllDocTypes().subscribe(data => {
                  this.docTypes = data;
                  this.docTypes = this.docTypes.filter(r => r.category === 'DD');
              },
              error => console.log(error)
          )
      );

  }

  initPage(){
      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
          this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                  this.evaluateClinicalTrailForm.get('id').setValue(data.id);
                  this.evaluateClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                  this.evaluateClinicalTrailForm.get('company').setValue(data.company);
                  this.evaluateClinicalTrailForm.get('type').setValue(data.type);
                  this.evaluateClinicalTrailForm.get('typeCode').setValue(data.type.code);
                  this.evaluateClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);

                  this.evaluateClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);
                  this.evaluateClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                      data.clinicalTrails.treatment==null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                  this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(
                      data.clinicalTrails.provenance==null ? this.provenanceList[0] : data.clinicalTrails.provenance);

                  if(data.clinicalTrails.medicament !== null){
                      this.medicamentForm.get('searchField').setValue(data.clinicalTrails.medicament.name);
                      this.fillMedicamentData(data.clinicalTrails.medicament);
                  }

                  if(data.clinicalTrails.referenceProduct !== null){
                      this.referenceProductFormn.get('searchField').setValue(data.clinicalTrails.referenceProduct.name);
                      this.fillReferenceProductData(data.clinicalTrails.referenceProduct);
                  }

                  this.investigatorsList = data.clinicalTrails.investigators;
                  this.docs = data.clinicalTrails.documents;
                  this.docs.forEach(doc => doc.isOld = true);

                  this.receiptsList = data.clinicalTrails.receipts;
                  this.paymentOrdersList = data.clinicalTrails.paymentOrders;
              },
              error => console.log(error)
          ))
      }))
  }

    onTreatmentChange(mrChange: MatRadioChange) {
        this.evaluateClinicalTrailForm.get('clinicalTrails.treatment').setValue(this.treatmentList[mrChange.value-1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.evaluateClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[mrChange.value-3]);
    }

    controlMedicamentsSearch(){
      const searchConstrol = this.medicamentForm.get('searchField');
      searchConstrol.valueChanges
          .pipe(debounceTime(400))
          .subscribe(changedValue => {
              if(changedValue.length > this.SEARCH_STRING_LENGTH) {
                  this.subscriptions.push(this.medicamentService.getMedicamentNamesList(changedValue).subscribe(data => {
                          this.medicamentSearches = data;
                      },
                      error => console.log(error)
                  ))
              }
          })
  }

  controlReferenceProductSearch(){
      const searchConstrol = this.referenceProductFormn.get('searchField');
      searchConstrol.valueChanges
          .pipe(debounceTime(400))
          .subscribe(changedValue => {
              if(changedValue.length > this.SEARCH_STRING_LENGTH){
                  this.subscriptions.push(this.medicamentService.getMedicamentNamesList(changedValue).subscribe(data => {
                          this.referenceProductSearches = data;
                      },
                      error => console.log(error)
                  ))
              }
          })
  }

    onMedicamentsSearchSelect(option) {
        this.subscriptions.push(this.medicamentService.getMedicamentById(option.id).subscribe(data => {
            this.fillMedicamentData(data);
            },
            error => console.log(error)
        ))
    }

    onReferenceProductSearchSelect(option) {
        this.subscriptions.push(this.medicamentService.getMedicamentById(option.id).subscribe(data => {
                this.fillReferenceProductData(data);
            },
            error => console.log(error)
        ))
    }

    fillMedicamentData(data:any ){
        this.medicamentForm.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.medicamentForm.get('dose').setValue('250Mg');
        this.medicamentForm.get('group').setValue('antiinflamatoare');
        this.medicamentForm.get('pharmaceuticalForm').setValue('comprimate ');
        this.medicamentForm.get('administeringMode').setValue('oral ');
        this.evaluateClinicalTrailForm.get('clinicalTrails.medicament').setValue(data);
    }

    fillReferenceProductData(data:any){
        this.referenceProductFormn.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.referenceProductFormn.get('dose').setValue('250Mg');
        this.referenceProductFormn.get('group').setValue('antiinflamatoare');
        this.referenceProductFormn.get('pharmaceuticalForm').setValue('comprimate ');
        this.referenceProductFormn.get('administeringMode').setValue('oral ');
        this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct').setValue(data);
    }


    cleanMedicamentFormGroup() {
        const searchConstrol = this.medicamentForm.get('searchField');
        searchConstrol.valueChanges
            .subscribe(changedValue => {
                this.medicamentForm.get('producer').reset();
                this.medicamentForm.get('dose').reset();
                this.medicamentForm.get('group').reset();
                this.medicamentForm.get('pharmaceuticalForm').reset();
                this.medicamentForm.get('administeringMode').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament').setValue(null);
                this.medicamentSearches = [];
            })
    }

    cleanReferenceProductFormGroup() {
        const searchConstrol = this.referenceProductFormn.get('searchField');
        searchConstrol.valueChanges
            .subscribe(changedValue => {
                this.referenceProductFormn.get('producer').reset();
                this.referenceProductFormn.get('dose').reset();
                this.referenceProductFormn.get('group').reset();
                this.referenceProductFormn.get('pharmaceuticalForm').reset();
                this.referenceProductFormn.get('administeringMode').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct').setValue(null);
                this.referenceProductSearches = [];
            })
    }

    addInvestigator(){
      if(this.addInvestigatorForm.invalid)
      {
          alert('add investigator invalid');
          return;
      }
      this.addInvestigatorForm.get('clinicalTrailsId').setValue(this.evaluateClinicalTrailForm.get('clinicalTrails.id').value);
      this.investigatorsList.push(this.addInvestigatorForm.value);
      this.addInvestigatorForm.reset();

    }

    deleteInvestigator(investigator) {
      var intdexToDeelte = this.investigatorsList.indexOf(investigator);
      this.investigatorsList.splice(intdexToDeelte, 1);
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    onSubmit() {
      let formModel = this.evaluateClinicalTrailForm.getRawValue();
      if(formModel.invalid || this.paymentTotal<0){
          alert('Invalid Form!!')
          return;
      }

      formModel.requestHistories.push({
          startDate : formModel.startDate,
          endDate : new Date(),
          username : this.authService.getUserName(),
          step : 'E'
        });
      formModel.clinicalTrails.documents = this.docs;
      formModel.clinicalTrails.investigators = this.investigatorsList;
      formModel.clinicalTrails.receipts = this.receiptsList;
      formModel.clinicalTrails.paymentOrders = this.paymentOrdersList;



        let docToGenerate: any;
        this.disabledState = true;
        this.documentService.generateDistributionDisposition(formModel.requestNumber).subscribe(res => {
            docToGenerate = {
                name: res.substring(res.lastIndexOf('/') + 1),
                docType : this.docTypes[0],
                date: new Date(),
                path: res
            };
            formModel.clinicalTrails.documents.push(docToGenerate);

            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
            this.disabledState = true;
                console.log("evaluareaPrimaraObjectLet", JSON.stringify(formModel));
                this.router.navigate(['/dashboard/module/clinic-studies/analiza/'+data.body]);

            }, error => {
                this.disabledState = false;
                let intdexToDelete = formModel.clinicalTrails.documents.indexOf(docToGenerate);
                formModel.clinicalTrails.documents.splice(intdexToDelete, 1);
                console.log(error);
            });

            this.disabledState = true;
        },  error => {
            this.disabledState = true;
            console.log(error);
        } );


    }

}
