import {Component, OnInit} from '@angular/core';
import {Cerere} from "../../../models/cerere";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {debounceTime, distinctUntilChanged, filter, map, startWith, tap, flatMap} from "rxjs/operators";
import {saveAs} from 'file-saver';
import {RequestService} from "../../../shared/service/request.service";
import {Document} from "../../../models/document";
import {AuthService} from "../../../shared/service/authetication.service";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {TaskService} from "../../../shared/service/task.service";

@Component({
    selector: 'app-reg-drug-control',
    templateUrl: './reg-drug-control.html',
    styleUrls: ['./reg-drug-control.css']
})
export class RegDrugControl implements OnInit {
    documents: Document [] = [];
    requests: Cerere [] = [];
    companies: any[];
    rForm: FormGroup;
    dataForm: FormGroup;
    sysDate: string;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    isWrongValueCompany: boolean;
    model: string;
    private subscriptions: Subscription[] = [];
    medicamente: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    docTypes: any[];

    constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                private administrationService: AdministrationService, private requestService : RequestService,
                private authService : AuthService, private medicamentService: MedicamentService,
                private loadingService: LoaderService, private taskService: TaskService,) {
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
            'currentStep' : ['R'],
            'medicaments': [],
            'company' : [''],
            'medicament' :
                fb.group({
                    'id' : [],
                    'name' : ['',Validators.required],
                    //'code' : [],
                    'status' : ['P']
            }),
            'medicamentName': [''],
            'type':
                fb.group({
                    'code' : ['ATAC',Validators.required]}),
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

        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.companies = data;
                    this.filteredOptions = this.rForm.get('company').valueChanges
                        .pipe(
                            startWith<string | any>(''),
                            map(value => typeof value === 'string' ? value : value.name),
                            map(name => this._filter(name))
                        );
                },
                error => console.log(error)
            )
        );

        this.rForm.get('data').setValue(this.currentDate);

        this.medicamente =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.medicamentService.getMedicamentNamesAndCodeList(term).pipe(
                        tap(() => this.medLoading = false)
                    )
                )
            );

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

        this.isWrongValueCompany = !this.companies.some(elem => {
            return this.rForm.get('company').value == null ? true : elem.name === this.rForm.get('company').value.name;
        });

        if (this.documents.length === 0 || (this.isWrongValueCompany && this.rForm.get('company').valid)) {
            return;
        }

        if(!this.rForm.get('type.code').valid || !this.rForm.get('medicament').valid)
        {
            return;
        }

        this.formSubmitted = false;

        this.rForm.get('endDate').setValue(new Date());
        this.rForm.get('medicaments').setValue([]);
        this.rForm.get('medicamentName').setValue(this.rForm.value.medicament.name.name);

        var useranameDB = this.authService.getUserName()

        var modelToSubmit: any = this.rForm.value;
        modelToSubmit.requestHistories = [{
            startDate: this.rForm.get('startDate').value, endDate: new Date(),
            username: useranameDB, step: 'R'
        }];
        modelToSubmit.initiator = useranameDB;
        modelToSubmit.assignedUser = useranameDB;
        modelToSubmit.documents = this.documents;

        this.subscriptions.push(
            this.medicamentService.getMedicamentById(this.rForm.value.medicament.name.id).subscribe(data => {
                    console.log('medd', data);
                    data.id = null;
                    data.status = 'P';
                    console.log('medd', data);
                    modelToSubmit.medicaments.push(data);

                console.log(modelToSubmit);

                if(this.rForm.get('type.code').value === 'ATAC')
                {
                    this.model = 'dashboard/module/drug-control/activity-authorization/';
                }
                else if(this.rForm.get('type.code').value === 'ATIE')
                {
                    this.model='dashboard/module/drug-control/transfer-authorization/';
                }
                else if(this.rForm.get('type.code').value === 'MACPS')
                {
                    this.model='dashboard/module/drug-control/modify-authority/';
                }
                else if(this.rForm.get('type.code').value === 'DACPS')
                {
                    this.model='dashboard/module/drug-control/duplicate-authority/';
                }
                    this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                        this.router.navigate([this.model + data.body.id]);
                        })
                    );
                } )

            );

    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.companies.filter(option => option.name.toLowerCase().includes(filterValue));
    }

}
