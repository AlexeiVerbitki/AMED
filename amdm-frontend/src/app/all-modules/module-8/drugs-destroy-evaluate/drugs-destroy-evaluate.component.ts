import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Document} from '../../../models/document';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {AnnihilationService} from '../../../shared/service/annihilation/annihilation.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {DocumentService} from '../../../shared/service/document.service';
import {AnnihilationMedDialogComponent} from '../../../dialog/annihilation-med-dialog/annihilation-med-dialog.component';
import {DecimalPipe} from '@angular/common';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-drugs-destroy-evaluate',
    templateUrl: './drugs-destroy-evaluate.component.html',
    styleUrls: ['./drugs-destroy-evaluate.component.css']
})
export class DrugsDestroyEvaluateComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    mFormSubbmitted = false;
    // fFormSubbmitted: boolean = false;

    requestId: string;
    oldData: any;
    viewModelData: any;

    destructionMethods: any [];

    medicamentsToDestroy: any[];

    totalSum: number;

    additionalBonDePlata: any;

    numberPipe: DecimalPipe = new DecimalPipe('en-US');

    //count time
    startDate: Date;
    endDate: Date;

    paymentTotal: number;
    // outDocuments: any[] = [];

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
                public dialogDetails: MatDialog,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Receptia medicamentelor');
        this.startDate = new Date();

        this.initFormData();


        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];

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
            } else {
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

        });

    }

    onChanges(): void {

    }


    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataCererii').patchValue(new Date(data.startDate));

        this.mForm.get('company').patchValue(data.medicamentAnnihilation.companyName);

        this.docs = data.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.medicamentsToDestroy = data.medicamentAnnihilation.medicamentsMedicamentAnnihilationMeds;
        this.medicamentsToDestroy.forEach(mtd => {
            if (mtd.medicamentId) {
                this.subscriptions.push(
                    this.medicamentService.getMedicamentById(mtd.medicamentId).subscribe(data => {
                            mtd.form = data.pharmaceuticalForm.description;
                            mtd.dose = data.dose;
                            mtd.primarePackage = data.primarePackage;
                        }
                    )
                );
            }
        });

        this.calculateTotalSum();


        // this.refreshOutputDocuments();
    }

    // private refreshOutputDocuments() {
    //     this.outDocuments = [];
    //
    //     let outDocument = {
    //         name: 'Act de recepţie a medicamentelor pentru nimicirea ulterioară a lor',
    //         number: 'NA-' + this.oldData.requestNumber,
    //         status: this.getOutputDocStatus()
    //     };
    //
    //     this.outDocuments.push(outDocument);
    // }

    // getOutputDocStatus(): any {
    //     let result;
    //     result = this.docs.find(doc => {
    //         if (doc.docType.category === 'NA' && doc.number === 'NA-' + this.oldData.requestNumber) {
    //             return true;
    //         }
    //     });
    //     if (result) {
    //         return {
    //             mode: 'A',
    //             description: 'Atasat'
    //         };
    //     }
    //
    //     return {
    //         mode: 'N',
    //         description: 'Nu este atasat'
    //     };
    // }


    submit() {
        this.mFormSubbmitted = true;
        if ( this.docs.length == 0) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        if (this.paymentTotal < 0) {
            this.errorHandlerService.showError('Nu s-a efectuat plata.');
            return;
        }

        this.mFormSubbmitted = false;
        const modelToSubmit = this.composeModel('A');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    const result = data.body;
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
        const modelToSubmit = this.composeModel('E');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    // this.router.navigate(['/dashboard/module']);
                    this.errorHandlerService.showSuccess('Datele au fost salvate');
                }
            )
        );
    }


    private composeModel(currentStep: string) {

        this.endDate = new Date();

        const modelToSubmit: any = this.oldData;
        const annihilationModel: any = this.oldData.medicamentAnnihilation;


        modelToSubmit.id = this.requestId;

        modelToSubmit.documents = this.docs;

        annihilationModel.medicamentsMedicamentAnnihilationMeds = this.medicamentsToDestroy;

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
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
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
                const paymentOrder = {
                    date: new Date(),
                    amount: this.totalSum,
                    registrationRequestId: this.requestId,
                    serviceCharge: data,
                    quantity : 1

                };
                this.subscriptions.push(this.administrationService.addPaymentOrder(paymentOrder).subscribe(data => {
                        //Refresh list
                        this.additionalBonDePlata = data;
                        this.viewModelData = this.composeModel('E');
                    }));

            })
        );


    }

    // checkAllDocumentsWasAttached(): boolean {
    //     return !this.outDocuments.find(od => od.status.mode === 'N');
    // }
    //
    // documentAdded(event) {
    //     this.refreshOutputDocuments();
    // }

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
                md.taxTotal = this.numberPipe.transform(md.tax * md.quantity, '1.2-2');
                this.totalSum += md.tax * md.quantity;
            }
        });

        // this.totalSum = this.numberPipe.transform(this.totalSum, '1.2-2');
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
