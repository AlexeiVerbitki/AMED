import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {ComisieNimicire} from '../../../models/ComisieNimicire';
import {Documents} from '../../../models/documents';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-drugs-destroy-demand',
  templateUrl: './drugs-destroy-demand.component.html',
  styleUrls: ['./drugs-destroy-demand.component.css']
})
export class DrugsDestroyDemandComponent implements OnInit {
  dataForm: FormGroup;
  model3: string;

  constructor(private fb: FormBuilder) {
    this.dataForm = fb.group({
      'data': { disabled: true, value: null },
      'nrCererii': [null, Validators.required]
    });
  }

  public cerere: getCerere[] = [
    {denumirea: 'Cerere de nimicire a medicamentelor 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018'},
    {denumirea: 'Cerere de nimicire a medicamentelor 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018'}
  ];

  comisiaNimicire: ComisieNimicire[] = [
    {institut: 'Agentia Municipala Ecologica', numePrenume: 'User 1', functie: 'Doctor in Chimie'},
    {institut: 'Centrul National Stiintifico-Practic de Medicina Preventiva', numePrenume: 'User 2', functie: 'Doctor'},
  ];

  document: Documents[] = [
    {denumire: 'Bon de plata'},
    {denumire: 'Act de receptie a medicamentelor'},
    {denumire: 'Scrisoare de solicitare Agentia Municipala Ecologica'},
    {denumire: 'Scrisoare de solicitare catre Centrul National Stiintifico-Practic de Medicina Preventiva'},
    {denumire: 'Proces-verbal privind nimicirea inofensiva a medicamentelor'},
  ];

  ngOnInit() {
    this.model3 = 'B2';
  }
}
