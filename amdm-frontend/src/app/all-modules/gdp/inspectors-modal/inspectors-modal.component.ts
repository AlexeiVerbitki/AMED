import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {GDPService} from '../../../shared/service/gdp.service';

@Component({
    selector: 'app-inspectors',
    templateUrl: './inspectors-modal.component.html',
    styleUrls: ['./inspectors-modal.component.css']
})
export class InspectorsModalComponent implements OnInit {
    title = '';
    priceEntity: FormGroup;
    idno: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<any>();
    columnsToDisplay = ['selected', 'lastname', 'firstname', 'scienceDegree', 'profession', 'code'];

    private subscriptions: Subscription[] = [];

    constructor(public dialogRef: MatDialogRef<InspectorsModalComponent>,
                private gdpService: GDPService,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.idno = data.idno;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    selectRow(row) {
        // this.dialogRef.close(row);
        row.selected = !row.selected;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.gdpService.getAllEmployees().subscribe(data => {
                    this.dataSource.data = data;
                    this.dataSource.data.forEach(r => {
                        r.selected = false;
                    });
                }
            ));
    }

    save() {
        this.dialogRef.close(this.dataSource.data.filter(row => row.selected));
    }


    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());
    }
}
