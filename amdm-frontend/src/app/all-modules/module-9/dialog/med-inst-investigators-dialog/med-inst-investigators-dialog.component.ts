import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-inst-investigators-dialog',
  templateUrl: './med-inst-investigators-dialog.component.html',
  styleUrls: ['./med-inst-investigators-dialog.component.css']
})
export class MedInstInvestigatorsDialogComponent implements OnInit {
  color: string;

  choices: any[] = [];
  isInvestigatorPrincipal: false;

  investigators : any[] = [];
  items: any[] = [];
  investigatorsList : any[] = [];

  constructor() { }
  medInstInvestigatorsGroup = new FormGroup({
    instMed: new FormControl({value:'IMSP Institutul de Medicină Urgent', disabled: true}),
  });


  ngOnInit() {
    this.color = 'warm';
    this.addInvestigators();
  }

  addInvestigators(){
    this.investigators.push({
      investigator: this.investigatorsList,
      selectedInvestigator: {}
    })
  }

  removeInvestigator(i){
    this.investigators.splice(i, 1);
  }
}
