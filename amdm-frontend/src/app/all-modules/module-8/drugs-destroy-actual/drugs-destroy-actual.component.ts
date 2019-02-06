import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
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
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';

@Component({
    selector: 'app-drugs-destroy-actual',
    templateUrl: './drugs-destroy-actual.component.html',
    styleUrls: ['./drugs-destroy-actual.component.css']
})
export class DrugsDestroyActualComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    rFormSubbmitted = false;
    mFormSubbmitted = false;
    kFormSubbmitted = false;


    requestId: string;
    oldData: any;

    medicamentsToDestroy: any[];
    commisions: any[];
    responsabilities: any[];

    members: any[];


    //count time
    startDate: Date;
    endDate: Date;

    outDocuments: any[] = [];

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;
    kForm: FormGroup;

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
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Nimicirea medicamentelor');
        this.startDate = new Date();

        this.responsabilities = [{id: 1, value: 'Președintele comisiei'},
            {id: 0, value: 'Membru comisiei'}];

        this.initFormData();


        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.requestId = params['id'];

                this.subscriptions.push(
                    this.annihilationService.retrieveAnnihilationByRequestId(this.requestId).subscribe(data => {
                            this.oldData = data;
                            this.members = data.medicamentAnnihilation.medicamentAnnihilationInsitutions;

                        this.members.forEach(m => {
                            if (m.president) {
                                m.memberDescription = 'Președintele comisiei';
                            } else {
                                m.memberDescription = 'Membru comisiei';
                            }
                        });
                            this.patchData(data);
                            this.subscriptions.push(
                                this.annihilationService.retrieveCommisions().subscribe(data => {
                                        this.commisions = data;
                                    }
                                )
                            );
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
            'company': [{value: null, disabled: true}],
        });


        this.rForm = this.fb.group({
            'commision': [null, Validators.required],
            'responsability': [null, Validators.required],
            'proffesion': [null, Validators.required],
            'name': [null, Validators.required],
        });


        this.kForm = this.fb.group({
            'firstname': '',
            'lastname': '',
            'docLPAttached': [{value: null, disabled: true}],
        });

    }


    onChanges(): void {

    }


    private patchData(data) {
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataCererii').patchValue(new Date(data.startDate));
        this.mForm.get('company').patchValue(data.medicamentAnnihilation.companyName);
        this.kForm.get('firstname').patchValue(data.medicamentAnnihilation.firstname);
        this.kForm.get('lastname').patchValue(data.medicamentAnnihilation.lastname);

        this.kForm.get('docLPAttached').patchValue(data.medicamentAnnihilation.attachedLNDocument);

        this.rForm.get('commision').patchValue(data.medicamentAnnihilation.commisions);

        this.docs = data.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.medicamentsToDestroy = data.medicamentAnnihilation.medicamentsMedicamentAnnihilationMeds;
        this.refreshOutputDocuments();
    }

    private refreshOutputDocuments() {
        this.outDocuments = [];

        const outDocument1 = {
            name: 'Scrisoare de solicitare a persoanelor pentru Comisia de NIM',
            number: '',
            status: this.getOutputDocStatus('NS'),
            category : 'NS'
        };

        const outDocument2 = {
            name: 'Procesul-verbal de NIM',
            number: '',
            status: this.getOutputDocStatus('NP'),
            category : 'NP'
        };

        const outDocument3 = {
            name: 'Lista medicamentelor pentru comisie',
            number: '',
            status: this.getOutputDocStatus('LN'),
            category : 'LN'
        };


        const outDocument4 = {
            name: 'Act de recepţie a medicamentelor pentru nimicirea ulterioară a lor',
            number: '',
            status: this.getOutputDocStatus('NA'),
            category : 'NA'
        };

        // this.outDocuments.push(outDocument1);
        this.outDocuments.push(outDocument4);
        this.outDocuments.push(outDocument2);
        // this.outDocuments.push(outDocument3);
    }

    getOutputDocStatus(category: string): any {
        let result;
        result = this.docs.find(doc => {
            if (doc.docType.category === category) {
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
        this.kFormSubbmitted = true;
        if (this.docs.length == 0 || this.members.length == 0) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        if (!this.kForm.valid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        if (!this.kForm.get('docLPAttached') || !this.kForm.get('docLPAttached').value) {
            this.errorHandlerService.showError('Cererea nu a fost semnata din lista medicamntelor pentru nimicire.');
            return;
        }

        this.mFormSubbmitted = false;
        this.kFormSubbmitted = false;
        const modelToSubmit = this.composeModel('F');

        this.subscriptions.push(
            this.annihilationService.finishAnnihilation(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
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
        const modelToSubmit = this.composeModel('A');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    // this.router.navigate(['/dashboard/module']);
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

        annihilationModel.medicamentAnnihilationInsitutions = this.members;


        annihilationModel.firstname = this.kForm.get('firstname').value;
        annihilationModel.lastname = this.kForm.get('lastname').value;

        // annihilationModel.commisions = this.rForm.get('commision').value;

        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'A'
        }];

        modelToSubmit.currentStep = currentStep;
        modelToSubmit.assignedUser = this.authService.getUserName();

        modelToSubmit.medicamentAnnihilation = annihilationModel;
        return modelToSubmit;
    }

    viewDoc(document: any) {
        this.loadingService.show();

        let observable;

        if (document.category === 'LN') {
            observable = this.annihilationService.viewListaPentruComisie(this.composeModel('A'));
        } else if (document.category === 'NP') {
            observable = this.annihilationService.viewProcesVerbal(this.composeModel('A'));
        } else if (document.category === 'NA') {
            observable = this.annihilationService.viewActDeReceptie(this.composeModel('A'));
        }

        this.subscriptions.push(observable.subscribe(data => {
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

    checkAllDocumentsWasAttached(): boolean {
        return !this.outDocuments.find(od => od.status.mode === 'N');
    }

    documentAdded(event) {
        this.refreshOutputDocuments();
    }

    addMember() {
        this.rFormSubbmitted = true;
        if (this.members == null) {
            this.members = [];
        }

        if (!this.rForm.valid || (this.rForm.get('responsability').value.id && this.checkIfPresidentAlreadyAdded())) {
            return;
        }

        this.rFormSubbmitted = false;

        this.members.push(
            {
                medicamentAnnihilationId: this.oldData.medicamentAnnihilation.id,
                institution: this.rForm.get('commision').value,
                commision: this.rForm.get('commision').value,
                // president: this.rForm.get('responsability').value.id,
                memberDescription: this.rForm.get('responsability').value.value,
                function : this.rForm.get('proffesion').value,
                name : this.rForm.get('name').value,
                president: this.rForm.get('responsability').value.id,
            }
        );

        this.rForm.get('commision').setValue(null);
        this.rForm.get('responsability').setValue(null);
        this.rForm.get('proffesion').setValue(null);
        this.rForm.get('name').setValue(null);
    }

    removeMember(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta inregistrare?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.members.splice(index, 1);
            }
        });
    }

    checkIfPresidentAlreadyAdded() {
        return this.members.find( m => m.president);
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
