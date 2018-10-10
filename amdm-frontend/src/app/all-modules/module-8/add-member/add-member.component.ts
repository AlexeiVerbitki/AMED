import {Component, OnInit} from '@angular/core';

import {Institut} from '../../../models/Institut';

import {getFunctia} from '../../../models/getFunctia';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  zForm: FormGroup;
  institut: Institut[] = [
    {value: 'none-0', viewValue: '(None)'},
    {value: 'agentia-1', viewValue: 'Agentia Municipala Ecologica'},
    {value: 'centrul-2', viewValue: 'Centrul National Stiintifico-Practic de Medicina Preventiva'}
  ];
  functia: getFunctia[] = [
    {value: 'none-0', viewValue: '(None)'},
    {value: 'doctor-1', viewValue: 'Doctor'},
    {value: 'prof-univ-2', viewValue: 'Prof. Univ.'},
    {value: 'conferentiar-2', viewValue: 'Conferentiar'}
  ];

  constructor(private fb: FormBuilder) {
    this.zForm = fb.group({
      'institutia': [null, Validators.required],
      'nume': [null, Validators.required],
      'prenume': [null, Validators.required],
      'functia': [null, Validators.required]
    });
  }

  ngOnInit() {
  }


  addForm() {
    console.log(this.zForm.value);
    this.zForm.reset();
  }

  cancel() {
    this.zForm.reset();
  }

}
