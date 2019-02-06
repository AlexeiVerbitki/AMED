import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {GDPService} from '../../../shared/service/gdp.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-select-subsidiary',
    templateUrl: './select-subsidiary-modal.component.html',
    styleUrls: ['./select-subsidiary-modal.component.css']
})
export class SelectSubsidiaryModalComponent implements OnInit {
    title = '';
    priceEntity: FormGroup;
    subsidiaryList: any[] = [];
    idno: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<any>();
    columnsToDisplay = ['selected', 'nr', 'companyType', 'address', 'selectedPharmaceutist', 'activitiesStr'];

    private subscriptions: Subscription[] = [];

    constructor(public dialogRef: MatDialogRef<SelectSubsidiaryModalComponent>,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.idno = data.idno;
        this.subsidiaryList = data.subsidiaryList;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    save() {
        this.dialogRef.close(this.dataSource.data.filter(row => row.selected))
    }

    selectRow(elem : any, row : any) {
        row.selected = elem.checked;
    }
    ngOnInit() {
        this.dataSource.data = this.subsidiaryList;
        this.dataSource.data.forEach(r => {
            r.selected = false;
        });
    }


    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
    }
}