import { Component, OnInit } from '@angular/core';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../shared/service/request.service";

@Component({
  selector: 'app-a-evaluarea-primara',
  templateUrl: './a-evaluarea-primara.component.html',
  styleUrls: ['./a-evaluarea-primara.component.css']
})
export class AEvaluareaPrimaraComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    evaluateClinicalTrailForm: FormGroup;
    docs: Document[] = [];
    companyName: string = '';

  constructor(private fb: FormBuilder,
              private requestService : RequestService,
              private activatedRoute: ActivatedRoute) {
      this.evaluateClinicalTrailForm = fb.group({
          'requestNumber': [''],
          'startDate': [''],
          'company': [''],
          'clinicalTrails': this.fb.group({
              'title':['title'],
              'treatmentId' : ['1'],
              'provenanceId' : ['4'],
              'phase' : ['faza', Validators.required],
              'eudraCtNr' : ['eudraCtNr', Validators.required],
              'code' : ['code', Validators.required],
              'medicalInstitution' : ['medicalInstitution', Validators.required],
              'trialPopulation' : ['5446', [Validators.required, Validators.pattern("^[0-9]*$")]],


              'status' : ['P'],
              'currentStep' : ['E']
          }),

      })
  }

  ngOnInit() {
      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
          this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
              this.evaluateClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
              this.evaluateClinicalTrailForm.get('startDate').setValue(data.startDate);
              this.evaluateClinicalTrailForm.get('company').setValue(data.company);
              this.docs = data.clinicalTrails.documents;
              this.companyName=data.company.name;
              console.log(data);
              console.log(this.evaluateClinicalTrailForm);
          }))
      }))
  }

}
