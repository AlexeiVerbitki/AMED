import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-reg-doc',
    templateUrl: './reg-doc.component.html',
    styleUrls: ['./reg-doc.component.css']
})
export class RegDocComponent implements OnInit {

    rForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.rForm = fb.group({
            'expeditor': [null, Validators.required],
            'destinatar': [null, Validators.required],
            'problematica': [null, Validators.required],
            'termenDeExecutare': [null, Validators.required],
            'dataPrimirii': [null, Validators.required],
            'tipulDocumentului': [null, Validators.required],
        });
    }

    addForm() {
        console.log(this.rForm.value);
        this.rForm.reset();
    }

    cancel() {
        this.rForm.reset();
    }

    ngOnInit(): void {
    }

}
