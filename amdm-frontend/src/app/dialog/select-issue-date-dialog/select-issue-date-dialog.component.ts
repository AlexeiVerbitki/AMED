import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {DocumentService} from '../../shared/service/document.service';

@Component({
    selector: 'app-select-issue-date-dialog',
    templateUrl: './select-issue-date-dialog.component.html',
    styleUrls: ['./select-issue-date-dialog.component.css']
})
export class SelectIssueDateDialogComponent implements OnInit {

    maxDate = new Date();
    aForm: FormGroup;
    formSubmitted = false;
    @ViewChild('incarcaDoc')
    incarcaDocVariable: ElementRef;
    isExtensionInvalid: boolean;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private uploadService: UploadFileService,
                private documentService: DocumentService,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogRef: MatDialogRef<SelectIssueDateDialogComponent>) {
        this.aForm = fb.group({
            'dateOfIssue': [new Date(), Validators.required],
            'response': [null]
        });
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close(this.aForm.value);
    }

    checkFields(): boolean {
        this.formSubmitted = true;

        if (this.aForm.invalid) {
            return false;
        }

        this.formSubmitted = false;
        return true;
    }

    resetDoc() {
        this.incarcaDocVariable.nativeElement.value = '';
    }

    addDoc(eventHtml) {
        this.isExtensionInvalid = false;

        const allowedExtensions =
            ['jpg', 'jpeg', 'png', 'jfif', 'bmp', 'svg', 'pdf'];
        const fileExtension = eventHtml.srcElement.files[0].name.split('.').pop();

        if (allowedExtensions.indexOf(fileExtension.toLowerCase()) <= -1) {
            this.isExtensionInvalid = true;
            return;
        }

        this.dataDialog.document.dateOfIssue = this.aForm.get('dateOfIssue').value;

        if (this.dataDialog.type == 'OM') {
            this.subscriptions.push(this.documentService.addOM(this.dataDialog.document, eventHtml.srcElement.files[0]).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.aForm.get('response').setValue(true);
                        this.dialogRef.close(this.aForm.value);
                    }
                },
                error => {
                    console.log(error);
                }
                )
            );
        } else if (this.dataDialog.type == 'DD') {
            this.subscriptions.push(this.documentService.addDD(this.dataDialog.document, eventHtml.srcElement.files[0]).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.aForm.get('response').setValue(true);
                        this.dialogRef.close(this.aForm.value);
                    }
                },
                error => {
                    console.log(error);
                }
                )
            );
        } else if (this.dataDialog.type == 'DDC') {
            this.subscriptions.push(this.documentService.addDDC(this.dataDialog.document, eventHtml.srcElement.files[0]).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.aForm.get('response').setValue(true);
                        this.dialogRef.close(this.aForm.value);
                    }
                },
                error => {
                    console.log(error);
                })
            );
        } else if (this.dataDialog.type == 'DDA') {
            this.subscriptions.push(this.documentService.addDDAC(this.dataDialog.document, eventHtml.srcElement.files[0]).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.aForm.get('response').setValue(true);
                        this.dialogRef.close(this.aForm.value);
                    }
                },
                error => {
                    console.log(error);
                })
            );
        } else if (this.dataDialog.type == 'DDM') {
            this.subscriptions.push(this.documentService.addDDM(this.dataDialog.document, eventHtml.srcElement.files[0]).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.aForm.get('response').setValue(true);
                        this.dialogRef.close(this.aForm.value);
                    }
                },
                error => {
                    console.log(error);
                }
                )
            );
        } else if (this.dataDialog.type == 'LN') {

            this.subscriptions.push(this.documentService.addLN(this.dataDialog.document, eventHtml.srcElement.files[0]).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.aForm.get('response').setValue(true);
                        this.dialogRef.close(this.aForm.value);
                    }
                }
            ));
        } else {
            this.subscriptions.push(this.documentService.addOA(this.dataDialog.document, eventHtml.srcElement.files[0]).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.aForm.get('response').setValue(true);
                        this.dialogRef.close(this.aForm.value);
                    }
                },
                error => {
                    console.log(error);
                }
                )
            );
        }

    }

}
