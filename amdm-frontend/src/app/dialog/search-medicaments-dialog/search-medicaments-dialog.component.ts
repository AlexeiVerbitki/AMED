import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoaderService} from '../../shared/service/loader.service';
import {MedicamentService} from '../../shared/service/medicament.service';

@Component({
  selector: 'app-search-medicaments-dialog',
  templateUrl: './search-medicaments-dialog.component.html',
  styleUrls: ['./search-medicaments-dialog.component.css']
})
export class SearchMedicamentsDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  //Datasource table
  displayedColumns: any[] = ['code', 'name', 'registrationNumber', 'division', 'volume', 'volumeQuantityMeasurement'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  visibility = false;
  rFormSubbmitted = false;
  rForm: FormGroup;

  constructor(private fb: FormBuilder,
              private loadingService: LoaderService,
              public dialogRef: MatDialogRef<SearchMedicamentsDialogComponent>,
              private medicamentService: MedicamentService
             ) {
  }

  ngOnInit() {

    this.initFormData();

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Medicamente per pagina: ';
    this.dataSource.sort = this.sort;
  }

  private initFormData() {
    this.rForm = this.fb.group({
      'code': null,
      'commercialName': null,
      'registerNumber': null,
      'internationalName': null,
      'response': null,
      'medicaments': null,
    });
  }

  getMedicaments() {
    const dto = this.rForm.value;
    this.subscriptions.push(
        this.medicamentService.getMedicamentsByFilter(dto
        ).subscribe(request => {
              this.dataSource.data = request.body;
            },
            error => console.log(error)
        ));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  changeVisibility() {
    this.visibility = !this.visibility;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  add() {
    this.rForm.get('response').setValue(true);
    this.rForm.get('medicaments').setValue(this.dataSource.data);
    this.dialogRef.close(this.rForm.value);
  }

  cancel() {
    this.rForm.get('response').setValue(false);
    this.dialogRef.close(this.rForm.value);
  }

}
