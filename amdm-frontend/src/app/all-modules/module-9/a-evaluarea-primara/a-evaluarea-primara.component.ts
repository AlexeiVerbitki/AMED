import { Component, OnInit } from '@angular/core';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";
import {MedicamentService} from "../../../shared/service/medicament.service";

import {debounceTime} from 'rxjs/operators';
import {AdministrationService} from "../../../shared/service/administration.service";

@Component({
  selector: 'app-a-evaluarea-primara',
  templateUrl: './a-evaluarea-primara.component.html',
  styleUrls: ['./a-evaluarea-primara.component.css']
})
export class AEvaluareaPrimaraComponent implements OnInit {
    private readonly SEARCH_STRING_LENGTH: number = 2;

    private subscriptions: Subscription[] = [];
    evaluateClinicalTrailForm: FormGroup;
    docs: Document[] = [];

    medicamentSearches: any[] = [];
    referenceProductSearches: any[] = [];

    //Investigators controls
    addInvestigatorForm: FormGroup;
    // firstName: string = '';
    // lastName: string = '';
    // title: string = '';
    investigatorsList: any[] = [];

    //Receipt controls
    addReceiptForm: FormGroup;
    name: string = '';
    summ: number;
    receiptsList: any[] = [];

  constructor(private fb: FormBuilder,
              private requestService : RequestService,
              private medicamentService: MedicamentService,
              private activatedRoute: ActivatedRoute,
              private administrationService: AdministrationService) {
      this.evaluateClinicalTrailForm = fb.group({
          'requestNumber': [''],
          'startDate': [''],
          'company': [''],
          'clinicalTrails': this.fb.group({
              'title':['title'],
              'treatmentId' : ['1'],
              'provenanceId' : ['4'],
              'sponsor':['sponsor'],
              'phase' : ['faza', Validators.required],
              'eudraCtNr' : ['eudraCtNr', Validators.required],
              'code' : ['code', Validators.required],
              'medicalInstitution' : ['medicalInstitution', Validators.required],
              'trialPopulation' : ['5446', [Validators.required, Validators.pattern("^[0-9]*$")]],
              'medicament': this.fb.group({
                  'searchField':[''],
                  'producer':[{value:'', disabled: true}],
                  'dose':[{value:'', disabled: true}],
                  'group':[{value:'', disabled: true}],
                  'pharmaceuticalForm':[{value:'', disabled: true}],
                  'administeringMode':[{value:'', disabled: true}],
              }),
              'referenceProduct': this.fb.group({
                  'searchField':[''],
                  'producer':[{value:'', disabled: true}],
                  'dose':[{value:'', disabled: true}],
                  'group':[{value:'', disabled: true}],
                  'pharmaceuticalForm':[{value:'', disabled: true}],
                  'administeringMode':[{value:'', disabled: true}],
              }),
              'investigators':[],

              'status' : ['P'],
              'currentStep' : ['E'],
          }),
      });

      this.addInvestigatorForm = this.fb.group({
          'id':[''],
          'firstName':['', Validators.required],
          'clinicalTrailsId':[''],
          'lastName':['', Validators.required],
          'title':['', Validators.required]
      });

      this.addReceiptForm = this.fb.group({
          'id':[''],
          'emissionDate': [''],
          'name':['', Validators.required],
          'summ':[,Validators.required]
      })
  }

  ngOnInit() {

      this.initPage();
      this.controlMedicamentsSearch();
      this.controlReferenceProductSearch();
      this.cleanMedicamentFormGroup();
      this.cleanReferenceProductFormGroup();

  }

  initPage(){
      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
          this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                  console.log(data);
                  this.evaluateClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                  this.evaluateClinicalTrailForm.get('startDate').setValue(data.startDate);
                  this.evaluateClinicalTrailForm.get('company').setValue(data.company);

                  this.investigatorsList = data.clinicalTrails.investigators;
                  this.docs = data.clinicalTrails.documents;
                  this.docs.forEach(doc => doc.isOld = true);
              },
              error => console.log(error)
          ))
      }))
  }

  controlMedicamentsSearch(){
      const searchConstrol = this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.searchField');
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
      const searchConstrol = this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.searchField');
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
                console.log('getMedicamentById',data);
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.producer').setValue(data.manufactureId === null ? '' : data.manufactureId.longDescription);
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.dose').setValue('250Mg');
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.group').setValue('antiinflamatoare');
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.pharmaceuticalForm').setValue('comprimate ');
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.administeringMode').setValue('oral ');
            },
            error => console.log(error)
        ))
    }

    onReferenceProductSearchSelect(option) {
        this.subscriptions.push(this.medicamentService.getMedicamentById(option.id).subscribe(data => {
                console.log('getMedicamentById',data);
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.producer').setValue(data.manufactureId === null ? '' : data.manufactureId.longDescription);
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.dose').setValue('250Mg');
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.group').setValue('antiinflamatoare');
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.pharmaceuticalForm').setValue('comprimate ');
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.administeringMode').setValue('oral ');
            },
            error => console.log(error)
        ))
    }

    cleanMedicamentFormGroup() {
        const searchConstrol = this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.searchField');
        searchConstrol.valueChanges
            .subscribe(changedValue => {
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.producer').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.dose').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.group').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.pharmaceuticalForm').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.medicament.administeringMode').reset();
                this.medicamentSearches = [];
            })
    }

    cleanReferenceProductFormGroup() {
        const searchConstrol = this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.searchField');
        searchConstrol.valueChanges
            .subscribe(changedValue => {
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.producer').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.dose').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.group').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.pharmaceuticalForm').reset();
                this.evaluateClinicalTrailForm.get('clinicalTrails.referenceProduct.administeringMode').reset();
                this.referenceProductSearches = [];
            })
    }

    addInvestigator(){
      if(this.addInvestigatorForm.invalid)
      {
          alert('add investigator invalid');
          return;
      }
      console.log('Investigator to load', this.addInvestigatorForm.value);

      this.investigatorsList.push(this.addInvestigatorForm.value);
      this.addInvestigatorForm.reset();
      console.log(this.evaluateClinicalTrailForm.value);
    }

    deleteInvestigator(investigator) {
      var intdexToDeelte = this.investigatorsList.indexOf(investigator);
      this.investigatorsList.splice(intdexToDeelte, 1);
    }

    addReceipt() {
        if(this.addReceiptForm.invalid)
        {
            alert('add receipt form invalid');
            return;
        }

        this.administrationService.generateReceiptNr().subscribe(data => {
            this.addReceiptForm.get('id').setValue(data);
            this.addReceiptForm.get('emissionDate').setValue(new Date());
            this.receiptsList.push(this.addReceiptForm.value);
            },
            error => console.log(error)
        );
    }

    deleteReceipt(receipt){
        var intdexToDelete = this.receiptsList.indexOf(receipt);
        this.receiptsList.splice(intdexToDelete, 1);
    }

}
