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

    ctAmendForm: FormGroup;
    modifications: any[] = [];
    mediacalInstitutionsFromList: any[] = [];
    mediacalInstitutionsToList: any[] = [];
    areMedInstModified = false;

    mediacmentsFrom: any[] = [];
    mediacmentsTo: any[] = [];
    areMedModified = false;

    refProdFrom: any[] = [];
    refProdTo: any[] = [];
    areRefProdModified = false;

    placeboFrom: any[] = [];
    placeboTo: any[] = [];
    arePlacModified = false;

    private subscriptions: Subscription[] = [];

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

        this.subscriptions.push(
            this.requestService.getClinicalTrailAmendmentRequest(this.dataDialog.id).subscribe(data => {
                // console.log('data', data);
                this.ctAmendForm.get('documents').setValue(data.documents);

                const currentAmendment = data.clinicalTrails.clinicTrialAmendEntities.find(amendment => this.dataDialog.id == amendment.registrationRequestId);
                this.ctAmendForm.get('note').setValue(currentAmendment.note);

                // console.log('currentAmendment', currentAmendment);
                if (currentAmendment.sponsorFrom !== currentAmendment.sponsorTo) {
                    this.modifications.push({
                        field: 'Sponsorul',
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
                        field: 'Tip studiu',
                        oldValue: currentAmendment.treatmentFrom.description,
                        newValue: currentAmendment.treatmentTo.description
                    });
                }
                if (currentAmendment.provenanceFrom.id !== currentAmendment.provenanceTo.id) {
                    this.modifications.push({
                        field: 'Categorie studiu',
                        oldValue: currentAmendment.provenanceFrom.description,
                        newValue: currentAmendment.provenanceTo.description
                    });
                }
                if (currentAmendment.trialPopNatFrom !== currentAmendment.trialPopNatTo) {
                    this.modifications.push({
                        field: 'Numărul subiecți naționali',
                        oldValue: currentAmendment.trialPopNatFrom,
                        newValue: currentAmendment.trialPopNatTo
                    });
                }
                if (currentAmendment.trialPopInternatFrom !== currentAmendment.trialPopInternatTo) {
                    this.modifications.push({
                        field: 'Numărul subiecți internaționali',
                        oldValue: currentAmendment.trialPopInternatFrom,
                        newValue: currentAmendment.trialPopInternatTo
                    });
                }
                if (currentAmendment.titleFrom !== currentAmendment.titleTo) {
                    this.modifications.push({
                        field: 'Titlul studiului clinic',
                        oldValue: currentAmendment.titleFrom,
                        newValue: currentAmendment.titleTo
                    });
                }

                if (this.areMedicalInstitutionsModified(currentAmendment.medicalInstitutions)) {
                    this.areMedInstModified = true;
                }

                if (this.areMedicamentsModified(currentAmendment.medicaments)) {
                    this.areMedModified = true;
                }
                if (this.areRefProductsModified(currentAmendment.referenceProducts)) {
                    this.areRefProdModified = true;
                }

                if (this.arePlacebosModified(currentAmendment.placebos)) {
                    this.arePlacModified = true;
                    console.log('modified maze faze');
                }

                // console.log('this.ctAmendForm', this.ctAmendForm);
            })
        );
    }

    areMedicalInstitutionsModified(medicalInstitutions: [any]): boolean {
        if (medicalInstitutions && medicalInstitutions.length > 0) {
            this.mediacalInstitutionsFromList = medicalInstitutions.filter(instFrom => !instFrom.isNew);
            this.mediacalInstitutionsToList = medicalInstitutions.filter(instFrom => instFrom.isNew);

            if (this.mediacalInstitutionsFromList.length == this.mediacalInstitutionsToList.length) {
                for (const medInstFrom of this.mediacalInstitutionsFromList) {
                    const otherMedInst = this.mediacalInstitutionsToList.find(medInstTo => medInstTo.nmMedicalInstitution.id == medInstFrom.nmMedicalInstitution.id);
                    if (otherMedInst && medInstFrom.subdivisionsList.length == otherMedInst.subdivisionsList.length) {
                        for (const medInstSubdivFrom of  medInstFrom.subdivisionsList) {
                            const otherMedInstSubdiv =
                                otherMedInst.subdivisionsList.find(medInstSubdivTo => medInstSubdivTo.nmSubdivision.id == medInstSubdivFrom.nmSubdivision.id);
                            if (otherMedInstSubdiv && medInstSubdivFrom.investigatorsList.length == otherMedInstSubdiv.investigatorsList.length) {

                                for (const medInstSubdivInvestigFrom of  medInstSubdivFrom.investigatorsList) {
                                    const otherMedInstSubdivInvestig = otherMedInstSubdiv.investigatorsList
                                        .find(medInstSubdivInvestigTo => medInstSubdivInvestigTo.nmInvestigator.id == medInstSubdivInvestigFrom.nmInvestigator.id);
                                    if (!(otherMedInstSubdivInvestig && otherMedInstSubdivInvestig.nmInvestigator.id == medInstSubdivInvestigFrom.nmInvestigator.id
                                        && otherMedInstSubdivInvestig.isMain == medInstSubdivInvestigFrom.isMain)) {
                                        return true;
                                    }
                                }
                            } else {
                                return true;
                            }
                        }
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }
        return false;
    }

    areMedicamentsModified(medicaments: any) {
        // console.log('medicaments', medicaments);
        this.mediacmentsFrom = medicaments.filter(medFrom => !medFrom.isNew);
        this.mediacmentsTo = medicaments.filter(medTo => medTo.isNew);
        console.log('mediacmentsFrom', this.mediacmentsFrom);
        console.log('mediacmentsTo', this.mediacmentsTo);

        if (this.mediacmentsFrom.length == this.mediacmentsTo.length) {
            for (const medicamentFrom of this.mediacmentsFrom) {
                const medicamentTo = this.mediacmentsTo.find(medTo => medTo.name == medicamentFrom.name);
                if (medicamentTo && medicamentFrom.manufacture.id == medicamentTo.manufacture.id && medicamentFrom.dose == medicamentTo.dose
                    && medicamentFrom.pharmaceuticalForm.id == medicamentTo.pharmaceuticalForm.id && medicamentFrom.atcCode.id == medicamentTo.atcCode.id
                    && medicamentFrom.subjectsSC == medicamentTo.subjectsSC && medicamentFrom.administratingMode == medicamentTo.administratingMode
                    && medicamentFrom.activeSubstances.length == medicamentTo.activeSubstances.length) {
                    for (const actSubstFrom of medicamentFrom.activeSubstances) {
                        const actSubstTo = medicamentTo.activeSubstances.find(actSubstanceTo => actSubstanceTo.id == actSubstFrom.id);
                        if (actSubstTo && actSubstFrom.manufacture.id == actSubstTo.manufacture.id && actSubstFrom.quantity == actSubstTo.quantity
                            && actSubstFrom.unitsOfMeasurement.id == actSubstTo.unitsOfMeasurement.id) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
        return false;
    }

    areRefProductsModified(refProd: any) {
        // console.log('refProd', refProd);
        this.refProdFrom = refProd.filter(medFrom => !medFrom.isNew);
        this.refProdTo = refProd.filter(medTo => medTo.isNew);
        // console.log('mediacmentsFrom', this.mediacmentsFrom);
        // console.log('mediacmentsTo', this.mediacmentsTo);
        //
        if (this.refProdFrom.length == this.refProdTo.length) {
            for (const refProdFrom of this.refProdFrom) {
                const refProdTo = this.refProdTo.find(refTo => refTo.name == refProdFrom.name);
                if (refProdTo && refProdFrom.manufacture.id == refProdTo.manufacture.id && refProdFrom.dose == refProdTo.dose
                    && refProdFrom.pharmaceuticalForm.id == refProdTo.pharmaceuticalForm.id && refProdFrom.atcCode.id == refProdTo.atcCode.id
                    && refProdFrom.administratingMode == refProdTo.administratingMode && refProdFrom.activeSubstances.length == refProdTo.activeSubstances.length) {
                    for (const actSubstFrom of refProdFrom.activeSubstances) {
                        const actSubstTo = refProdTo.activeSubstances.find(actSubstanceTo => actSubstanceTo.activeSubstance.id == actSubstFrom.activeSubstance.id);
                        if (actSubstTo && actSubstFrom.manufacture.id == actSubstTo.manufacture.id && actSubstFrom.quantity == actSubstTo.quantity
                            && actSubstFrom.unitsOfMeasurement.id == actSubstTo.unitsOfMeasurement.id) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
        return false;
    }

    arePlacebosModified(placebos: any[]) {
        this.placeboFrom = placebos.filter(placFrom => !placFrom.isNew);
        this.placeboTo = placebos.filter(placTo => placTo.isNew);
        if (this.placeboFrom.length == this.placeboTo.length) {
            for (const placeboFrom of this.placeboFrom) {
                const placeboTo = this.placeboTo.find(placebTo => placebTo.name == placeboFrom.name);
                console.log('placeboFrom', placeboFrom);
                console.log('placeboTo', placeboTo);
                if (placeboTo && placeboFrom.manufacture.id == placeboTo.manufacture.id
                    && placeboFrom.pharmaceuticalForm.id == placeboTo.pharmaceuticalForm.id
                    && placeboFrom.administratingMode == placeboTo.administratingMode) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
        return false;
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }

}
