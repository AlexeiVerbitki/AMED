import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {AdministrationService} from '../../shared/service/administration.service';

@Component({
    selector: 'app-select-currency-bon-plata-dialog',
    templateUrl: './select-currency-bon-plata-dialog.component.html',
    styleUrls: ['./select-currency-bon-plata-dialog.component.css']
})
export class SelectCurrencyBonPlataDialogComponent implements OnInit {

    aForm: FormGroup;
    companii: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    maxDate = new Date();
    private subscriptions: Subscription[] = [];
    formSubmitted: boolean;

    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogRef: MatDialogRef<SelectCurrencyBonPlataDialogComponent>) {
        this.aForm = fb.group({
            'currency': ['MDL', Validators.required],
            'coincide': [true],
            'company': [null, Validators.required],
            'companyValue' : [null],
            'response': [null]
        });
    }

    ngOnInit() {
        if (this.dataDialog && this.dataDialog.company) {
            this.aForm.get('companyValue').setValue(this.dataDialog.company.name);
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
        }
    }

    generate() {
        this.formSubmitted = true;
        if (this.aForm.invalid && !this.aForm.get('coincide').value) {
            return;
        }
        this.formSubmitted = false;
        this.aForm.get('response').setValue(true);
        this.dialogRef.close(this.aForm.value);
    }

    checkCoincide(value: any) {
        this.aForm.get('coincide').setValue(value.checked);
    }

}
