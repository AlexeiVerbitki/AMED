import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from "rxjs/index";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Document} from "../../../models/document";
import {AuthService} from "../../../shared/service/authetication.service";
import {RequestService} from "../../../shared/service/request.service";

@Component({
    selector: 'app-reg-cerere',
    templateUrl: './reg-cerere.component.html',
    styleUrls: ['./reg-cerere.component.css']
})
export class RegCerereComponent implements OnInit {

    generatedDocNrSeq: number;
    registerClinicalTrailForm: FormGroup;
    private subscriptions: Subscription[] = [];
    solicitantCompanyList: Observable<any[]>;
    private  submitted: boolean = false;
    docs : Document [] = [];
    currentDate: Date;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private requestService : RequestService,
              private router: Router,
              private authService : AuthService,
              private administrationService: AdministrationService) {
  }

  ngOnInit() {
    this.registerClinicalTrailForm = this.fb.group({
        'requestNumber': [null],
        'regDate':{disabled: true, value: new Date()},
        'startDate': [new Date()],
        'currentStep' : ['R'],
        'company': ['', Validators.required],
        'flowControl':['CLAP', Validators.required],
        'clinicalTrails': this.fb.group({
            'status' : ['P']
            }),
        'type':
            this.fb.group({
                'id' : ['']})
    });

    this.currentDate = new Date();
    this.loadSolicitantCompanyList();
    this.generateDocNr();
  }

  loadSolicitantCompanyList() {
      this.subscriptions.push(
          this.administrationService.getAllCompanies().subscribe(data=> {
                  this.solicitantCompanyList = data;
              },
              error => console.log(error)
          )
      )
  }

  generateDocNr() {
      this.subscriptions.push(
          this.administrationService.generateDocNr().subscribe(data => {
                  this.generatedDocNrSeq = data;
                  this.registerClinicalTrailForm.get('requestNumber').setValue(this.generatedDocNrSeq);
              },
              error => console.log(error)
          )
      );
  }


    onSubmit() {

      if(this.registerClinicalTrailForm.invalid) {
          alert('Invalid Form!!')
          return;
      }

      let formModel = this.registerClinicalTrailForm.value;

      if(formModel.flowControl === 'CLAP')
      {
          formModel.type.id='3';

          formModel.requestHistories = [{
              startDate : formModel.startDate,
              endDate : new Date(),
              username : this.authService.getUserName(),
              step : formModel.currentStep
          }];

          formModel.clinicalTrails.documents = this.docs;
          console.log("regCerereObject", JSON.stringify(formModel));

          this.subscriptions.push(this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                    console.log("data from backend", data);
                  this.router.navigate(['/dashboard/module/clinic-studies/evaluate/'+data.body]);
              })
          );
      }
      else if(formModel.flowControl === 'CLPSC')
      {
          this.registerClinicalTrailForm.get('type.id').setValue('4')
          console.log('Going to -> Aprobarea amendamentelor la Protocoalele Studiilor Clinice la medicamente')
      }
      else if(formModel.flowControl === 'CLNP')
      {
          console.log('Going to -> Înregistrarea Notificărilor privind Protocolul studiului clinic cu medicamente')
      }
      else if(formModel.flowControl === 'CLISP')
      {
          console.log('Going to -> Înregistrarea informației privind siguranța produsului de investigație clinică')
      }
      else
      {
          console.log('Going to -> HZ')
      }
    }

}
