import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {AnnihilationService} from "../../../shared/service/annihilation/annihilation.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {LoaderService} from "../../../shared/service/loader.service";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
    selector: 'app-drugs-destroy-evaluate',
    templateUrl: './drugs-destroy-evaluate.component.html',
    styleUrls: ['./drugs-destroy-evaluate.component.css']
})
export class DrugsDestroyEvaluateComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    rFormSubbmitted: boolean = false;
    fFormSubbmitted: boolean = false;

    requestId: string;
    oldData : any;

    medicamentsToDestroy: any[];


    //count time
    startDate: Date;
    endDate: Date;

    paymentTotal: number;
    paymentOrdersList: PaymentOrder[] = [];
    receiptsList: Receipt[] = [];

    outDocuments: any[] = [];

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;


    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                public dialog: MatDialog,
                private authService: AuthService,
                private medicamentService: MedicamentService,
                private annihilationService : AnnihilationService,
                private loadingService: LoaderService,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.startDate = new Date();

        this.initFormData();


        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];
                console.log('sdf', this.requestId);

                this.subscriptions.push(
                    this.annihilationService.retrieveAnnihilationByRequestId(this.requestId).subscribe(data => {
                            this.oldData = data;
                            this.patchData(data);
                        }
                    )
                );
            }
            else {
                return;
            }
        }));




        this.onChanges();

    }


    private initFormData() {
        this.mForm = this.fb.group({
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataCererii': [{value: null, disabled: true}],
            'company': [{value: null, disabled: true}, Validators.required],
        });

    }

    onChanges(): void {

    }


    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataCererii').patchValue(new Date(data.startDate));
        this.mForm.get('company').patchValue(data.company.name);

        this.docs = data.medicamentAnnihilation.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.receiptsList = data.medicamentAnnihilation.receipts;
        this.paymentOrdersList = data.medicamentAnnihilation.paymentOrders;

        let xs2 = this.receiptsList;
        xs2 = xs2.map(x => {
            x.isOld = true;
            return x;
        });
        let xs3 = this.paymentOrdersList;
        xs3 = xs3.map(x => {
            x.isOld = true;
            return x;
        });

        this.medicamentsToDestroy  = data.medicamentAnnihilation.medicamentsMedicamentAnnihilationMeds;
        this.refreshOutputDocuments();
    }

    private refreshOutputDocuments() {
        this.outDocuments = [];

        let outDocument = {
            name: 'Act de recepţie a medicamentelor pentru nimicirea ulterioară a lor',
            number: 'NA-' + this.oldData.requestNumber,
            status: this.getOutputDocStatus()
        };

        this.outDocuments.push(outDocument);
    }

    getOutputDocStatus(): any
    {
        let result;
        result = this.docs.find( doc =>
        {
           if (doc.docType.category === 'NA' && doc.number === 'NA-' + this.oldData.requestNumber)
           {
               return true;
           }
        });
        if (result)
        {
            return {
                mode : 'A',
                description : 'Atasat'
            };
        }

        return {
            mode : 'N',
            description : 'Nu este atasat'
        };
    }


    submit()
    {
        this.rFormSubbmitted = true;
        if (this.docs.length==0 || !this.checkAllDocumentsWasAttached())
        {
            return;
        }

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('A');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    let result = data.body;
                    this.router.navigate(['/dashboard/module/medicament-destruction/actual', result]);
                }
            )
        );
    }

    confirm()
    {
        this.rFormSubbmitted = true;
        if (this.docs.length==0)
        {
            return;
        }

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('E');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );
    }



    private composeModel(currentStep : string) {

        this.endDate = new Date();

        let modelToSubmit: any = this.oldData;
        let annihilationModel: any = this.oldData.medicamentAnnihilation;


        modelToSubmit.id = this.requestId;

        annihilationModel.documents = this.docs;

        annihilationModel.medicamentsMedicamentAnnihilationMeds = this.medicamentsToDestroy;

        annihilationModel.paymentOrders = this.paymentOrdersList;
        annihilationModel.receipts = this.receiptsList;


        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'E'
        }];

        modelToSubmit.currentStep = currentStep;
        modelToSubmit.assignedUser = this.authService.getUserName();

        modelToSubmit.medicamentAnnihilation = annihilationModel;
        return modelToSubmit;
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }


    viewDoc(document: any) {
        this.loadingService.show();
        this.subscriptions.push(this.annihilationService.viewActDeReceptie(this.composeModel('E')).subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }
    
    checkAllDocumentsWasAttached(): boolean
    {
        return !this.outDocuments.find(od => od.status.mode === 'N');
    }

    documentAdded(event) {
        this.refreshOutputDocuments();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
