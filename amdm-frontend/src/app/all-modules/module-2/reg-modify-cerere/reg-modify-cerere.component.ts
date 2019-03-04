import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {saveAs} from 'file-saver';
import {Document} from '../../../models/document';
import {RequestService} from '../../../shared/service/request.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {TaskService} from '../../../shared/service/task.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {CanModuleDeactivate} from '../../../shared/auth-guard/can-deactivate-guard.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {ScrAuthorRolesService} from '../../../shared/auth-guard/scr-author-roles.service';

@Component({
    selector: 'app-reg-modify-cerere',
    templateUrl: './reg-modify-cerere.component.html',
    styleUrls: ['./reg-modify-cerere.component.css']
})
export class RegModifyCerereComponent implements OnInit, OnDestroy, CanModuleDeactivate {
    documents: Document [] = [];
    companii: Observable<any[]>;
    rForm: FormGroup;
    docTypes: any[];

    generatedDocNrSeq: number;
    formSubmitted: boolean;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();
    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private router: Router,
                private requestService: RequestService,
                private authService: AuthService,
                private administrationService: AdministrationService,
                private taskService: TaskService,
                private medicamentService: MedicamentService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private navbarTitleService: NavbarTitleService,
                private loadingService: LoaderService,
                public dialog: MatDialog,
                public dialogConfirmation: MatDialog,
                private roleSrv: ScrAuthorRolesService) {
        this.rForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['E'],
            'mandatedFirstname': [null, Validators.required],
            'mandatedLastname': [null, Validators.required],
            'phoneNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'email': [null, Validators.email],
            'requestMandateNr': [null],
            'requestMandateDate': [null],
            'idnp' : [null, [Validators.maxLength(13), Validators.minLength(13), Validators.pattern('[0-9]+')]],
            'company': [null, Validators.required],
            'initiator': [''],
            'assignedUser': [''],
            'type':
                fb.group({
                    'code': ['INMP', Validators.required]
                }),
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Aprobarea modificarilor postautorizare / Inregistrare cerere');

        this.subscriptions.push(
            this.administrationService.generateMedicamentPostAuthorizationRequestNumber().subscribe(data => {
                    this.generatedDocNrSeq = data[0];
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('21', 'R').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );

    }

    nextStep() {
        this.formSubmitted = true;
        if (this.rForm.get('mandatedFirstname').invalid || this.rForm.get('mandatedLastname').invalid
            || this.rForm.get('company').invalid || this.rForm.get('type.code').invalid  || this.rForm.get('idnp').invalid) {
            return;
        }

        if (this.rForm.get('requestMandateNr').value && !this.rForm.get('requestMandateDate').value) {
            this.errorHandlerService.showError('Data eliberarii procurii trebuie introdusa.');
            return;
        }

        if (this.rForm.get('requestMandateDate').value && !this.rForm.get('requestMandateNr').value) {
            this.errorHandlerService.showError('Numarul procurii trebuie introdus.');
            return;
        }


        this.formSubmitted = false;

        this.loadingService.show();

        const useranameDB = this.authService.getUserName();

        const modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;

        modelToSubmit.registrationRequestMandatedContacts = [{
            mandatedLastname: this.rForm.get('mandatedLastname').value,
            mandatedFirstname: this.rForm.get('mandatedFirstname').value,
            phoneNumber: this.rForm.get('phoneNumber').value,
            email: this.rForm.get('email').value,
            requestMandateNr: this.rForm.get('requestMandateNr').value,
            requestMandateDate: this.rForm.get('requestMandateDate').value,
	        idnp : this.rForm.get('idnp').value
        }];
        modelToSubmit.medicament = null;

        this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                if (this.roleSrv.isRightAssigned('scr_module_6') || this.roleSrv.isRightAssigned('scr_admin')) {
                    this.router.navigate(['dashboard/module/post-modify/evaluate/' + data.body.id]);
                } else if (this.roleSrv.isRightAssigned('scr_register_request')) {
                    this.router.navigate(['/dashboard/homepage/']);
                }

            }, error => this.loadingService.hide())
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.navbarTitleService.showTitleMsg('');
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }
}
