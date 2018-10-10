import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Document} from "../models/document";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {Subscription} from "rxjs";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../shared/service/upload/upload-file.service";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, OnDestroy {

    documentList: Document [];
    numarCerere: string;
    currentFile: any;
    private subscriptions: Subscription[] = [];
    result: any;

    constructor(public dialog: MatDialog, private uploadService: UploadFileService) { }

    ngOnInit() {
    }

    get documents(): Document [] {
        return this.documentList;
    }

    @Input()
    set documents(docList: Document []) {
        this.documentList = docList;
    }

    get nrCerere(): string  {
        return this.numarCerere;
    }

    @Input()
    set nrCerere(nrCerere: string) {
        this.numarCerere = nrCerere;
    }

    removeDocument(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(this.documents[index].path).subscribe(data => {
                        this.documents.splice(index,1);
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        });
    }

    loadFile(path :string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                // alert('ghfj', data, path);
                this.saveToFileSystem(data,path.substring(path.lastIndexOf('/') + 1));
            },

            error => {
            console.log(error);
            }
            )
        );
    }

    private saveToFileSystem(response: any,docName:string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }


    addDocument(event) {
        if (this.documents.find(d => d.name === event.srcElement.files[0].name) )
        {
            console.error('Document with the same name already added', event.srcElement.files[0].name);
            return;
        }

        this.subscriptions.push(this.uploadService.pushFileToStorage(event.srcElement.files[0], this.numarCerere).subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.result = event.body;
                    const indexForName = this.result.path.lastIndexOf('/');
                    const indexForFormat = this.result.path.lastIndexOf('.');

                    let fileName = this.result.path.substring(indexForName + 1);

                    let fileFormat = '';
                    if (indexForFormat !== -1) {
                        fileFormat = '*.' + this.result.path.substring(indexForFormat + 1);
                    }

                    this.documents.push({
                        id : null,
                        name: fileName,
                        format: fileFormat,
                        date: new Date(),
                        path: this.result.path,
                        isOld: false});
                }
            },
            error => {
                console.log(error);
            }
            )
        );
    }



    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
