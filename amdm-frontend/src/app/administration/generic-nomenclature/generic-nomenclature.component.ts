import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdministrationService} from '../../shared/service/administration.service';
import {ModalDirective} from 'angular-bootstrap-md';
import {NomenclatureConstants} from '../administration.constants';
import {Subscription} from 'rxjs';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {LoaderService} from '../../shared/service/loader.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-generic-nomenclature',
  templateUrl: './generic-nomenclature.component.html',
  styleUrls: ['./generic-nomenclature.component.css']
})
export class GenericNomenclatureComponent implements OnInit {
  displayedColumns: any[] = [];
  dataSource = new MatTableDataSource<any>();

  forEdit: boolean;
  selectedRow: any = {};
  selectedRowIndex: number;

  selectedNomenclature: any;
  columns: any[] = [];

  pageId: string;

  private subscriptions: Subscription[] = [];
  nomenclatures = NomenclatureConstants;

  @ViewChild('basicModal') basicModal: ModalDirective;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private administrationService: AdministrationService,
              private navbarTitleService: NavbarTitleService,
              private loadingService: LoaderService,
              private activatedRoute: ActivatedRoute, ) {
  }

  ngOnInit() {
    this.navbarTitleService.showTitleMsg('Lista de nomenclatoare');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
       this.pageId = params['id'];
       this.selectedNomenclature = this.nomenclatures[+this.pageId - 1];
       this.navbarTitleService.showTitleMsg(this.selectedNomenclature.title);
       this.getNomenclature(this.selectedNomenclature.nr);
    }));
  }

  getNomenclature(nomenclatureNr) {
    this.loadingService.show();
    this.subscriptions.push(this.administrationService.getNomenclatureDate(nomenclatureNr).subscribe(data => {
        this.dataSource.data = data;

        const elem = data[0];
        this.dataSource.data.splice(0, 1);
        const cols = [];

        Object.keys(elem).forEach(function(key, index, value) {
          cols.push({
            columnDef: key,
            header: elem[key],
            cell: (element: Element) => `${element[key]}`,
          });
        });

        this.columns = cols;
        this.displayedColumns = this.columns.filter(c => c.header).map(c => c.columnDef);
        this.displayedColumns.push('action');

        this.dataSource._updateChangeSubscription();
        this.loadingService.hide();
    }, error1 => this.loadingService.hide()));
  }

  addNew() {
    this.selectedRow = {};
    this.forEdit = false;
    this.basicModal.show();
  }

  edit(index: number, element) {
    this.selectedRowIndex = index;
    const objValue = {};
    Object.keys(element).forEach(function (key, index, value) {
      if (element[key] && element[key] != null) {
        objValue[key] = element[key];
      }
    });
    this.selectedRow = objValue; //Object.assign({}, element);
    this.forEdit = true;
    this.basicModal.show();
  }

  valueChanged(columnName: string, newValue) {
    this.selectedRow[columnName] = newValue;
  }

  deleteRow(index: number, row: any) {
    if (row && row.id > -1) {
      this.loadingService.show();
      this.subscriptions.push(this.administrationService.removeNomenclatureRow(this.selectedNomenclature.nr, row.id).subscribe(deleted => {
        if (deleted) {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }

        this.loadingService.hide();
      }, error1 => this.loadingService.hide()));
    }
  }

  saveRow() {
    this.loadingService.show();
    if (this.selectedRow.id) {
      this.subscriptions.push(this.administrationService.updateNomenclatureRow(this.selectedNomenclature.nr, this.selectedRow).subscribe(res => {
        if (res.body) {
          const addedRow = this.selectedRow;
          this.columns.forEach(c => {
              if (addedRow[c.columnDef] == undefined) {
                  addedRow[c.columnDef] = null;
              }
          });
          this.dataSource.data[this.selectedRowIndex] = this.selectedRow;
          this.selectedRowIndex = undefined;
          this.dataSource._updateChangeSubscription();
        }
        this.basicModal.hide();
        this.loadingService.hide();
      }, error1 => this.loadingService.hide()));

    } else {
      this.subscriptions.push(this.administrationService.insertNomenclatureRow(this.selectedNomenclature.nr, this.selectedRow).subscribe(res => {
        if (res.body && res.body > 0) {
          const addedRow = this.selectedRow;
            this.columns.forEach(c => {
                if (addedRow[c.columnDef] == undefined) {
                    addedRow[c.columnDef] = null;
                }
            });
          this.selectedRow.id = res.body;
          this.dataSource.data.push(this.selectedRow);
          this.dataSource._updateChangeSubscription();
        }
        this.basicModal.hide();
        this.loadingService.hide();
      }, e => this.loadingService.hide()));
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.navbarTitleService.showTitleMsg('');
    this.subscriptions.forEach(value => value.unsubscribe());
  }
}
