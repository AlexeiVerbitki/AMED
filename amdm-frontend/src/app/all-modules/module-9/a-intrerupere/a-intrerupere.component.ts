import {Component, OnDestroy, OnInit} from '@angular/core';
import {Document} from "../../../models/document";
import {Subscription} from "rxjs/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {AuthService} from "../../../shared/service/authetication.service";

@Component({
  selector: 'app-a-intrerupere',
  templateUrl: './a-intrerupere.component.html',
  styleUrls: ['./a-intrerupere.component.css']
})
export class AIntrerupereComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    cancelClinicalTrailForm: FormGroup;
    protected docs: Document[] = [];
    docTypes: any[];
    outDocuments: any[] = [];

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private requestService: RequestService,
              private authService: AuthService,
              private router: Router,
              private loadingService: LoaderService
              ) { }

  ngOnInit() {
      this.cancelClinicalTrailForm = this.fb.group({
          'id': [''],
          'requestNumber': [{value: '', disabled: true}],
          'startDate': [{value: '', disabled: true}],
          'endDate': [''],
          'company': [''],
          'currentStep': ['E'],
          'type': [],
          'typeCode': [''],
          'interruptionReason':[''],
          'requestHistories': [],
          'initiator':[null],
          'assignedUser':[null],
          'clinicalTrails': undefined,
      });
    this.initPage();
  }

    initPage() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                    this.cancelClinicalTrailForm.get('id').setValue(data.id);
                    this.cancelClinicalTrailForm.get('requestNumber').setValue(data.requestNumber);
                    this.cancelClinicalTrailForm.get('startDate').setValue(new Date(data.startDate));
                    this.cancelClinicalTrailForm.get('company').setValue(data.company);
                    this.cancelClinicalTrailForm.get('type').setValue(data.type);
                    this.cancelClinicalTrailForm.get('typeCode').setValue(data.type.code);
                    this.cancelClinicalTrailForm.get('initiator').setValue(data.initiator);
                    this.cancelClinicalTrailForm.get('clinicalTrails').setValue(data.clinicalTrails);

                    data.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                    this.cancelClinicalTrailForm.get('requestHistories').setValue(data.requestHistories);

                    console.log('clinicalTrailsData', this.cancelClinicalTrailForm);

                    this.docs = data.clinicalTrails.documents;
                    this.outDocuments = data.clinicalTrails.outputDocuments;
                },
                error => console.log(error)
            ))
        }))
    }

    doSubmit() {
        let formModel = this.cancelClinicalTrailForm.getRawValue();
        console.log("Submit data", formModel);

        if (this.cancelClinicalTrailForm.invalid) {
            alert('Invalid Form!!');
            console.log("Not submitted data", formModel);
            return;
        }

        this.loadingService.show();

        formModel.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
        formModel.requestHistories.push({
            startDate: formModel.requestHistories[formModel.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'C'
        });
        formModel.clinicalTrails.documents = this.docs;

        console.log("evaluareaPrimaraObjectLet", JSON.stringify(formModel));

        formModel.currentStep = 'AP';
        formModel.assignedUser = this.authService.getUserName();
        formModel.endDate = new Date();
        this.subscriptions.push(
            this.requestService.addClinicalTrailRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/']);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
                console.log(error)
            })
        )
    }

    requestNL(){


    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

}
