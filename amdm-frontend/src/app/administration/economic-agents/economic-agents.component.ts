import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  name: string;
  idno: string;
  long_name: string;
  lccm_name: string;
  tax_code: string;
  ocpo_code: string;
  registration_number: string;
  registration_date: Date;
  parent_id: number;
  status: string;
  filiala: number;
  pharmacy_activity_id: number;
  can_use_psychotropic_drugs: number;
  license_series: string;
  license_number: string;
  license_issued_date: Date;
  license_expiration_date: Date;
  leader: string;
  director: string;
  contract_number: string;
  contract_date: Date;
  state_id: number;
  locality_id: number;
  street: string;
  legal_address: string;
  type_id: number;
  email: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 2, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 3, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 4, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 5, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 6, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 7, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 8, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 9, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},
  { id: 10, code: 'C12345', name: 'Name', idno: '213321312', long_name: 'Long Name', lccm_name: 'Lccm Name', tax_code: 'C12345', ocpo_code: 'O12345', registration_number: 'R12445', registration_date: new Date('03 03 2018'), parent_id: 321312, status: 'Status', filiala: 1321, pharmacy_activity_id: 321312, can_use_psychotropic_drugs: 123, license_series: 'S12345', license_number: 'Nr12345', license_issued_date: new Date('03 02 2018'), license_expiration_date: new Date('04 03 2018'), leader: 'Leader', director: 'Director', contract_number: 'CN12345', contract_date: new Date('01 01 2018'), state_id: 231321, locality_id: 31212, street: 'Adresa example', legal_address: 'Adresa Legala', type_id: 321321, email: 'nume@email.md', action: ''},

];

@Component({
  selector: 'app-economic-agents',
  templateUrl: './economic-agents.component.html',
  styleUrls: ['./economic-agents.component.css']
})
export class EconomicAgentsComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'name', 'idno', 'long_name', 'lccm_name', 'tax_code', 'ocpo_code', 'registration_number', 'registration_date', 'parent_id', 'status', 'filiala', 'pharmacy_activity_id', 'can_use_psychotropic_drugs', 'license_series', 'license_number', 'license_issued_date', 'license_expiration_date', 'leader', 'director', 'contract_number', 'contract_date', 'state_id', 'locality_id', 'street', 'legal_address', 'type_id', 'email', 'action'];
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

  codeEdit = new FormControl('', Validators.required);
  nameEdit = new FormControl('', Validators.required);
  idnoEdit = new FormControl('', Validators.required);
  long_nameEdit = new FormControl('', Validators.required);
  lccm_nameEdit = new FormControl('', Validators.required);
  tax_codeEdit = new FormControl('', Validators.required);
  ocpo_codeEdit = new FormControl('', Validators.required);
  registration_numberEdit = new FormControl('', Validators.required);
  registration_dateEdit = new FormControl('', Validators.required);
  parent_idEdit = new FormControl('', Validators.required);
  statusEdit = new FormControl('', Validators.required);
  filialaEdit = new FormControl('', Validators.required);
  pharmacy_activity_idEdit = new FormControl('', Validators.required);
  can_use_psychotropic_drugsEdit = new FormControl('', Validators.required);
  license_seriesEdit = new FormControl('', Validators.required);
  license_numberEdit = new FormControl('', Validators.required);
  license_issued_dateEdit = new FormControl('', Validators.required);
  license_expiration_dateEdit = new FormControl('', Validators.required);
  leaderEdit = new FormControl('', Validators.required);
  directorEdit = new FormControl('', Validators.required);
  contract_numberEdit = new FormControl('', Validators.required);
  contract_dateEdit = new FormControl('', Validators.required);
  state_idEdit = new FormControl('', Validators.required);
  locality_idEdit = new FormControl('', Validators.required);
  streetEdit = new FormControl('', Validators.required);
  legal_addressEdit = new FormControl('', Validators.required);
  type_idEdit = new FormControl('', Validators.required);
  emailEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  nameAdd = new FormControl('', Validators.required);
  idnoAdd = new FormControl('', Validators.required);
  long_nameAdd = new FormControl('', Validators.required);
  lccm_nameAdd = new FormControl('', Validators.required);
  tax_codeAdd = new FormControl('', Validators.required);
  ocpo_codeAdd = new FormControl('', Validators.required);
  registration_numberAdd = new FormControl('', Validators.required);
  registration_dateAdd = new FormControl('', Validators.required);
  parent_idAdd = new FormControl('', Validators.required);
  statusAdd = new FormControl('', Validators.required);
  filialaAdd = new FormControl('', Validators.required);
  pharmacy_activity_idAdd = new FormControl('', Validators.required);
  can_use_psychotropic_drugsAdd = new FormControl('', Validators.required);
  license_seriesAdd = new FormControl('', Validators.required);
  license_numberAdd = new FormControl('', Validators.required);
  license_issued_dateAdd = new FormControl('', Validators.required);
  license_expiration_dateAdd = new FormControl('', Validators.required);
  leaderAdd = new FormControl('', Validators.required);
  directorAdd = new FormControl('', Validators.required);
  contract_numberAdd = new FormControl('', Validators.required);
  contract_dateAdd = new FormControl('', Validators.required);
  state_idAdd = new FormControl('', Validators.required);
  locality_idAdd = new FormControl('', Validators.required);
  streetAdd = new FormControl('', Validators.required);
  legal_addressAdd = new FormControl('', Validators.required);
  type_idAdd = new FormControl('', Validators.required);
  emailAdd = new FormControl('', Validators.required);
  
}
