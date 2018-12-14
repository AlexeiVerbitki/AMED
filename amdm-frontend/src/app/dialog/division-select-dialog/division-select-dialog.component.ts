import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {HttpResponse} from "@angular/common/http";
import {ErrorHandlerService} from "../../shared/service/error-handler.service";
import {Subscription} from "rxjs";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";

@Component({
    selector: 'app-one-field-dialog',
    templateUrl: './division-select-dialog.component.html',
    styleUrls: ['./division-select-dialog.component.css']
})
export class DivisionSelectDialogComponent implements OnInit {

    fForm: FormGroup;
    fieldName: string;
    values: any[];
    formSubmitted: boolean;
    @ViewChild('incarcaInstructiune')
    incarcaInstructiuneVariable: ElementRef;
    private subscriptions: Subscription[] = [];
    isExtensionInvalid: boolean = false;
    isFileAlreadyAdded: boolean = false;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<DivisionSelectDialogComponent>,
                private uploadService: UploadFileService,
                private errorHandlerService: ErrorHandlerService,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
        this.fForm = fb.group({
            'values': [[], Validators.required],
            'fileName': [null],
            'path': [null],
            'type': [null],
            'response': [null]
        });
    }

    ngOnInit() {
        this.values = this.dataDialog.values;
        this.fieldName = this.dataDialog.fieldName;

        if(this.dataDialog.type=='edit')
        {
            this.fForm.get('values').setValue(this.dataDialog.value);
        }
    }

    checkFields(): boolean {
        this.formSubmitted = true;

        if (this.fForm.invalid) {
            return false;
        }

        this.formSubmitted = false;
        return true;
    }

    cancel() {
        this.fForm.get('response').setValue(false);
        this.dialogRef.close(this.fForm.value);
    }

    resetInstructiune() {
        this.incarcaInstructiuneVariable.nativeElement.value = "";
    }

    save() {

        if (!this.checkFields()) {
            return;
        }

        this.fForm.get('response').setValue(true);
        this.dialogRef.close(this.fForm.value)
    }

    addInstructiune(eventHtml) {

        this.isFileAlreadyAdded = false;
        this.isExtensionInvalid = false;

        if (this.dataDialog.instructions && this.dataDialog.instructions.find(d => d.name === eventHtml.srcElement.files[0].name)) {
            this.isFileAlreadyAdded = true;
            return;
        }

        var allowedExtensions =
            ["jpg", "jpeg", "png", "jfif", "bmp", "svg", "pdf"];
        var fileExtension = eventHtml.srcElement.files[0].name.split('.').pop();

        if (allowedExtensions.indexOf(fileExtension.toLowerCase()) <= -1) {
            this.isExtensionInvalid = true;
            return;
        }

        this.subscriptions.push(this.uploadService.pushFileToStorage(eventHtml.srcElement.files[0], this.dataDialog.numarCerere).subscribe(event => {
                if (event instanceof HttpResponse) {
                    let result: any = event.body;
                    let fileName = eventHtml.srcElement.files[0].name;
                    let type = eventHtml.srcElement.files[0].type;

                    this.fForm.get('response').setValue(true);
                    this.fForm.get('fileName').setValue(fileName);
                    this.fForm.get('path').setValue(result.path);
                    this.fForm.get('type').setValue(type);
                    this.dialogRef.close(this.fForm.value);
                }
            },
            error => {
                console.log(error);
            }
            )
        );
    }

}
