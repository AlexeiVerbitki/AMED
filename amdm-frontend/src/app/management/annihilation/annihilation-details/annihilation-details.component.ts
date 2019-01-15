import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AnnihilationService} from '../../../shared/service/annihilation/annihilation.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {DecimalPipe} from '@angular/common';

@Component({
    selector: 'app-annihilation-details',
    templateUrl: './annihilation-details.component.html',
    styleUrls: ['./annihilation-details.component.css']
})
export class AnnihilationDetailsComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;


    private subscriptions: Subscription[] = [];


    medicamentsToDestroy: any[];
    members: any[];

    totalSum: number;
    numberPipe: DecimalPipe = new DecimalPipe('en-US');


    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<AnnihilationDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private annihilationService: AnnihilationService,
                private medicamentService: MedicamentService) {
    }

    ngOnInit() {
        this.initFormData();

        this.subscriptions.push(this.annihilationService.findAnnihilationById(this.dataDialog.annihilationId).subscribe(data => {
            console.log('sfsd', data);
            this.patchValue(data);
        }));
    }


    private initFormData() {
        this.rForm = this.fb.group({
            'companyName': {value: null, disabled : true},
        });
    }


    private patchValue(data: any) {
        this.rForm.get('companyName').patchValue(data.companyName);

        this.medicamentsToDestroy = data.medicamentsMedicamentAnnihilationMeds;
        this.medicamentsToDestroy.forEach(mtd => {
            this.subscriptions.push(
                this.medicamentService.getMedicamentById(mtd.medicamentId).subscribe(data => {
                        mtd.form = data.pharmaceuticalForm.description;
                        mtd.dose = data.dose;
                        mtd.primarePackage = data.primarePackage;
                    }
                )
            );
        });


        this.members = data.medicamentAnnihilationInsitutions;

        this.members.forEach(m => {
            if (m.president) {
                m.memberDescription = 'Președintele comisiei';
            } else {
                m.memberDescription = 'Membru comisiei';
            }
        });

        this.calculateTotalSum();
    }

    calculateTotalSum() {
        this.totalSum = 0;
        this.medicamentsToDestroy.forEach(md => {
            if (md.tax) {
                md.taxTotal = this.numberPipe.transform(md.tax * md.quantity, '1.2-2');
                this.totalSum += md.tax * md.quantity;
            }
        });
    }


    cancel() {
        this.dialogRef.close();
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
