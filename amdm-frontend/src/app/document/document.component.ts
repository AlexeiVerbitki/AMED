import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {Document} from "../models/document";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog.component";
import {MatDialog, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import { Subscription} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../shared/service/upload/upload-file.service";
import {saveAs} from "file-saver";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdministrationService} from "../shared/service/administration.service";
import {ErrorHandlerService} from "../shared/service/error-handler.service";
import {TaskService} from "../shared/service/task.service";
import {DatePipe} from "@angular/common";
import {Doc} from "../models/Doc";

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input()
    title: string = 'Documente atasate';
    documentList: Document [];
    currentDocDetails : Document = new Document();
    numarCerere: string;
    enableUploading: boolean = true;
    result: any;
    docForm: FormGroup;
    docTypes: any[];
    docTypeIdentifier: any;
    formSubmitted: boolean;
    disabled: boolean = false;
    @ViewChild('incarcaFisier')
    incarcaFisierVariable: ElementRef;
    @Output() documentModified = new EventEmitter();
    private subscriptions: Subscription[] = [];
    visibility: boolean = false;

    displayedColumns: any[] = ['name', 'docType', 'docNumber', 'date', 'actions'];
    dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(public dialog: MatDialog, private uploadService: UploadFileService, private fb: FormBuilder,
                private errorHandlerService: ErrorHandlerService,
                private administrationService: AdministrationService,
                private taskService: TaskService) {
        this.docForm = fb.group({
            'docType': [null, Validators.required],
            'nrDoc': [null, Validators.required],
            'dateDoc': [null, Validators.required]
        });


    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    get canUpload(): boolean {
        return this.enableUploading;
    }

    @Input()
    set canUpload(can: boolean) {
        this.enableUploading = can;
    }

    get documents(): Document [] {
        return this.documentList;
    }

    @Input()
    set documents(docList: Document []) {
        this.documentList = docList;
        this.dataSource.data = this.documentList.slice();

        this.dataSource.filterPredicate = this.createFilter();
    }

    get docDetails(): Document{
        return this.currentDocDetails;
    }

    @Input()
    set docDetails(currentDocDetails: Document) {
        this.currentDocDetails = currentDocDetails;
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

    get dcTypeIdentifier(): any {
        return this.docTypeIdentifier;
    }

    @Input()
    set dcTypeIdentifier(docTypeIdentifier: any) {
        this.docTypeIdentifier = docTypeIdentifier;
        if (docTypeIdentifier) {
            this.subscriptions.push(
                this.taskService.getRequestStepByCodeAndStep(docTypeIdentifier.code, docTypeIdentifier.step).subscribe(step => {
                        this.subscriptions.push(
                            this.administrationService.getAllDocTypes().subscribe(data => {
                                    this.docTypes = data;
                                    this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                                }
                            )
                        );
                    }
                )
            );
        }
    }

    ngOnInit() {
        //To remove it in future
        // if (!this.docTypes || this.docTypes.length == 0) {
        //     this.subscriptions.push(
        //         this.administrationService.getAllDocTypes().subscribe(data => {
        //                 this.docTypes = data;
        //             },
        //             error => console.log(error)
        //         )
        //     );
        // }

    }

    removeDocument(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(this.documents[index].path).subscribe(data => {
                        this.documents.splice(index, 1);
                        this.dataSource.data = this.documents.slice();
                        this.table.renderRows();
                        this.documentModified.emit(true);


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

    checkFields(): boolean {
        this.formSubmitted = true;

        if (this.docForm.get('docType').invalid || (this.docForm.get('nrDoc').invalid && this.docForm.get('docType').value.needDocNr)
            || (this.docForm.get('dateDoc').invalid && this.docForm.get('docType').value.needDate)) {
            return false;
        }

        this.formSubmitted = false;
        return true;
    }

    addDocument(event) {

        if (this.documents && this.documents.find(d => d.name === event.srcElement.files[0].name)) {
            this.errorHandlerService.showError('Document cu acest nume a fost deja atasat.');
            return;
        }

        var allowedExtensions =
            ["jpg", "jpeg", "png", "jfif", "bmp", "svg", "pdf","xls", "xlsx","doc","docx"];
        if(this.docForm.get('docType').value.category=='RL')
        {
            allowedExtensions = ["xml"];
        }

        var fileExtension = event.srcElement.files[0].name.split('.').pop();

        if (allowedExtensions.indexOf(fileExtension.toLowerCase()) <= -1) {
            this.errorHandlerService.showError('Nu se permite atasarea documentelor cu aceasta extensie. Extensiile permise: ' + allowedExtensions);
            return;
        }

        if(this.docForm.get('docType').value.category=='CA')
        {
            this.docForm.get('nrDoc').setValue(this.currentDocDetails.number);
            this.docForm.get('dateDoc').setValue(this.currentDocDetails.dateOfIssue);
        }

        this.subscriptions.push(this.uploadService.pushFileToStorage(event.srcElement.files[0], this.numarCerere).subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.result = event.body;
                    const indexForName = this.result.path.lastIndexOf('/');
                    // const indexForFormat = this.result.path.lastIndexOf('.');

                    let fileName = this.result.path.substring(indexForName + 1);

                    this.documents.push({
                        id: null,
                        name: fileName,
                        docType: this.docForm.get('docType').value,
                        date: new Date(),
                        path: this.result.path,
                        isOld: false,
                        number: this.docForm.get('nrDoc').value,
                        dateOfIssue: this.docForm.get('dateDoc').value
                    });
                    this.dataSource.data = this.documents.slice();
                    this.table.renderRows();


                    this.dataSource.filterPredicate = this.createFilter();

                    this.docForm.get('docType').setValue(null);
                    this.docForm.get('nrDoc').setValue(null);
                    this.docForm.get('dateDoc').setValue(null);
                    this.documentModified.emit(true);
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

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }


    createFilter(): (data: any, filter: string) => boolean {
        let filterFunction = function (data, filter): boolean {
            var datePipe = new DatePipe("en-US");
            const dataStr = data.name.toLowerCase() + data.docType.description.toLowerCase() + data.number + datePipe.transform(data.date, 'dd/MM/yyyy HH:mm:ss');
            return dataStr.indexOf(filter) != -1;
        };
        return filterFunction;
    }

    changeVisibility() {
        this.visibility = !this.visibility;
    }
}
