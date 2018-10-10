import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  request_number: string;
  start_date: Date;
  end_date: Date;
  medicament_id: number;
  company_id: number;
  import_id: number;
  license_id: number;
  username: string;
  step_id: number;
  type_id: number;
  medicament_annihilation_id: number;
  medicament_control_committee_id: number;
  clinical_trails_id: number;
  applicant_id: number;
  tax_id: number;
  tax_paid: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 2, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 3, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 4, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 5, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 6, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 7, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 8, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 9, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 10, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 11, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 12, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 13, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 14, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 15, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 16, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 17, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 18, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 19, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 20, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 21, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 22, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 23, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 24, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
  { id: 25, request_number: '12312321321', start_date: new Date('03 03 2018'), end_date: new Date('04 04 2018'), medicament_id: 132321312, company_id: 312321312, import_id: 321321321, license_id: 213321312, username: 'Username', step_id: 3132121, type_id: 312312, medicament_annihilation_id: 132321321, medicament_control_committee_id: 312321321, clinical_trails_id: 132321312, applicant_id: 312312132, tax_id: 123312312312, tax_paid: 123321132, action: '' },
];


@Component({
  selector: 'app-registration-request',
  templateUrl: './registration-request.component.html',
  styleUrls: ['./registration-request.component.css']
})
export class RegistrationRequestComponent implements OnInit {
  displayedColumns: any[] = ['id', 'request_number', 'start_date', 'end_date', 'medicament_id', 'company_id', 'import_id', 'license_id', 'username', 'step_id', 'type_id', 'medicament_annihilation_id', 'medicament_control_committee_id', 'clinical_trails_id' , 'applicant_id', 'tax_id', 'tax_paid', 'action'];
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

  request_numberEdit = new FormControl('', Validators.required);
  start_dateEdit = new FormControl('', Validators.required);
  end_dateEdit = new FormControl('', Validators.required);
  medicament_idEdit = new FormControl('', Validators.required);
  company_idEdit = new FormControl('', Validators.required);
  import_idEdit = new FormControl('', Validators.required);
  license_idEdit = new FormControl('', Validators.required);
  usernameEdit = new FormControl('', Validators.required);
  step_idEdit = new FormControl('', Validators.required);
  type_idEdit = new FormControl('', Validators.required);
  medicament_annihilation_idEdit = new FormControl('', Validators.required);
  medicament_control_committee_idEdit = new FormControl('', Validators.required);
  clinical_trails_idEdit = new FormControl('', Validators.required);
  applicant_idEdit = new FormControl('', Validators.required);
  tax_idEdit = new FormControl('', Validators.required);
  tax_paidEdit = new FormControl('', Validators.required);

  request_numberAdd = new FormControl('', Validators.required);
  start_dateAdd = new FormControl('', Validators.required);
  end_dateAdd = new FormControl('', Validators.required);
  medicament_idAdd = new FormControl('', Validators.required);
  company_idAdd = new FormControl('', Validators.required);
  import_idAdd = new FormControl('', Validators.required);
  license_idAdd = new FormControl('', Validators.required);
  usernameAdd = new FormControl('', Validators.required);
  step_idAdd = new FormControl('', Validators.required);
  type_idAdd = new FormControl('', Validators.required);
  medicament_annihilation_idAdd = new FormControl('', Validators.required);
  medicament_control_committee_idAdd = new FormControl('', Validators.required);
  clinical_trails_idAdd = new FormControl('', Validators.required);
  applicant_idAdd = new FormControl('', Validators.required);
  tax_idAdd = new FormControl('', Validators.required);
  tax_paidAdd = new FormControl('', Validators.required);



}
