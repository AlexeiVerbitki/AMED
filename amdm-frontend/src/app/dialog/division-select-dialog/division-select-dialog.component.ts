import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpResponse} from '@angular/common/http';
import {ErrorHandlerService} from '../../shared/service/error-handler.service';
import {Subscription} from 'rxjs';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';

@Component({
    selector: 'app-one-field-dialog',
    templateUrl: './division-select-dialog.component.html',
    styleUrls: ['./division-select-dialog.component.css']
})
export class DivisionSelectDialogComponent implements OnInit {

    fForm: FormGroup;
    divisions: any[];
    formSubmitted: boolean;
    @ViewChild('incarcaInstructiune')
    incarcaInstructiuneVariable: ElementRef;
    private subscriptions: Subscription[] = [];
    isExtensionInvalid: boolean = false;
    isFileAlreadyAdded: boolean = false;
    notIncluded : boolean = false;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<DivisionSelectDialogComponent>,
                private uploadService: UploadFileService,
                private errorHandlerService: ErrorHandlerService,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
        this.fForm = fb.group({
            'divisions' : [],
            'fileName': [null],
            'path': [null],
            'type': [null],
            'response': [null]
        });
    }

    ngOnInit() {
        this.divisions = this.dataDialog.values;
    }

    checkFields(): boolean {
        this.formSubmitted = true;

        if(!this.divisions.find(t=>t.include==true))
        {
            this.notIncluded = true;
            return;
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

        for(let div of this.divisions)
        {
            if(this.dataDialog.fieldName=='instr') {
                this.fillInstructions(div);
            }
            else if (this.dataDialog.fieldName=='macheta')
            {
                this.fillMacheta(div);
            }
        }

        this.fForm.get('response').setValue(true);
        this.fForm.get('divisions').setValue(this.divisions);
        this.dialogRef.close(this.fForm.value)
    }

    fillInstructions(div : any)
    {
        let instr = div.instructions.find(t => t.path == this.dataDialog.value.path);
        if(div.include==true) {
            if (instr) {
                if (instr.status == 'O') {
                    instr.status == 'M';
                }
            } else {
                div.instructions.push({
                    name: this.dataDialog.value.name,
                    date: new Date(),
                    path: this.dataDialog.value.path,
                    typeDoc: this.dataDialog.value.typeDoc,
                    status: 'N',
                    division : div.description,
                    volume : div.volume, volumeQuantityMeasurement : div.volumeQuantityMeasurement
                });
            }
        }
        else
        {
            if(instr)
            {
                div.instructions = div.instructions.filter(t=>t.path!=this.dataDialog.value.path);
            }
        }
    }

    fillMacheta(div : any)
    {
        let instr = div.machets.find(t => t.path == this.dataDialog.value.path);
        if(div.include==true) {
            if (instr) {
                if (instr.status == 'O') {
                    instr.status == 'M';
                }
            } else {
                div.machets.push({
                    name: this.dataDialog.value.name,
                    date: new Date(),
                    path: this.dataDialog.value.path,
                    typeDoc: this.dataDialog.value.typeDoc,
                    status: 'N',
                    division : div.description,
                    volume : div.volume, volumeQuantityMeasurement : div.volumeQuantityMeasurement
                });
            }
        }
        else
        {
            if(instr)
            {
                div.machets = div.machets.filter(t=>t.path!=this.dataDialog.value.path);
            }
        }
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
                    for(let div of this.divisions)
                    {
                        if(this.dataDialog.fieldName=='instr' && div.include==true)
                        {
                            if(!div.instructions)
                            {
                                div.instructions = [];
                            }
                            div.instructions.push({name:fileName, date: new Date(),path:result.path,typeDoc : type, status : 'N',division : div.description,
                            volume : div.volume, volumeQuantityMeasurement : div.volumeQuantityMeasurement});
                        }
                        else if(this.dataDialog.fieldName=='macheta' && div.include==true)
                        {
                            if(!div.machets)
                            {
                                div.machets = [];
                            }
                            div.machets.push({name:fileName, date: new Date(),path:result.path,typeDoc : type, status : 'N',division : div.description,
                                volume : div.volume, volumeQuantityMeasurement : div.volumeQuantityMeasurement});
                        }
                    }
                    this.fForm.get('divisions').setValue(this.divisions);
                    this.fForm.get('response').setValue(true);
                    this.dialogRef.close(this.fForm.value);
                }
            },
            error => {
                console.log(error);
            }
            )
        );
    }

    checkInclude(box: any, division: any) {
        this.notIncluded = false;
        division.include = box.checked;
    }

}
