import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from "rxjs";
import {NomenclatorServices} from "../../../shared/service/nomenclator.services";

export interface Bank {
  id: number;
  cod: string;
  description: string;
  bankNumber: number;
  bankId: number;
  currency_id: number;
  treasurys_code: string;
  correspondent_bank_id: number;
  correspondent_info: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [];

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit {

  visibility: boolean = false;
  title: string = 'Bank accounts';

  private subscriptions: Subscription[] = [];

  displayedColumns: any[] = ['id', 'code', 'description', 'currencyId', 'treasuryCode', 'correspondentBankId', 'correspondentInfo', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private nomenclatorService: NomenclatorServices) {
   }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getBanksData();
  }

  getBanksData() {
    this.subscriptions.push(
        this.nomenclatorService.getAllBanksAccounts().subscribe(data => {
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
  bankNumEdit = new FormControl('', Validators.required);
  idValuteEdit = new FormControl('', Validators.required);
  treasureCodeEdit = new FormControl('', Validators.required);
  bankIdEdit = new FormControl('', Validators.required);
  infoEdit = new FormControl('', Validators.required);

  codAdd = new FormControl('', Validators.required);
  denumireAdd = new FormControl('', Validators.required);
  bankNumAdd = new FormControl('', Validators.required);
  idValuteAdd = new FormControl('', Validators.required);
  treasureCodeAdd = new FormControl('', Validators.required);
  bankIdAdd = new FormControl('', Validators.required);
  infoAdd = new FormControl('', Validators.required);

}
