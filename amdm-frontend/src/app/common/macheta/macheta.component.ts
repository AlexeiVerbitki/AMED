import {
    Component, EventEmitter,
    Input,
    OnDestroy,
    OnInit, Output
} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription} from 'rxjs';
import {saveAs} from 'file-saver';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {ErrorHandlerService} from '../../shared/service/error-handler.service';
import {ConfirmationDialogComponent} from '../../dialog/confirmation-dialog.component';
import {DivisionSelectDialogComponent} from '../../dialog/division-select-dialog/division-select-dialog.component';

@Component({
    selector: 'app-macheta',
    templateUrl: './macheta.component.html',
    styleUrls: ['./macheta.component.css']
})
export class MachetaComponent implements OnInit, OnDestroy {

    machetaList: any[];
    divisionList: any[];
    numarCerere: string;
    isModify: boolean = false;
    enableUploading: boolean = true;
   
    private subscriptions: Subscription[] = [];
    @Output() removeMaket = new EventEmitter();
    @Output() addMaket = new EventEmitter();

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
		let path = this.machets[index].path;
                this.subscriptions.push(this.uploadService.removeFileFromStorage(path).subscribe(data => {
                        this.machets.splice(index, 1);
			 this.removeMaket.emit(path);
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

        this.divisions.forEach(t=>t.include=false);
        dialogConfig2.data = {
            type: 'add',
            values: this.divisions,
            fieldName: "macheta",
            instructions: this.machets,
            numarCerere: this.numarCerere
        };

        let dialogRef = this.dialog.open(DivisionSelectDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                  this.addMaket.emit(result.divisions);
            }
        });
    }

    edit(macheta: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';
	
	 for(let div of this.divisions)
        {
            if(div.machets.find(t=>t.path==macheta.path))
            {
                div.include = true;
            }
            else
            {
                div.include = false;
            }
        }

        dialogConfig2.data = {
            type: 'edit',
            values: this.divisions,
            value: macheta,
            fieldName: "macheta",
            instructions: this.machets,
            numarCerere: this.numarCerere
        };

        let dialogRef = this.dialog.open(DivisionSelectDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.addMaket.emit(result.divisions);
            }
        });
    }
    
      getConcatenatedDivision(divisions : any[])
    {
        let concatenatedDivision = '';
        for (let entry of divisions) {
            if(entry.description && entry.volume && entry.volumeQuantityMeasurement)
            {
                concatenatedDivision = concatenatedDivision + entry.description +' '+ entry.volume+' '+entry.volumeQuantityMeasurement.description+ '; ';
            }
            else if(entry.volume && entry.volumeQuantityMeasurement)
            {
                concatenatedDivision = concatenatedDivision + entry.volume+' '+entry.volumeQuantityMeasurement.description + '; ';
            }
            else
            {
                concatenatedDivision = concatenatedDivision + entry.description + '; ';
            }

        }
        return concatenatedDivision;
    }

}
