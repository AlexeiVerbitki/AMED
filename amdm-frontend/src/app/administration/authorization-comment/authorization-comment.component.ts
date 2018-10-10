import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface Bank {
  id: number;
  code: string;
  description: string;
  comment: string;
  action: any;
}

const ELEMENT_DATA: Bank[] = [
  { id: 1, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 2, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 3, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 4, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 5, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 6, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 7, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 8, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 9, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },
  { id: 10, code: 'C12345', description: 'Description', comment: 'Comment', action: '' },

];

@Component({
  selector: 'app-authorization-comment',
  templateUrl: './authorization-comment.component.html',
  styleUrls: ['./authorization-comment.component.css']
})
export class AuthorizationCommentComponent implements OnInit {
  displayedColumns: any[] = ['id', 'code', 'description', 'comment', 'action'];
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
  descriptionEdit = new FormControl('', Validators.required);
  commentEdit = new FormControl('', Validators.required);

  codeAdd = new FormControl('', Validators.required);
  descriptionAdd = new FormControl('', Validators.required);
  commentAdd = new FormControl('', Validators.required);

}
