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
import {SuccessOrErrorHandlerService} from '../../shared/service/success-or-error-handler.service';
import {ConfirmationDialogComponent} from '../../dialog/confirmation-dialog.component';
import {DivisionSelectDialogComponent} from '../../dialog/division-select-dialog/division-select-dialog.component';

@Component({
    selector: 'app-instruction',
    templateUrl: './instruction.component.html',
    styleUrls: ['./instruction.component.css']
})
export class InstructionComponent implements OnInit, OnDestroy {

    instructionList: any[];
    divisionList: any[];
    numarCerere: string;
    isModify = false;
    enableUploading = true;
    private subscriptions: Subscription[] = [];
    @Output() removeInstr = new EventEmitter();
    @Output() addInstr = new EventEmitter();

    constructor(public dialog: MatDialog,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private uploadService: UploadFileService) {
    }

    get canUpload(): boolean {
        return this.enableUploading;
    }

    @Input()
    set canUpload(can: boolean) {
        this.enableUploading = can;
    }

    get instructions(): any[] {
        return this.instructionList;
    }

    @Input()
    set instructions(inList: any[]) {
        this.instructionList = inList;
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

    removeInstruction(index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta instructiune?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const path = this.instructions[index].path;
                this.subscriptions.push(this.uploadService.removeFileFromStorage(path).subscribe(data => {
                        this.instructions.splice(index, 1);
                        this.removeInstr.emit(path);
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        });
    }

    viewFile(instruction: any) {
            this.subscriptions.push(this.uploadService.loadFile(instruction.path).subscribe(data => {
                    const file = new Blob([data], {type: instruction.typeDoc});
                    const fileURL = URL.createObjectURL(file);
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

        this.divisions.forEach(t => t.include = false);
        dialogConfig2.data = {type: 'add', values: this.divisions, fieldName : 'instr', instructions : this.instructions, numarCerere : this.numarCerere};

        const dialogRef = this.dialog.open(DivisionSelectDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.addInstr.emit(result.divisions);
            }
        });
    }

    edit(instruction: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        for (const div of this.divisions) {
            if (div.instructions.find(t => t.path == instruction.path)) {
                div.include = true;
            } else {
                div.include = false;
            }
        }

        dialogConfig2.data = {type: 'edit', values: this.divisions, value: instruction, fieldName : 'instr', instructions : this.instructions, numarCerere : this.numarCerere};

        const dialogRef = this.dialog.open(DivisionSelectDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.addInstr.emit(result.divisions);
            }
        });
    }

    getConcatenatedDivision(divisions: any[]) {
        let concatenatedDivision = '';
        for (const entry of divisions) {
            if (entry.description && entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.description + ' ' + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
            } else if (entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
            } else {
                concatenatedDivision = concatenatedDivision + entry.description + '; ';
            }

        }
        return concatenatedDivision;
    }


}
