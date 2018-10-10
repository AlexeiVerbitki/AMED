import {Component, OnInit} from '@angular/core';

import {getCerere} from '../../../models/getCerere';
import {Select} from '../../../models/select';
import {Observable, Subscription} from "rxjs";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {map, startWith} from "rxjs/operators";
import {AdministrationService} from "../../../shared/service/administration.service";

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara.component.html',
    styleUrls: ['./evaluare-primara.component.css']
})
export class EvaluarePrimaraComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document [] = [];
    company: any;
    // isWrongValuePharmaceuticalFormType: boolean;
    // isWrongValuePharmaceuticalForm: boolean;
    // isWrongValueActiveSubstance: boolean;
    formSubmitted: boolean;
    isAddSubstancePressed : boolean;

    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstances: any[];
    activeSubstancesTable: any[];
    // filteredFormTypes: Observable<any[]>;
    // filteredForms: Observable<any[]>;
    // filteredActiveSubstances: Observable<any[]>;


    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private activatedRoute: ActivatedRoute) {
        this.eForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [new Date()],
            'endDate': [''],
            'currentStep': ['C'],
            'medicament':
                fb.group({
                    'name': ['', Validators.required],
                    'company': ['', Validators.required],
                    'pharmaceuticalForm': [null, Validators.required],
                    'pharmaceuticalFormType': [null, Validators.required],
                    'status': ['P']
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'activeSubstance': [null,Validators.required],
            'activeSubstanceCode': [''],
            'activeSubstanceQuantity': ['',Validators.required],
            'activeSubstanceUnit': ['',Validators.required],
            'type':
                fb.group({
                        'id': {disabled: true, value: ''}
                    }
                ),
        });
    }

    ngOnInit() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.eForm.get('requestNumber').setValue(data.requestNumber);
                        this.eForm.get('medicament.company').setValue(data.medicament.company.name);
                        this.eForm.get('medicament.name').setValue(data.medicament.name);
                        this.eForm.get('type.id').setValue(String(data.type.id));
                        this.company = data.medicament.company;
                        this.documents = data.medicament.documents;
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                    })
                );
            })
        );

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllActiveSubstances().subscribe(data => {
                    this.activeSubstances = data;
                },
                error => console.log(error)
            )
        );
    }

    private _filter(name: string, values: any[]): any[] {
        const filterValue = name.toLowerCase();
        return values.filter(option => option.description.toLowerCase().includes(filterValue));
    }

    checkPharmaceuticalFormTypeValue() {

        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalForm').setValue('');
                    this.pharmaceuticalForms = data;
                },
                error => console.log(error)
            )
        );
    }

    checkActiveSubstanceValue() {
        if(this.eForm.get('activeSubstance').value==null)
        {
            return;
        }

        this.eForm.get('activeSubstanceCode').setValue(this.eForm.get('activeSubstance').value.code);
    }

    displayDescription(value?: any): string | undefined {
        return value ? value.description : undefined;
    }

    nextStep() {
        this.formSubmitted = true;

        if (!this.eForm.get('medicament.pharmaceuticalFormType').valid || !this.eForm.get('medicament.pharmaceuticalForm').valid || this.activeSubstancesTable.length==0) {
            return;
        }

        this.formSubmitted = false;
    }

    addActiveSubstance()
    {
        this.isAddSubstancePressed = true;

        if(this.eForm.get('activeSubstance').invalid || this.eForm.get('activeSubstanceQuantity').invalid
            || this.eForm.get('activeSubstanceUnit').invalid)
        {
            return;
        }
        this.isAddSubstancePressed = false;

        this.activeSubstancesTable.push({});
    }

    public doza: Select[] = [
        {value: 'mg', viewValue: 'mg'},
        {value: 'g', viewValue: 'g'}
    ];

    public cerere: getCerere[] = [
        {
            denumirea: 'Cerere de inregistrare a medicamentului 1',
            format: '*.pdf, *.doc, *.docx',
            dataIncarcarii: '04.05.2018'
        },
        {
            denumirea: 'Cerere de inregistrare a medicamentului 2',
            format: '*.pdf, *.doc, *.docx',
            dataIncarcarii: '05.05.2018'
        },
        {
            denumirea: 'Cerere de inregistrare a medicamentului 3',
            format: '*.pdf, *.doc, *.docx',
            dataIncarcarii: '06.05.2018'
        },
        {
            denumirea: 'Cerere de inregistrare a medicamentului 4',
            format: '*.pdf, *.doc, *.docx',
            dataIncarcarii: '07.05.2018'
        },
        {
            denumirea: 'Cerere de inregistrare a medicamentului 5',
            format: '*.pdf, *.doc, *.docx',
            dataIncarcarii: '08.05.2018'
        }
    ];

    public clasifyMed: Select[] = [
        {value: 'original', viewValue: 'Original'},
        {value: 'generic', viewValue: 'Generic'}
    ];


}
