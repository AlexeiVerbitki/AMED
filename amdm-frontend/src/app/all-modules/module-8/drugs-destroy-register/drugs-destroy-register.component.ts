import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {Document} from '../../../models/document';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {AnnihilationService} from '../../../shared/service/annihilation/annihilation.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {ScrAuthorRolesService} from '../../../shared/auth-guard/scr-author-roles.service';
import {AddEcAgentComponent} from "../../../administration/economic-agent/add-ec-agent/add-ec-agent.component";

@Component({
    selector: 'app-drugs-destroy-register',
    templateUrl: './drugs-destroy-register.component.html',
    styleUrls: ['./drugs-destroy-register.component.css']
})
export class DrugsDestroyRegisterComponent implements OnInit, OnDestroy {

    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    mFormSubbmitted = false;
    fFormSubbmitted = false;
    maxDate = new Date();

    // count time
    startDate: Date;
    endDate: Date;

    // Validations
    mForm: FormGroup;
    rForm: FormGroup;
    // fForm: FormGroup;


    constructor(private router: Router,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                public dialog: MatDialog,
                private authService: AuthService,
                private medicamentService: MedicamentService,
                private annihilationService: AnnihilationService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private roleSrv: ScrAuthorRolesService) {

    }


    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Inregistrarea cererii de nimicire a medicamentelor');
        this.startDate = new Date();
        this.subscriptions.push(
            this.annihilationService.generateRegistrationRequestNumber().subscribe(data => {
                    this.mForm.get('nrCererii').setValue(data[0]);
                }
            )
        );

        this.companii =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) { return true; }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.administrationService.getCompanyDetailsForLicense(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );


        this.initFormData();

        this.onChanges();

    }

    checkMedInput(value: string): boolean {
        if (value.length > 2) {
            return true;
        }

        return false;
    }


    private initFormData() {
        this.mForm = this.fb.group({
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataCererii': [{value: null, disabled: true}],
            'company': [null, Validators.required],
            'telefonContact': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'emailContact': [null, Validators.email],
            'persResDepCereriiFirstname': [null, Validators.required],
            'persResDepCereriiLastname': [null, Validators.required],
            'nrProcurii1': [null],
            'dataProcurii1': [{value: null, disabled: true}],
            'idnp': '',
            'regSubject': ['', Validators.required],

        });

        this.mForm.get('dataCererii').setValue(new Date());
    }


    onChanges(): void {
    }


    submitNew() {
        this.fFormSubbmitted = true;
        this.mFormSubbmitted = true;

        if (!this.mForm.valid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        this.endDate = new Date();

        this.fFormSubbmitted = false;
        this.mFormSubbmitted = false;

        const modelToSubmit: any = {};
        const annihilationModel: any = {};



        annihilationModel.idno = this.mForm.get('company').value.idno;

        modelToSubmit.medicamentAnnihilation = annihilationModel;
        modelToSubmit.requestNumber = this.mForm.get('nrCererii').value;


        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'R'
        }];

        modelToSubmit.currentStep = 'E';
        modelToSubmit.startDate = this.startDate;
        modelToSubmit.initiator = this.authService.getUserName();
        modelToSubmit.assignedUser = this.authService.getUserName();
        modelToSubmit.documents = this.docs;
        modelToSubmit.regSubject = this.mForm.get('regSubject').value;

        modelToSubmit.registrationRequestMandatedContacts = [{mandatedLastname : this.mForm.get('persResDepCereriiLastname').value,
            mandatedFirstname : this.mForm.get('persResDepCereriiFirstname').value,
            phoneNumber : this.mForm.get('telefonContact').value,
            email : this.mForm.get('emailContact').value,
            requestMandateNr : this.mForm.get('nrProcurii1').value,
            requestMandateDate : this.mForm.get('dataProcurii1').value,
            idnp : this.mForm.get('idnp').value,
        }];


        this.subscriptions.push(
            this.annihilationService.confirmRegisterAnnihilation(modelToSubmit).subscribe(data => {
                    const result = data.body;
                    if (this.roleSrv.isRightAssigned('scr_module_8') || this.roleSrv.isRightAssigned('scr_admin')) {
                        this.router.navigate(['/dashboard/module/medicament-destruction/evaluate', result]);
                    } else if (this.roleSrv.isRightAssigned('scr_register_request')) {
                        this.router.navigate(['/dashboard/homepage/']);
                    }
                }
            )
        );

    }

    newAgent() {
        const dialogRef2 = this.dialog.open(AddEcAgentComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
            },
            hasBackdrop: true
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result && result.success) {
                //Do nothing
            }
        });
    }

    ngOnDestroy() {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
