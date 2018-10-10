import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  economic_agent_id: number;
  bank_account_id: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 2, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 3, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 4, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 5, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 6, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 7, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 8, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 9, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 10, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 11, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 12, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 13, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 14, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 15, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 16, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 17, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 18, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 19, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 20, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 21, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 22, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 23, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 24, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },
  { id: 25, economic_agent_id: 123321, bank_account_id: 1231312, action: '' },

];

@Component({
  selector: 'app-economic-agent-bank-accounts',
  templateUrl: './economic-agent-bank-accounts.component.html',
  styleUrls: ['./economic-agent-bank-accounts.component.css']
})
export class EconomicAgentBankAccountsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'economic_agent_id', 'bank_account_id', 'action'];
  dataSource = new MatTableDataSource<Bank>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  economic_agent_idEdit = new FormControl('', Validators.required);
  bank_account_idEdit = new FormControl('', Validators.required);

  economic_agent_idAdd = new FormControl('', Validators.required);
  bank_account_idAdd = new FormControl('', Validators.required);

}
