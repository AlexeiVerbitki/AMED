import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {GDPService} from '../../../shared/service/gdp.service';

@Component({
    selector: 'app-inspectors',
    templateUrl: './inspectors-modal.component.html',
    styleUrls: ['./inspectors-modal.component.css']
})
export class InspectorsModalComponent implements OnInit, AfterViewInit, OnDestroy {
    title = '';
    priceEntity: FormGroup;
    selectedInspectors : any[];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<any>();
    columnsToDisplay = ['selected', 'lastname', 'firstname', 'scienceDegree', 'profession', 'code'];

    private subscriptions: Subscription[] = [];

    constructor(public dialogRef: MatDialogRef<InspectorsModalComponent>,
                private gdpService: GDPService,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.selectedInspectors = data.selectedInspectors;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    selectRow(elem: any, row: any) {
        row.selected = elem.checked;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.gdpService.getAllEmployees().subscribe(data => {
                    this.dataSource.data = data;
                    this.dataSource.data.forEach(r => {
                        let selInsp = this.selectedInspectors.find(t=>t.id==r.id);
                        if(selInsp && selInsp.selected)
                        {
                            r.selected = true;
                        }
                        else {
                            r.selected = false;
                        }
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
