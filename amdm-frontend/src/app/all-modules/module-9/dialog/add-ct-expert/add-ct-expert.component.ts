import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {AdministrationService} from "../../../../shared/service/administration.service";

@Component({
    selector: 'app-add-ct-expert',
    templateUrl: './add-ct-expert.component.html',
    styleUrls: ['./add-ct-expert.component.css']
})
export class AddCtExpertComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    experts: any[];

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<AddCtExpertComponent>,
                private administrationService: AdministrationService) {
    }

    ngOnInit() {
        this.eForm = this.fb.group({
            'intern': [0],
            'expert': [null, Validators.required],
            'expertName': [null],
            'date': [new Date()],
        });

        this.subscriptions.push(
            this.administrationService.getAllEmployees().subscribe(data => {
                    this.experts = data;
                },
                error => console.log(error)
            )
        );
    }

    checkIntern(value: any) {
        this.eForm.get('intern').setValue(value.checked);
    }

    add() {
        if (this.eForm.invalid) {
            return;
        }

        if (this.eForm.get('intern').value && !this.eForm.get('expert').value) {
            return;
        }

        if (!this.eForm.get('intern').value && !this.eForm.get('expertName').value) {
            return;
        }
        this.dialogRef.close(this.eForm.value);
    }

    cancel() {
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

}
