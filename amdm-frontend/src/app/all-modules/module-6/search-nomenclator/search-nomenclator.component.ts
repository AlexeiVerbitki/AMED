import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-search-nomenclator',
  templateUrl: './search-nomenclator.component.html',
  styleUrls: ['./search-nomenclator.component.css']
})
export class SearchNomenclatorComponent implements OnInit {

  rForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rForm = fb.group({
      'denumireaComerciala': [null, Validators.required],
      'dci': [null, Validators.required],
      'formaFarmaceutica': [null, Validators.required],
      'codAtc': [null, Validators.required],
      'codCim': [null, Validators.required],
      'firmaTaraDetApp': [null, Validators.required],
    });
  }

  ngOnInit() {
  }

}
