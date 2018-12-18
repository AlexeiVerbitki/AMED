import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ClinicalTrialService} from "../../../../shared/service/clinical-trial.service";
import {Subscription} from "rxjs/index";

@Component({
    selector: 'app-clinical-trials-details',
    templateUrl: './clinical-trials-details.component.html',
    styleUrls: ['./clinical-trials-details.component.css']
})
export class ClinicalTrialsDetailsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    ctForm: FormGroup;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<ClinicalTrialsDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private ctService: ClinicalTrialService,) {
    }

    ngOnInit() {
        console.log('dataDialog', this.dataDialog);

        this.ctForm = this.fb.group({
            'id': {value: null, disabled: true},
            'startDateInternational': {value: '', disabled: true},
            'startDateNational': {value: null, disabled: true},
            'endDateNational': {value: null, disabled: true},
            'endDateInternational': {value: null, disabled: true},
            'title': {value: null, disabled: true},

            'applicant': {value: null, disabled: true},
            'sponsor': {value: null, disabled: true},
            'code': {value: null, disabled: true},
            'eudraCtNr': {value: null, disabled: true},

            'phase': {value: null, disabled: true},
            'treatment': {value: null, disabled: true},
            'provenance': {value: null, disabled: true},

            'trialPopNat': {value: null, disabled: true},
            'trialPopInternat': {value: null, disabled: true},
            'comissionNr': {value: null, disabled: true},
            'comissionDate': {value: null, disabled: true},

            'medicament': [],
            'referenceProduct': [],
            'placebo': [],
            'clinicTrialAmendEntities': [],
            'clinicTrialNotificationEntities': [],

            'status': {value: null, disabled: true},
            'pharmacovigilance': {value: null, disabled: true},
            'medicalInstitutions': ['']

        });

        this.subscriptions.push(this.ctService.loadClinicalTrailById(this.dataDialog.id).subscribe(data => {
                console.log('filtered data', data);
                this.ctForm.get('id').setValue(data.clinicalTrails.id);
                this.ctForm.get('startDateInternational').setValue(new Date(data.clinicalTrails.startDateInternational));
                this.ctForm.get('startDateNational').setValue(new Date(data.clinicalTrails.startDateNational));
                this.ctForm.get('endDateNational').setValue(new Date(data.clinicalTrails.endDateNational));
                this.ctForm.get('endDateInternational').setValue(new Date(data.clinicalTrails.endDateInternational));
                this.ctForm.get('title').setValue(data.clinicalTrails.title);
                this.ctForm.get('applicant').setValue(data.company.name);
                this.ctForm.get('sponsor').setValue(data.clinicalTrails.sponsor);
                this.ctForm.get('code').setValue(data.clinicalTrails.code);
                this.ctForm.get('eudraCtNr').setValue(data.clinicalTrails.eudraCtNr);
                this.ctForm.get('phase').setValue(data.clinicalTrails.phase.name);
                this.ctForm.get('treatment').setValue(data.clinicalTrails.treatment.description);
                this.ctForm.get('provenance').setValue(data.clinicalTrails.provenance.description);
                this.ctForm.get('trialPopNat').setValue(data.clinicalTrails.trialPopNat);
                this.ctForm.get('trialPopInternat').setValue(data.clinicalTrails.trialPopInternat ? data.clinicalTrails.trialPopInternat : '-');
                this.ctForm.get('comissionNr').setValue(data.clinicalTrails.comissionNr);
                this.ctForm.get('comissionDate').setValue(new Date(data.clinicalTrails.comissionDate));
                this.ctForm.get('medicalInstitutions').setValue(data.clinicalTrails.medicalInstitutions);
                this.ctForm.get('medicament').setValue(data.clinicalTrails.medicament);
                this.ctForm.get('referenceProduct').setValue(data.clinicalTrails.referenceProduct);
                this.ctForm.get('placebo').setValue(data.clinicalTrails.placebo);

                data.clinicalTrails.clinicTrialAmendEntities.sort((one, two) => (one.id < two.id ? 1 : -1));
                this.ctForm.get('clinicTrialAmendEntities').setValue(data.clinicalTrails.clinicTrialAmendEntities);

                data.clinicalTrails.clinicTrialNotificationEntities.sort((one, two) => (one.id < two.id ? 1 : -1));
                this.ctForm.get('clinicTrialNotificationEntities').setValue(data.clinicalTrails.clinicTrialNotificationEntities);
                // this.ctForm.get('medicament').disable();

                console.log('this.ctForm', this.ctForm);
                //this.dataSource.data = data;
            }, error => {
                // this.loadingService.hide();
                console.log(error)
            })
        );


    }

    ngOnDestroy(): void {
    }

}