import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RequestService} from '../../../../shared/service/request.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {saveAs} from 'file-saver';
import {UploadFileService} from '../../../../shared/service/upload/upload-file.service';

@Component({
    selector: 'app-amendment-details',
    templateUrl: './amendment-details.component.html',
    styleUrls: ['./amendment-details.component.css']
})
export class AmendmentDetailsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    ctAmendForm: FormGroup;
    medicamentForm: FormGroup;
    refProdForm: FormGroup;
    placebForm: FormGroup;
    modifications: any[] = [];

    mediacalInstitutionsFromList: any[] = [];
    mediacalInstitutionsToList: any[] = [];

    isMedModified = false;
    isRefProdModified = false;
    isPlaceboModified = false;

    medActiveSubstancesFromList: any[] = [];
    medActiveSubstancesToList: any[] = [];

    refProdActiveSubstancesFromList: any[] = [];
    refProdActiveSubstancesToList: any[] = [];

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private requestService: RequestService,
                public dialogRef: MatDialogRef<AmendmentDetailsComponent>,
                private uploadService: UploadFileService) {
    }

    ngOnInit() {
        // console.log('dataDialog', this.dataDialog);

        this.ctAmendForm = this.fb.group({
            'documents': [],
            'note': [{value: null, disabled: true}]
        });

        this.medicamentForm = this.fb.group({
            'id': [{value: null, disabled: true}],
            'nameFrom': [{value: null, disabled: true}],
            'nameTo': [{value: null, disabled: true}],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufactureFrom': [{value: null, disabled: true}],
            'manufactureTo': [{value: null, disabled: true}],
            'doseFrom': [{value: null, disabled: true}],
            'doseTo': [{value: null, disabled: true}],
            'volumeQuantityMeasurementFrom': [null],
            'volumeQuantityMeasurementTo': [null],
            'pharmFormFrom': [{value: null, disabled: true}],
            'pharmFormTo': [{value: null, disabled: true}],
            'atcCodeFrom': [{value: null, disabled: true}],
            'atcCodeTo': [{value: null, disabled: true}],
            'administModeFrom': [{value: null, disabled: true}],
            'administModeTo': [{value: null, disabled: true}],
            'activeSubstances': [null]
        });

        this.refProdForm = this.fb.group({
            'id': [{value: null, disabled: true}],
            'nameFrom': [{value: null, disabled: true}],
            'nameTo': [{value: null, disabled: true}],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufactureFrom': [{value: null, disabled: true}],
            'manufactureTo': [{value: null, disabled: true}],
            'doseFrom': [{value: null, disabled: true}],
            'doseTo': [{value: null, disabled: true}],
            'volumeQuantityMeasurementFrom': [null],
            'volumeQuantityMeasurementTo': [null],
            'pharmFormFrom': [{value: null, disabled: true}],
            'pharmFormTo': [{value: null, disabled: true}],
            'atcCodeFrom': [{value: null, disabled: true}],
            'atcCodeTo': [{value: null, disabled: true}],
            'administModeFrom': [{value: null, disabled: true}],
            'administModeTo': [{value: null, disabled: true}],
            'activeSubstances': [null]
        });

        this.placebForm = this.fb.group({
            'id': [{value: null, disabled: true}],
            'nameFrom': [{value: null, disabled: true}],
            'nameTo': [{value: null, disabled: true}],
            'registrationNumber': [null],
            'registrationDate': [new Date()],
            'internationalMedicamentName': [null],
            'manufactureFrom': [{value: null, disabled: true}],
            'manufactureTo': [{value: null, disabled: true}],
            'doseFrom': [{value: null, disabled: true}],
            'doseTo': [{value: null, disabled: true}],
            'volumeQuantityMeasurementFrom': [null],
            'volumeQuantityMeasurementTo': [null],
            'pharmFormFrom': [{value: null, disabled: true}],
            'pharmFormTo': [{value: null, disabled: true}],
            'atcCodeFrom': [{value: null, disabled: true}],
            'atcCodeTo': [{value: null, disabled: true}],
            'administModeFrom': [{value: null, disabled: true}],
            'administModeTo': [{value: null, disabled: true}],
            'activeSubstances': [null]
        });

        this.subscriptions.push(
            this.requestService.getClinicalTrailAmendmentRequest(this.dataDialog.id).subscribe(data => {
                console.log('data', data);
                this.ctAmendForm.get('documents').setValue(data.documents);

                const currentAmendment = data.clinicalTrails.clinicTrialAmendEntities.find(amendment => this.dataDialog.id == amendment.registrationRequestId);
                this.ctAmendForm.get('note').setValue(currentAmendment.note);

                console.log('currentAmendment', currentAmendment);
                if (currentAmendment.sponsorFrom !== currentAmendment.sponsorTo) {
                    this.modifications.push({
                        field: 'Denumire comerciala',
                        oldValue: currentAmendment.sponsorFrom,
                        newValue: currentAmendment.sponsorTo
                    });
                }
                if (currentAmendment.phaseFrom.id !== currentAmendment.phaseTo.id) {
                    this.modifications.push({
                        field: 'Faza studiului',
                        oldValue: currentAmendment.phaseFrom.name,
                        newValue: currentAmendment.phaseTo.name
                    });
                }
                if (currentAmendment.treatmentFrom.id !== currentAmendment.treatmentTo.id) {
                    this.modifications.push({
                        field: 'Tratament',
                        oldValue: currentAmendment.treatmentFrom.description,
                        newValue: currentAmendment.treatmentTo.description
                    });
                }
                if (currentAmendment.provenanceFrom.id !== currentAmendment.provenanceTo.id) {
                    this.modifications.push({
                        field: 'Provenienta',
                        oldValue: currentAmendment.provenanceFrom.description,
                        newValue: currentAmendment.provenanceTo.description
                    });
                }
                if (currentAmendment.trialPopNatFrom !== currentAmendment.trialPopNatTo) {
                    this.modifications.push({
                        field: 'Numărul pacienților naționali',
                        oldValue: currentAmendment.trialPopNatFrom,
                        newValue: currentAmendment.trialPopNatTo
                    });
                }
                if (currentAmendment.trialPopInternatFrom !== currentAmendment.trialPopInternatTo) {
                    this.modifications.push({
                        field: 'Numărul pacienților internaționali',
                        oldValue: currentAmendment.trialPopInternatFrom,
                        newValue: currentAmendment.trialPopInternatTo
                    });
                }
                if (currentAmendment.medicalInstitutionsFrom && currentAmendment.medicalInstitutionsFrom.length != 0) {
                    console.log('medicalInstitutionsFrom', currentAmendment.medicalInstitutionsFrom);
                    this.mediacalInstitutionsFromList = currentAmendment.medicalInstitutionsFrom;
                    this.mediacalInstitutionsToList = currentAmendment.medicalInstitutionsTo;
                }
                if (this.isMedicamentModified(currentAmendment.medicament)) {
                    this.isMedModified = true;
                    this.medicamentForm.setValue(currentAmendment.medicament);
                    //this.medicamentForm.manufactureFrom = currentAmendment.medicament.manufactureFrom.description;
                    // console.log('medicamnet modified');
                    // console.log('this.medicamentForm', this.medicamentForm);
                } else {
                    // console.log('medicamnet not modified');
                }
                if (this.isReferenceProductModified(currentAmendment.referenceProduct)) {
                    this.isRefProdModified = true;
                    this.refProdForm.setValue(currentAmendment.referenceProduct);
                    // console.log('isRefProd modified');
                } else {
                    // console.log('isRefProd not modified');
                }
                if (this.isPlacebFormModified(currentAmendment.placebo)) {
                    this.isPlaceboModified = true;
                    this.placebForm.setValue(currentAmendment.placebo);
                    console.log('isPlaceboModified modified');
                } else {
                    console.log('isPlaceboModified not modified');
                }

                // console.log('this.ctAmendForm', this.ctAmendForm);
            })
        );
    }

    isMedicamentModified(medicament: any) {
        if (medicament.activeSubstances.some(as => as.status == 'N' || as.status == 'R')) {
            this.medActiveSubstancesFromList = medicament.activeSubstances.filter(as => as.status == 'U' || as.status == 'R');
            this.medActiveSubstancesToList = medicament.activeSubstances.filter(as => as.status == 'U' || as.status == 'N');
            return true;
        }
        return !(medicament.nameFrom == medicament.nameTo && medicament.manufactureFrom.id == medicament.manufactureTo.id && medicament.doseFrom == medicament.doseTo
            && medicament.pharmFormFrom.id == medicament.pharmFormTo.id && medicament.atcCodeFrom.id == medicament.atcCodeTo.id && medicament.administModeFrom == medicament.administModeTo);
    }

    isReferenceProductModified(refProd: any) {
        if (refProd.activeSubstances.some(as => as.status == 'N' || as.status == 'R')) {
            this.refProdActiveSubstancesFromList = refProd.activeSubstances.filter(as => as.status == 'U' || as.status == 'R');
            this.refProdActiveSubstancesToList = refProd.activeSubstances.filter(as => as.status == 'U' || as.status == 'N');
            return true;
        }
        return !(refProd.nameFrom == refProd.nameTo && refProd.manufactureFrom.id == refProd.manufactureTo.id && refProd.doseFrom == refProd.doseTo
            && refProd.pharmFormFrom.id == refProd.pharmFormTo.id && refProd.atcCodeFrom.id == refProd.atcCodeTo.id && refProd.administModeFrom == refProd.administModeTo);
    }

    isPlacebFormModified(placebo: any) {
        return !(placebo.nameFrom == placebo.nameTo && placebo.doseFrom == placebo.doseTo && placebo.administModeFrom == placebo.administModeTo);
    }

    cancel() {
        this.dialogRef.close();
    }

    loadFileFrom(path: string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
            },
            error => {
                console.log(error);
            })
        );
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

}
