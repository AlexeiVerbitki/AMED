import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Document} from "../models/document";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {Subscription} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../shared/service/upload/upload-file.service";
import {saveAs} from "file-saver";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdministrationService} from "../shared/service/administration.service";
import {ErrorHandlerService} from "../shared/service/error-handler.service";

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, OnDestroy {

    documentList: Document [];
    numarCerere: string;
    enableUploading: boolean = true;
    private subscriptions: Subscription[] = [];
    result: any;
    docForm: FormGroup;
    docTypes: any[];
    formSubmitted: boolean;

    disabled: boolean = false;

    @ViewChild('incarcaFisier')
    incarcaFisierVariable: ElementRef;

    constructor(public dialog: MatDialog, private uploadService: UploadFileService, private fb: FormBuilder,
               private errorHandlerService : ErrorHandlerService,
                private administrationService: AdministrationService) {
        this.docForm = fb.group({
            'docType': [null, Validators.required],
            'nrDoc': [null, Validators.required]
        });
    }

    ngOnInit() {
        if(!this.docTypes || this.docTypes.length==0) {
            this.subscriptions.push(
                this.administrationService.getAllDocTypes().subscribe(data => {
                        this.docTypes = data;
                    },
                    error => console.log(error)
                )
            );
        }

    }

    @Output() documentAdded = new EventEmitter();

    @Input()
    set canUpload(can: boolean) {
        this.enableUploading = can;
    }

    get canUpload(): boolean {
        return this.enableUploading;
    }

    get documents(): Document [] {
        return this.documentList;
    }

    @Input()
    set documents(docList: Document []) {
        this.documentList = docList;
    }

    get nrCerere(): string {
        return this.numarCerere;
    }

    @Input()
    set nrCerere(nrCerere: string) {
        this.numarCerere = nrCerere;
    }

    get isDisabled(): boolean {
        return this.disabled;
    }

    @Input()
    set isDisabled(disabled: boolean) {
        this.disabled = disabled;
    }

    get dcTypes(): any[] {
        return this.docTypes;
    }

    @Input()
    set dcTypes(docTypes: any[]) {
        this.docTypes = docTypes;
    }

    removeDocument(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(this.documents[index].path).subscribe(data => {
                        this.documents.splice(index, 1);
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        });
    }

    loadFile(path: string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
            },

            error => {
                console.log(error);
            }
            )
        );
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }

    checkFields(): boolean {
        this.formSubmitted = true;

        if (this.docForm.get('docType').invalid || (this.docForm.get('nrDoc').invalid && this.docForm.get('docType').value.needDocNr)) {
            return false;
        }

        this.formSubmitted = false;
        return true;
    }

    addDocument(event) {

        if (this.documents.find(d => d.name === event.srcElement.files[0].name)) {
            this.errorHandlerService.showError('Document cu acest nume a fost deja atasat.');
            return;
        }

        this.subscriptions.push(this.uploadService.pushFileToStorage(event.srcElement.files[0], this.numarCerere).subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.result = event.body;
                    const indexForName = this.result.path.lastIndexOf('/');
                    const indexForFormat = this.result.path.lastIndexOf('.');

                    let fileName = this.result.path.substring(indexForName + 1);

                    this.documents.push({
                        id: null,
                        name: fileName,
                        docType: this.docForm.get('docType').value,
                        date: new Date(),
                        path: this.result.path,
                        isOld: false,
                        number: this.docForm.get('nrDoc').value
                    });
                    this.docForm.get('docType').setValue(null);
                    this.docForm.get('nrDoc').setValue(null);
                    this.documentAdded.emit(true);
                }
            },
            error => {
                console.log(error);
            }
            )
        );
    }

    reset() {
        this.incarcaFisierVariable.nativeElement.value = "";
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
