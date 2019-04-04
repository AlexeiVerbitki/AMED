import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cerere} from '../../../models/cerere';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {saveAs} from 'file-saver';
import {RequestService} from '../../../shared/service/request.service';
import {Document} from '../../../models/document';
import {AuthService} from '../../../shared/service/authetication.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {TaskService} from '../../../shared/service/task.service';
import {DrugDecisionsService} from '../../../shared/service/drugs/drugdecisions.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {ScrAuthorRolesService} from '../../../shared/auth-guard/scr-author-roles.service';
import {AddEcAgentComponent} from "../../../administration/economic-agent/add-ec-agent/add-ec-agent.component";

@Component({
    selector: 'app-reg-drug-control', templateUrl: './reg-drug-control.html', styleUrls: ['./reg-drug-control.css']
})
export class RegDrugControl implements OnInit, OnDestroy {
    documents: Document [] = [];
    requests: Cerere [] = [];
    rForm: FormGroup;
    dataForm: FormGroup;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    model: string;
    medInputs = new Subject<string>();
    medLoading = false;
    docTypes: any[];
    companies: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private router: Router,
                private administrationService: AdministrationService,
                private requestService: RequestService,
                private authService: AuthService,
                private loadingService: LoaderService,
                private taskService: TaskService,
                private navbarTitleService: NavbarTitleService,
                private drugDecisionsService: DrugDecisionsService,
                private roleSrv: ScrAuthorRolesService) {

        this.rForm = fb.group({
            'compGet': [null, Validators.required],
            'med': [null, Validators.required],
            'primRep': [null, Validators.required],
        });
        this.rForm = fb.group({
            'data': {disabled: true, value: null},
            'requestNumber': [null],
            'dataSiaGeap': null,
            'requestNumberSiaGeap': null,
            'startDate': [new Date()],
            'endDate': [''],
            'currentStep': ['R'],
            'company': [null, Validators.required],
            'type': fb.group({
                'code': ['ATAC', Validators.required]
            }),
            'mandatedFirstname': [null, Validators.required],
            'mandatedLastname': [null, Validators.required],
            'idnp': [null],
            'phoneNumber': [null, [Validators.maxLength(9), Validators.pattern('[0-9]+')]],
            'email': [null, Validators.email],
            'requestMandateNr': [null],
            'requestMandateDate': [null],
            'regSubject': ['', Validators.required],
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Inregistrare cerere');
        this.currentDate = new Date();

        this.subscriptions.push(this.drugDecisionsService.generateRegistrationRequestNumber().subscribe(data => {
            this.generatedDocNrSeq = data[0];
            this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
        }));

        this.getAllCompanies();

        this.rForm.get('data').setValue(this.currentDate);

        this.subscriptions.push(this.taskService.getRequestStepByIdAndCode('10', 'R').subscribe(step => {
            this.subscriptions.push(this.administrationService.getAllDocTypes().subscribe(data => {
                this.docTypes = data;
                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
            }));
        }));
    }

    getAllCompanies() {

        this.companies = this.companyInputs.pipe(filter((result: string) => {
            if (result && result.length > 2) {
                return true;
            }
        }), debounceTime(400), distinctUntilChanged(), tap((val: string) => {
            this.loadingCompany = true;

        }), flatMap(term =>

            this.administrationService.getCompanyDetailsForLicense(term).pipe(tap(() => this.loadingCompany = false))));
    }

    displayFn(user?: any): string | undefined {
        return user ? user.name : undefined;
    }

    nextStep() {
        this.formSubmitted = true;

        if (this.rForm.invalid) {
            return;
        }

        // if (this.documents.length === 0 || (this.rForm.get('company').invalid)) {
        //     return;
        // }

        this.formSubmitted = false;

        const useranameDB = this.authService.getUserName();

        const modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(), username: useranameDB, step: 'E'
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
            idnp: this.rForm.get('idnp').value
        }];
        modelToSubmit.currentStep = 'E';
        modelToSubmit.regSubject = this.rForm.get('regSubject').value;

        let drugCheckDecisions = [{
            nrSiaGeap: this.rForm.get('requestNumberSiaGeap').value,
            dateSiaGeap : this.rForm.get('dataSiaGeap').value
        }];

        modelToSubmit.drugCheckDecisions = drugCheckDecisions;

        this.setSelectedRequest();

        this.subscriptions.push(this.drugDecisionsService.addAuthorizationDetails(modelToSubmit).subscribe(data => {
            if (this.roleSrv.isRightAssigned('scr_module_4') || this.roleSrv.isRightAssigned('scr_admin')) {
                this.router.navigate([this.model + data.body.id]);
            } else if (this.roleSrv.isRightAssigned('scr_register_request')) {
                this.router.navigate(['/dashboard/homepage/']);
            }
        }));

    }

    setSelectedRequest() {
        if (this.rForm.get('type.code').value === 'ATAC' || this.rForm.get('type.code').value === 'MACPS' || this.rForm.get('type.code').value === 'DACPS') {
            this.model = 'dashboard/module/drug-control/activity-authorization/';
        } else if (this.rForm.get('type.code').value === 'ATIE') {
            this.model = 'dashboard/module/drug-control/transfer-authorization/';
        }
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
