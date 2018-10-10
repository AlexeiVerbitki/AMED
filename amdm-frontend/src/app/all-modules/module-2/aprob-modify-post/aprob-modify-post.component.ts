import {Component, OnInit} from '@angular/core';
import {Aprob} from '../../../models/aprob';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select} from '../../../models/select';
import {DocumentDeIesire} from '../../../models/documentDeIesire';

@Component({
    selector: 'app-aprob-modify-post',
    templateUrl: './aprob-modify-post.component.html',
    styleUrls: ['./aprob-modify-post.component.css']
})

export class AprobModifyPostComponent implements OnInit {
    zForm: FormGroup;
    dataForm: FormGroup;
    aprob: Aprob[] = [
        {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
        {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
        {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
        {denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    ];
    compSolicitant: Select[] = [
        {value: 'companie-1', viewValue: 'Companie Solicitanta 1'},
        {value: 'companie-2', viewValue: 'Companie Solicitanta 2'},
        {value: 'companie-3', viewValue: 'Companie Solicitanta 3'},
        {value: 'companie-4', viewValue: 'Companie Solicitanta 4'},
    ];
    tipPost: Select[] = [
        {value: 'tip-1', viewValue: 'Tipul 1'},
        {value: 'tip-2', viewValue: 'Tipul 2'},
        {value: 'tip-3', viewValue: 'Tipul 3'},
        {value: 'tip-4', viewValue: 'Tipul 4'},
        {value: 'tip-5', viewValue: 'Tipul 5'},
        {value: 'tip-6', viewValue: 'Tipul 6'},
    ];
    forma: Select[] = [
        {value: 'forma-1', viewValue: 'Forma 1'},
        {value: 'forma-2', viewValue: 'Forma 2'},
        {value: 'forma-3', viewValue: 'Forma 3'},
        {value: 'forma-4', viewValue: 'Forma 4'},
    ];
    tara: Select[] = [
        {value: 'tara-1', viewValue: 'Tara 1'},
        {value: 'tara-2', viewValue: 'Tara 2'},
        {value: 'tara-3', viewValue: 'Tara 3'},
        {value: 'tara-4', viewValue: 'Tara 4'},
    ];
    document: DocumentDeIesire[] = [
        {denumirea: 'Bonurile de plată', statut: 'Generat'},
        {denumirea: 'Dispoziția de distribuire', statut: 'Generat'},
        {denumirea: 'Scrisoare de solicitare a informației', statut: 'Generat'},
        {denumirea: 'Ordinul de aprobare a modificărilor postautorizare', statut: 'Generat'},
        {denumirea: 'Ordin de întrerupere a procedurii de aprobare a modificărilor postautorizare', statut: 'Generat'},
        {denumirea: 'Modificarea la Certificatul de autorizare a medicamentului', statut: 'Generat'},
        {denumirea: 'Raportul pentru Comisia Medicamentului', statut: 'Generat'},
        {denumirea: 'Funcția de raportare flexibilă', statut: 'Generat'},
    ];

    constructor(private fb: FormBuilder) {
        this.zForm = fb.group({
            'dataReg': [null, Validators.required],
            'numarCerere': [null, Validators.required],
            'companiaSolicitant': [null, Validators.required],
            'nrRegMed': [null, Validators.required],
            'denumireComerciala': [null, Validators.required],
            'denumireInternationala': [null, Validators.required],
            'codulAtc': [null, Validators.required],
            'formaFarmaceutica': [null, Validators.required],
            'tipulModPost': [null, Validators.required],
            'nrOrdAprob': [null, Validators.required],
            'dataOrdAprob': [null, Validators.required],
            'nrOrdIntrerupere': [null, Validators.required],
            'dataOrdIntrerupere': [null, Validators.required],
            'motivulIntrerupere': [null, Validators.required],
            'denumireDetinCert': [null, Validators.required],
            'taraDetinCert': [null, Validators.required],
            'raionCert': [null, Validators.required],
            'localitateCert': [null, Validators.required],
            'stradaCert': [null, Validators.required],
            'nrCert': [null, Validators.required],
            'blocCert': [null, Validators.required],
            'numarCert': [null, Validators.required],
            'denumireProdSubsActiv': [null, Validators.required],
            'taraProdSubsActiv': [null, Validators.required],
            'raionProdSubsActiv': [null, Validators.required],
            'localitateProdSubsActiv': [null, Validators.required],
            'stradaProdSubsActiv': [null, Validators.required],
            'nrProdSubsActiv': [null, Validators.required],
            'blocProdSubsActiv': [null, Validators.required],
            'numarProdSubsActiv': [null, Validators.required],
            'denumireProdFinit': [null, Validators.required],
            'taraProdFinit': [null, Validators.required],
            'raionProdFinit': [null, Validators.required],
            'localitateProdFinit': [null, Validators.required],
            'stradaProdFinit': [null, Validators.required],
            'nrProdFinit': [null, Validators.required],
            'blocProdFinit': [null, Validators.required],
            'numarProdFinit': [null, Validators.required],
        });
        this.dataForm = fb.group({
            'data': {disabled: true, value: null},
            'nrCererii': [null, Validators.required]
          });
    }

    ngOnInit() {
    }

}
