import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userInternalList: any = [
    {id: 1, firstName: 'Charlotte', lastName: 'Armstrong', job: 'Job', phone: '+37360123456', selected: false },
    {id: 2, firstName: 'Mollie', lastName: 'Harber', job: 'Job', phone: '+37361123456', selected: true  },
    {id: 3, firstName: 'Jermey', lastName: 'Cruickshank', job: 'Job', phone: '+37362123456', selected: false  },
    {id: 4, firstName: 'Jeanie', lastName: 'Volkman', job: 'Job', phone: '+37363123456', selected: true  },
    {id: 5, firstName: 'Aleen', lastName: 'Collier', job: 'Job', phone: '+37364123456', selected: false  },
  ];

  userExternalList: any = [
  {id: 1, firstName: 'Greyson', lastName: 'West', job: 'National Metrics Consultant', phone: '+37360123456', selected: true},
  {id: 2, firstName: 'Johan', lastName: 'Hansen', job: 'Dynamic Operations Specialist', phone: '+37361123456', selected: false},
  {id: 3, firstName: 'Nola', lastName: 'Bartell', job: 'Chief Functionality Architect', phone: '+37362123456', selected: true},
  {id: 4, firstName: 'Stephania', lastName: 'Gibson', job: 'Direct Team Analyst', phone: '+37363123456', selected: false},
  {id: 5, firstName: 'Abdul', lastName: 'Bayer', job: 'National Markets Technician', phone: '+37364123456', selected: false},
  {id: 6, firstName: 'Jaylin', lastName: 'Crona', job: 'Regional Factors Representative', phone: '+37365123456', selected: true},
  {id: 7, firstName: 'Nova', lastName: 'Rodriguez', job: 'Principal Communications Assistant', phone: '+37366123456', selected: false},
  {id: 8, firstName: 'Clementina', lastName: 'Lueilwitz', job: 'Interactive Paradigm Coordinator', phone: '+37367123456', selected: true},
  ];

  constructor() {
  }

  selectAll($event) {
    this.userInternalList.forEach(e => e.selected = $event.checked);
  }

  selectAll2($event) {
    this.userExternalList.forEach(e => e.selected = $event.checked);
  }

  selectUser(i, $event) {
    this.userInternalList[i].selected = $event.checked;
  }

  selectUser2(i, $event) {
    this.userExternalList[i].selected = $event.checked;
  }

  ngOnInit() {
  }



}
