import {Component, OnInit} from '@angular/core';
import {Cerere} from "../../../models/cerere";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {saveAs} from 'file-saver';
import {RequestService} from "../../../shared/service/request.service";
import {Document} from "../../../models/document";
import {AuthService} from "../../../shared/service/authetication.service";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {TaskService} from "../../../shared/service/task.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";

@Component({
    selector: 'app-reg-drug-control',
    templateUrl: './reg-drug-control.html',
    styleUrls: ['./reg-drug-control.css']
})
export class RegDrugControl implements OnInit {
    documents: Document [] = [];
    requests: Cerere [] = [];
    rForm: FormGroup;
    dataForm: FormGroup;
    sysDate: string;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    model: string;
    private subscriptions: Subscription[] = [];
    medInputs = new Subject<string>();
    medLoading = false;
    docTypes: any[];
    companies: Observable<any[]>;
    loadingCompany: boolean = false;
    companyInputs = new Subject<string>();

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private administrationService: AdministrationService, private requestService: RequestService,
                private authService: AuthService, private medicamentService: MedicamentService,
                private loadingService: LoaderService, private taskService: TaskService, private licenseService: LicenseService, private errorHandlerService: ErrorHandlerService) {

        this.rForm = fb.group({
            'compGet': [null, Validators.required],
            'med': [null, Validators.required],
            'primRep': [null, Validators.required],
        });
        this.rForm = fb.group({
            'data': {disabled: true, value: null},
            'requestNumber': [null],
            'startDate': [new Date()],
            'endDate': [''],
            'currentStep': ['R'],
            'company': [null, Validators.required],
            'type':
                fb.group({
                    'code': ['ATAC', Validators.required]
                }),
        });
    }

    ngOnInit() {

        this.currentDate = new Date();

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                    this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                },
                error => console.log(error)
            )
        );

        this.getAllCompanies();

        this.rForm.get('data').setValue(this.currentDate);

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('10', 'R').subscribe(step => {
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

    getAllCompanies() {

        this.companies =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
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
    }

    displayFn(user?: any): string | undefined {
        return user ? user.name : undefined;
    }

    onChange(event) {
        this.file = event.srcElement.files[0];
        const fileName = this.file.name;
        const lastIndex = fileName.lastIndexOf('.');
        let fileFormat = '';
        if (lastIndex !== -1) {
            fileFormat = '*.' + fileName.substring(lastIndex + 1);
        }
        this.sysDate = `${this.currentDate.getDate()}.${this.currentDate.getMonth() + 1}.${this.currentDate.getFullYear()}`;
        this.requests.push({denumirea: fileName, format: fileFormat, dataIncarcarii: this.sysDate});
    }

    nextStep() {
        this.formSubmitted = true;

        if (!this.rForm.valid) {
            return;
        }

        if (this.documents.length === 0 || (this.rForm.get('company').invalid)) {
            return;
        }

        this.formSubmitted = false;

        this.rForm.get('endDate').setValue(new Date());

        var useranameDB = this.authService.getUserName()

        var modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;

        this.setSelectedRequest();

        this.goToNextStepOnLicenseValid(modelToSubmit);

    }

    setSelectedRequest() {

        if (this.rForm.get('type.code').value === 'ATAC') {
            this.model = 'dashboard/module/drug-control/activity-authorization/';
        } else if (this.rForm.get('type.code').value === 'ATIE') {
            this.model = 'dashboard/module/drug-control/transfer-authorization/';
        } else if (this.rForm.get('type.code').value === 'MACPS') {
            this.model = 'dashboard/module/drug-control/modify-authority/';
        } else if (this.rForm.get('type.code').value === 'DACPS') {
            this.model = 'dashboard/module/drug-control/duplicate-authority/';
        }
    }

    private goToNextStepOnLicenseValid(modelToSubmit: any) {

        let company = this.rForm.get('company').value;

        if (company != null && company.licenseId != null) {
            this.subscriptions.push(
                this.licenseService.findLicenseById(company.licenseId).subscribe(data => {
                        if (data != null && data.expirationDate != null) {
                            let licenseDate = new Date(data.expirationDate);
                            let date = new Date();
                            let haveLicence = false;
                            if (licenseDate.getTime() > date.getTime()) {
                                haveLicence = true;
                            }
                            if (!haveLicence) {
                                this.errorHandlerService.showError('Licenta nu este valida.');
                                return;
                            }
                            try {
                                this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                                        this.router.navigate([this.model + data.body.id]);
                                    })
                                );
                            } catch (err) {
                                return;
                            }
                        } else {
                            this.errorHandlerService.showError('Licenta nu este valida.');
                            return;
                        }
                    }
                )
            );
        } else {
            this.errorHandlerService.showError('Licenta nu este valida.');
            return;
        }

    }

}
