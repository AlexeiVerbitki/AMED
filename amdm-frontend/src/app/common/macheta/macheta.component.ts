import {
    Component,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { Subscription} from "rxjs";
import {saveAs} from "file-saver";
import {UploadFileService} from "../../shared/service/upload/upload-file.service";
import {ErrorHandlerService} from "../../shared/service/error-handler.service";
import {ConfirmationDialogComponent} from "../../dialog/confirmation-dialog.component";
import {DivisionSelectDialogComponent} from "../../dialog/division-select-dialog/division-select-dialog.component";

@Component({
    selector: 'app-macheta',
    templateUrl: './macheta.component.html',
    styleUrls: ['./macheta.component.css']
})
export class MachetaComponent implements OnInit, OnDestroy {

    machetaList: any[];
    divisionList: any[];
    numarCerere: string;
    enableUploading: boolean = true;
    isModify: boolean = false;
    private subscriptions: Subscription[] = [];

    constructor(public dialog: MatDialog,
                private errorHandlerService: ErrorHandlerService,
                private uploadService: UploadFileService) {
    }

    get canUpload(): boolean {
        return this.enableUploading;
    }

    @Input()
    set canUpload(can: boolean) {
        this.enableUploading = can;
    }

    get machets(): any[] {
        return this.machetaList;
    }

    @Input()
    set machets(inList: any[]) {
        this.machetaList = inList;
    }

    get divisions(): any[] {
        return this.divisionList;
    }

    @Input()
    set divisions(div: any[]) {
        this.divisionList = div;
    }

    get nrCerere(): string {
        return this.numarCerere;
    }

    @Input()
    set nrCerere(nrCerere: string) {
        this.numarCerere = nrCerere;
    }

    get modify(): boolean {
        return this.isModify;
    }

    @Input()
    set modify(isModify: boolean) {
        this.isModify = isModify;
    }

    ngOnInit() {

    }

    removeMacheta(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta macheta?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(this.machets[index].path).subscribe(data => {
                        this.machets.splice(index, 1);
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        });
    }

    viewFile(macheta: any) {
        this.subscriptions.push(this.uploadService.loadFile(macheta.path).subscribe(data => {
                let file = new Blob([data], {type: macheta.typeDoc });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
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

    checkFields(): boolean {

        if (this.divisions.length == 0) {
            this.errorHandlerService.showError('Nici o divizare nu a fost introdusa.');
            return false;
        }
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            type: 'add',
            values: this.divisions,
            fieldName: "Divizare",
            instructions: this.machets,
            numarCerere: this.numarCerere
        };

        let dialogRef = this.dialog.open(DivisionSelectDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.machets.push({
                    id: null,
                    name: result.fileName,
                    date: new Date(),
                    path: result.path,
                    divisions: result.values,
                    typeDoc : result.type,
                    status: 'N'
                });
            }
        });
    }

    edit(macheta: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            type: 'edit',
            values: this.divisions,
            value: macheta.divisions,
            fieldName: "Divizare",
            instructions: this.machets,
            numarCerere: this.numarCerere
        };

        let dialogRef = this.dialog.open(DivisionSelectDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                macheta.divisions = result.values;
                if (macheta.status == 'O') {
                    macheta.status = 'M';
                }
            }
        });
    }

}
