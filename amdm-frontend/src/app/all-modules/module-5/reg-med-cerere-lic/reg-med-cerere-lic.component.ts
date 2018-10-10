import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {Select} from '../../../models/select';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-reg-med-cerere-lic',
    templateUrl: './reg-med-cerere-lic.component.html',
    styleUrls: ['./reg-med-cerere-lic.component.css']
})
export class RegMedCerereLicComponent implements OnInit {

    date: any = new FormControl({value: new Date(), disabled: true});
    model: string;
    selectCPCD: string;
    selectASP: string;

    public cerere: getCerere[] = [
        {denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
        {denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
        {denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
        {denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
        {denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
    ];
    compania: Select[] = [
        {value: '1', viewValue: 'A SRL'},
        {value: '2', viewValue: 'B SRL'},
        {value: '3', viewValue: 'C SRL'},
    ];
    tipCerere: Select[] = [
        {value: '1', viewValue: 'Tip 1'},
        {value: '2', viewValue: 'Tip 2'},
        {value: '3', viewValue: 'Tip 3'},
    ];
    cpcd: Select[] = [
        {value: 'none', viewValue: 'None'},
        {value: 'Email', viewValue: 'Email'},
        {value: 'phone', viewValue: 'Phone'},
    ];
    asp: Select[] = [
        {value: 'none', viewValue: 'None'},
        {value: 'Email', viewValue: 'Email'},
        {value: 'phone', viewValue: 'Phone'},
    ];

    constructor() {

    }

    ngOnInit() {
        this.model = 'A';
    }


}
