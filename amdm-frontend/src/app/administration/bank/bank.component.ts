import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from "rxjs";
import {NomenclatorServices} from "../../shared/service/nomenclator.services";

export interface Bank {
  id: number;
  cod: string;
  description: string;
  parent: number;
  long_description: string;
  address: string;
  bank_code: string;
  phonenumbers: string;
  action: any;
  }

const ELEMENT_DATA: Bank[] = [];

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  title: string = 'Bank';

  private subscriptions: Subscription[] = [];
  visibility: boolean = false;

  displayedColumns: any[] = ['id', 'code', 'description', 'parent', 'longDescription', 'address', 'bankCode', 'phonenumbers', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(  private nomenclatorService: NomenclatorServices) {

   }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getBanksData();
  }

  getBanksData() {
    this.subscriptions.push(
        this.nomenclatorService.getAllBanks().subscribe(data => {
              console.log(data);
              this.dataSource.data = data;
            },
            error => console.log(error)
        )
    );
  }

  changeVisibility() {
    this.visibility = !this.visibility;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  codEdit = new FormControl('', Validators.required);
  denumireEdit = new FormControl('', Validators.required);
  parentEdit = new FormControl('', Validators.required);
  denumireaFullEdit = new FormControl('', Validators.required);
  adresaEdit = new FormControl('', Validators.required);
  contEdit = new FormControl('', Validators.required);
  phoneEdit = new FormControl('', Validators.required);

  codAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);
  parentAdd = new FormControl('', Validators.required);
  denumireaFullAdd = new FormControl('', Validators.required);
  adresaAdd= new FormControl('', Validators.required);
  contAdd = new FormControl('', Validators.required);
  phoneAdd = new FormControl('', Validators.required);

}
