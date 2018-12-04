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
import {LicenseDecisionDialogComponent} from "../../../dialog/license-decision-dialog/license-decision-dialog.component";
import {AnnihilationMedDialogComponent} from "../../../dialog/annihilation-med-dialog/annihilation-med-dialog.component";

@Component({
    selector: 'app-drugs-destroy-evaluate',
    templateUrl: './drugs-destroy-evaluate.component.html',
    styleUrls: ['./drugs-destroy-evaluate.component.css']
})
export class DrugsDestroyEvaluateComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    mFormSubbmitted: boolean = false;
    // fFormSubbmitted: boolean = false;

    requestId: string;
    oldData: any;
    viewModelData: any;

    destructionMethods: any [];

    medicamentsToDestroy: any[];

    totalSum: number;

    additionalBonDePlata : any;


    //count time
    startDate: Date;
    endDate: Date;

    paymentTotal: number;
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
                private annihilationService: AnnihilationService,
                private loadingService: LoaderService,
                private documentService: DocumentService,
                public dialogDetails: MatDialog) {
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
                            this.viewModelData = data;
                            this.patchData(data);
                        }
                    )
                );


                this.subscriptions.push(
                    this.annihilationService.retrieveDestructionMethods().subscribe(data => {
                            this.destructionMethods = data;
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
            'nrCererii': [{value: null, disabled: true}],
            'dataCererii': [{value: null, disabled: true}],
            'company': [{value: null, disabled: true}, Validators.required],
            'firstname': [{value: null}, Validators.required],
            'lastname': [{value: null}, Validators.required],
        });

    }

    onChanges(): void {

    }


    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataCererii').patchValue(new Date(data.startDate));
        this.mForm.get('firstname').patchValue(data.medicamentAnnihilation.firstname);
        this.mForm.get('lastname').patchValue(data.medicamentAnnihilation.lastname);
        this.mForm.get('company').patchValue(data.medicamentAnnihilation.companyName);

        this.docs = data.medicamentAnnihilation.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.medicamentsToDestroy = data.medicamentAnnihilation.medicamentsMedicamentAnnihilationMeds;
        this.medicamentsToDestroy.forEach(mtd => {
            this.subscriptions.push(
                this.medicamentService.getMedicamentById(mtd.medicamentId).subscribe(data => {
                        mtd.form = data.pharmaceuticalForm.description;
                        mtd.dose = data.dose;
                        mtd.primarePackage = data.primarePackage;
                    }
                )
            );
        });

        this.calculateTotalSum();


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

    getOutputDocStatus(): any {
        let result;
        result = this.docs.find(doc => {
            if (doc.docType.category === 'NA' && doc.number === 'NA-' + this.oldData.requestNumber) {
                return true;
            }
        });
        if (result) {
            return {
                mode: 'A',
                description: 'Atasat'
            };
        }

        return {
            mode: 'N',
            description: 'Nu este atasat'
        };
    }


    submit() {
        this.mFormSubbmitted = true;
        console.log('sdfsd', this.mForm);
        if (!this.mForm.valid || this.docs.length == 0) {
            return;
        }

        this.mFormSubbmitted = false;
        let modelToSubmit = this.composeModel('A');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    let result = data.body;
                    this.router.navigate(['/dashboard/module/medicament-destruction/actual', result]);
                }
            )
        );
    }

    confirm() {
        this.mFormSubbmitted = true;
        if (this.docs.length == 0) {
            return;
        }

        this.mFormSubbmitted = false;
        let modelToSubmit = this.composeModel('E');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );
    }


    private composeModel(currentStep: string) {

        this.endDate = new Date();

        let modelToSubmit: any = this.oldData;
        let annihilationModel: any = this.oldData.medicamentAnnihilation;


        modelToSubmit.id = this.requestId;

        annihilationModel.documents = this.docs;

        annihilationModel.medicamentsMedicamentAnnihilationMeds = this.medicamentsToDestroy;

        annihilationModel.firstname = this.mForm.get('firstname').value;
        annihilationModel.lastname = this.mForm.get('lastname').value;


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

    generareTax() {
        this.subscriptions.push(this.administrationService.getServiceChargeByCategory('BN').subscribe(data => {
                let paymentOrder = {
                    date: new Date(),
                    amount: this.totalSum,
                    registrationRequestId: this.requestId,
                    serviceCharge: data

                };
                console.log('pay', paymentOrder);
                this.subscriptions.push(this.administrationService.addPaymentOrder(paymentOrder).subscribe(data => {
                        //Refresh list
                        this.additionalBonDePlata = data;
                        this.viewModelData = this.composeModel('E');
                    }));

            })
        );


    }

    checkAllDocumentsWasAttached(): boolean {
        return !this.outDocuments.find(od => od.status.mode === 'N');
    }

    documentAdded(event) {
        this.refreshOutputDocuments();
    }

    details(medicamentToDestroy: any) {
        const dialogRef2 = this.dialogDetails.open(AnnihilationMedDialogComponent, {
            width: '850px',
            height: '650px',
            data: {
                annihilationMed: medicamentToDestroy,
                destructionMethods: this.destructionMethods
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                medicamentToDestroy = result.annihilationMed;
                this.calculateTotalSum();
            }
        });
    }


    calculateTotalSum() {
        this.totalSum = 0;
        this.medicamentsToDestroy.forEach(md => {
            if (md.tax) {
                md.taxTotal = md.tax * md.quantity;
                this.totalSum += md.tax * md.quantity;
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
