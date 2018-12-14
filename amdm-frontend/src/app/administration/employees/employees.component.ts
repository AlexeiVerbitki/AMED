import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  name: string;
  lastname: string;
  firstname: string;
  middlename: string;
  birth_date: Date;
  phonenumbers: string;
  address: string;
  idnp: string;
  identification_document_type_id: number;
  document_series: string;
  document_number: string;
  issue_date: Date;
  function: string;
  science_degree: string;
  profession_id: number;
  commision_order: number;
  chairman_of_experts: number;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 2, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 3, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 4, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 5, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 6, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 7, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 8, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 9, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },
  { id: 10, code: 'C12345', name: 'Name', lastname: 'Last name', firstname: 'First name', middlename: 'Middle Name', birth_date: new Date('03 03 2018'), phonenumbers: '+37361234567', address: 'Address', idnp: '200504321321', identification_document_type_id: 2133, document_series: 'S12345', document_number: 'N12345', issue_date: new Date('04 03 2018'), function: 'Function', science_degree: 'Science Degree', profession_id: 12345, commision_order: 123312, chairman_of_experts: 231312, action: '' },

];

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  visibility: boolean = false;
  title: string = 'Employees';

  displayedColumns: any[] = ['id', 'code', 'name', 'lastname', 'firstname', 'middlename', 'birth_date', 'phonenumbers', 'address', 'idnp', 'identification_document_type_id', 'document_series', 'document_number', 'issue_date', 'function', 'science_degree', 'profession_id', 'commision_order', 'chairman_of_experts', 'action'];
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

  changeVisibility() {
    this.visibility = !this.visibility;
  }

  codeEdit = new FormControl('', Validators.required);
  nameEdit = new FormControl('', Validators.required);
  lastnameEdit = new FormControl('', Validators.required);
  firstnameEdit = new FormControl('', Validators.required);
  middlenameEdit = new FormControl('', Validators.required);
  birth_dateEdit = new FormControl('', Validators.required);
  phonenumbersEdit = new FormControl('', Validators.required);
  addressEdit = new FormControl('', Validators.required);
  idnpEdit = new FormControl('', Validators.required);
  identification_document_type_idEdit = new FormControl('', Validators.required);
  document_seriesEdit = new FormControl('', Validators.required);
  document_numberEdit = new FormControl('', Validators.required);
  issue_dateEdit = new FormControl('', Validators.required);
  functionEdit = new FormControl('', Validators.required);
  science_degreeEdit = new FormControl('', Validators.required);
  profession_idEdit = new FormControl('', Validators.required);
  commision_orderEdit = new FormControl('', Validators.required);
  chairman_of_expertsEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  nameAdd = new FormControl('', Validators.required);
  lastnameAdd = new FormControl('', Validators.required);
  firstnameAdd = new FormControl('', Validators.required);
  middlenameAdd = new FormControl('', Validators.required);
  birth_dateAdd = new FormControl('', Validators.required);
  phonenumbersAdd = new FormControl('', Validators.required);
  addressAdd = new FormControl('', Validators.required);
  idnpAdd = new FormControl('', Validators.required);
  identification_document_type_idAdd = new FormControl('', Validators.required);
  document_seriesAdd = new FormControl('', Validators.required);
  document_numberAdd = new FormControl('', Validators.required);
  issue_dateAdd = new FormControl('', Validators.required);
  functionAdd = new FormControl('', Validators.required);
  science_degreeAdd = new FormControl('', Validators.required);
  profession_idAdd = new FormControl('', Validators.required);
  commision_orderAdd = new FormControl('', Validators.required);
  chairman_of_expertsAdd = new FormControl('', Validators.required);

}
