import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from "../../../shared/service/administration.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Document} from "../../../models/document";
import {Subscription} from "rxjs";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
  selector: 'app-cerere-dub-autor-act',
  templateUrl: './cerere-dub-autor-act.component.html',
  styleUrls: ['./cerere-dub-autor-act.component.css']
})
export class CerereDubAutorActComponent implements OnInit {

  cerereDupAutorForm: FormGroup;
  documents: Document [] = [];
  docTypes: any[];
  formSubmitted: boolean;
  currentDate: Date;
  generatedDocNrSeq: number;
  private subscriptions: Subscription[] = [];
  paymentOrdersList: PaymentOrder[] = [];
  receiptsList: Receipt[] = [];
  paymentTotal : number;

  constructor(private fb: FormBuilder, private administrationService: AdministrationService, private authService : AuthService,
              private requestService : RequestService, private router: Router,  private activatedRoute: ActivatedRoute, private documentService: DocumentService) {
    this.cerereDupAutorForm = fb.group({
        'id': [],
        'data': {disabled: true, value: new Date()},
        'dataReg': {disabled: true, value: null},
        'currentStep' : ['R'],
        'startDate': [new Date()],
        'endDate': [''],
        'requestNumber': [null, Validators.required],
        'company' : [null, Validators.required],
        'documents': [],
        'medicament':
            fb.group({
                'id': [],
                'name': ['', Validators.required],
                'company': ['', Validators.required],
                'companyValue': [''],
                'documents': []
            }),
        'requestHistories': [],
        'type': [],
        'typeValue': {disabled: true, value: null}
    });
  }

  ngOnInit() {

      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
              this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                      this.cerereDupAutorForm.get('id').setValue(data.id);
                      this.cerereDupAutorForm.get('medicament.name').setValue(data.medicament.name);
                      this.cerereDupAutorForm.get('dataReg').setValue(data.startDate);
                      this.cerereDupAutorForm.get('requestNumber').setValue(data.requestNumber);
                      this.cerereDupAutorForm.get('company').setValue(data.medicament.company);
                      this.cerereDupAutorForm.get('documents').setValue(data.medicament.documents);
                      this.cerereDupAutorForm.get('medicament.documents').setValue(data.medicament.documents);
                      this.cerereDupAutorForm.get('medicament.id').setValue(data.medicament.id);
                      this.cerereDupAutorForm.get('medicament.company').setValue(data.medicament.company);
                      this.cerereDupAutorForm.get('medicament.companyValue').setValue(data.medicament.company.name);
                      this.cerereDupAutorForm.get('requestHistories').setValue(data.requestHistories);
                      this.cerereDupAutorForm.get('type').setValue(data.type);
                      this.cerereDupAutorForm.get('typeValue').setValue(data.type.code);
                      this.documents = data.medicament.documents;
                      this.documents.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
                      let xs = this.documents;
                      xs = xs.map(x => {
                          x.isOld = true;
                          return x;
                      });
                  })
              );
          })
      );

    this.currentDate = new Date();

    this.subscriptions.push(
        this.administrationService.getAllDocTypes().subscribe(data => {
            this.docTypes = data;
            this.docTypes = this.docTypes.filter(r => r.category === 'DD');
            },
            error => console.log(error)
        )
    );
  }

  saveRequest() {

      this.formSubmitted = true;

      if (this.cerereDupAutorForm.invalid || this.paymentTotal<0) {
          return;
      }

      this.formSubmitted = false;

      this.cerereDupAutorForm.get('endDate').setValue(new Date());
      this.cerereDupAutorForm.get('company').setValue(this.cerereDupAutorForm.value.company);

      let modelToSubmit : any = this.cerereDupAutorForm.value;

      modelToSubmit.requestHistories.push({
          startDate: this.cerereDupAutorForm.get('data').value, endDate: new Date(),
          username: this.authService.getUserName(), step: 'E'
      });

      modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
      modelToSubmit.medicament.receipts = this.receiptsList;

      console.log(modelToSubmit);

      this.subscriptions.push(this.documentService.generateDistributionDisposition(this.cerereDupAutorForm.get('requestNumber').value).subscribe(res => {
              modelToSubmit.medicament.documents.push({
                  name: res.substring(res.lastIndexOf('/') + 1),
                  docType : this.docTypes[0],
                  date: new Date(),
                  path: res
              });

              this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                      console.log("succes");
                      this.router.navigate(['dashboard/module']);
                  }, error => console.log(error))
              );
          }, error => console.log(error))
      );
  }

  paymentTotalUpdate(event) {
      this.paymentTotal = event.valueOf();
  }

}
