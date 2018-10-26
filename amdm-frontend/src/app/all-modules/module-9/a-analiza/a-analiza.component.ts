import { Component, OnInit } from '@angular/core';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs/index";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {MatRadioChange} from "@angular/material";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";

@Component({
  selector: 'app-a-analiza',
  templateUrl: './a-analiza.component.html',
  styleUrls: ['./a-analiza.component.css']
})
export class AAnalizaComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    analyzeClinicalTrailForm: FormGroup;
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

    isWaitingStep: boolean = false;

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

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private medicamentService: MedicamentService,
              private requestService : RequestService) {

      this.analyzeClinicalTrailForm = this.fb.group({
          'id':[''],
          'requestNumber': [{value:'', disabled:true}],
          'startDate': [{value:'', disabled:true}],
          'company': [''],
          'currentStep' : ['E'],
          'type':[],
          'typeCode': [''],
          'clinicalTrails': this.fb.group({
              'id':[''],
              'documents': [],
              'title':[''],
              'treatment' :  ['',  Validators.required],
              'provenance' : ['',  Validators.required],

              'sponsor':['sponsor'],
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
          'searchField':[{value:'', disabled: true}],
          'producer':[{value:'', disabled: true}],
          'dose':[{value:'', disabled: true}],
          'group':[{value:'', disabled: true}],
          'pharmaceuticalForm':[{value:'', disabled: true}],
          'administeringMode':[{value:'', disabled: true}],
      });

      this.referenceProductFormn = this.fb.group({
          'searchField':[''],
          'producer':[{value:'', disabled: true}],
          'dose':[{value:'', disabled: true}],
          'group':[{value:'', disabled: true}],
          'pharmaceuticalForm':[{value:'', disabled: true}],
          'administeringMode':[{value:'', disabled: true}],
      });

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

    // let clinicalTrailFGroup = <FormArray>this.analyzeClinicalTrailForm.get('clinicalTrails');
    //   for (var control in clinicalTrailFGroup.controls) {
    //       console.log(control);
    //       clinicalTrailFGroup.controls[control].disable();
    //   }
  }

  onSubmit() {

  }

    initPage(){
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    this.analyzeClinicalTrailForm.get('id').setValue(data.id);
                    this.analyzeClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.analyzeClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.analyzeClinicalTrailForm.get('company').setValue(data.company);
                    this.analyzeClinicalTrailForm.get('type').setValue(data.type);
                    this.analyzeClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.analyzeClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);
                    this.analyzeClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    this.analyzeClinicalTrailForm.get('clinicalTrails.treatment').setValue(
                        data.clinicalTrails.treatment==null ? this.treatmentList[0] : data.clinicalTrails.treatment);
                    this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(
                        data.clinicalTrails.provenance==null ? this.provenanceList[0] : data.clinicalTrails.provenance);

                    this.docs = data.clinicalTrails.documents;
                    //this.docs.forEach(doc => doc.isOld = true);

                    if(data.clinicalTrails.medicament !== null){
                        this.medicamentForm.get('searchField').setValue(data.clinicalTrails.medicament.name);
                        this.fillMedicamentData(data.clinicalTrails.medicament);
                    }

                    this.investigatorsList = data.clinicalTrails.investigators;
                    this.receiptsList = data.clinicalTrails.receipts;
                    this.paymentOrdersList = data.clinicalTrails.paymentOrders;
                },
                error => console.log(error)
            ))
        }))
    }

    onTreatmentChange(mrChange: MatRadioChange) {
        this.analyzeClinicalTrailForm.get('clinicalTrails.treatment').setValue(this.treatmentList[mrChange.value-1]);
    }

    onProvenanceChange(mrChange: MatRadioChange) {
        this.analyzeClinicalTrailForm.get('clinicalTrails.provenance').setValue(this.provenanceList[mrChange.value-3]);
    }

    fillMedicamentData(data:any ){
        this.medicamentForm.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.medicamentForm.get('dose').setValue('250Mg');
        this.medicamentForm.get('group').setValue('antiinflamatoare');
        this.medicamentForm.get('pharmaceuticalForm').setValue('comprimate ');
        this.medicamentForm.get('administeringMode').setValue('oral ');
        this.analyzeClinicalTrailForm.get('clinicalTrails.medicament').setValue(data);
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

    fillReferenceProductData(data:any){
        this.referenceProductFormn.get('producer').setValue(data.manufacture === null ? '' : data.manufacture.longDescription);
        this.referenceProductFormn.get('dose').setValue('250Mg');
        this.referenceProductFormn.get('group').setValue('antiinflamatoare');
        this.referenceProductFormn.get('pharmaceuticalForm').setValue('comprimate ');
        this.referenceProductFormn.get('administeringMode').setValue('oral ');
        this.analyzeClinicalTrailForm.get('clinicalTrails.referenceProduct').setValue(data);
    }

    addInvestigator(){
        if(this.addInvestigatorForm.invalid)
        {
            alert('add investigator invalid');
            return;
        }
        this.addInvestigatorForm.get('clinicalTrailsId').setValue(this.analyzeClinicalTrailForm.get('clinicalTrails.id').value);
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

    disableEnableForm(){
      this.isWaitingStep = !this.isWaitingStep;
    }

}
