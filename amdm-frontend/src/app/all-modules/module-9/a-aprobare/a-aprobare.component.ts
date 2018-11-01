import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Document} from "../../../models/document";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";

@Component({
    selector: 'app-a-aprobare',
    templateUrl: './a-aprobare.component.html',
    styleUrls: ['./a-aprobare.component.css']
})
export class AAprobareComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    approveClinicalTrailForm: FormGroup;
    protected docs: Document[] = [];

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService : RequestService) {

    }

    ngOnInit() {
        this.approveClinicalTrailForm = this.fb.group({
            'id':[''],
            'requestNumber': [{value:'', disabled:true}],
            'startDate': [{value:'', disabled:true}],
            'company': [''],
            'currentStep' : ['E'],
            'type':[],
            'typeCode': [''],
            'requestHistories': [],
            'clinicalTrails': undefined
        });
        this.initPage();
    }

    initPage(){
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    console.log('clinicalTrailsData',data);

                    this.approveClinicalTrailForm.get('id').setValue(data.id);
                    this.approveClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.approveClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.approveClinicalTrailForm.get('company').setValue(data.company);
                    this.approveClinicalTrailForm.get('type').setValue(data.type);
                    this.approveClinicalTrailForm.get('typeCode').setValue(data.type.code);

                    data.requestHistories.sort((one,two)=> (one.id > two.id ? 1 : -1));
                    this.approveClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);

                    this.approveClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);
                    console.log('clinicalTrailsForm', this.approveClinicalTrailForm);

                    this.docs = data.clinicalTrails.documents;
                },
                error => console.log(error)
            ))
        }))
    }

    onSubmit() {

    }

    interruptProcess(){

    }

}
