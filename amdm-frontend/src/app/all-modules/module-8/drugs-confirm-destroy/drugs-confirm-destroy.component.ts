import {Component, OnInit} from '@angular/core';
import {getCerere} from '../../../models/getCerere';
import {ComisieNimicire} from '../../../models/ComisieNimicire';
import {Documents} from '../../../models/documents';
import {Select} from '../../../models/select';

@Component({
  selector: 'app-drugs-confirm-destroy',
  templateUrl: './drugs-confirm-destroy.component.html',
  styleUrls: ['./drugs-confirm-destroy.component.css']
})
export class DrugsConfirmDestroyComponent implements OnInit {
  model3: string;
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
  forma: Select[] = [
    {value: 'forma-1', viewValue: 'Forma 1'},
    {value: 'forma-2', viewValue: 'Forma 2'},
    {value: 'forma-3', viewValue: 'Forma 3'},
    {value: 'forma-4', viewValue: 'Forma 4'},
    {value: 'forma-5', viewValue: 'Forma 5'}
  ];

  constructor() {
  }

  ngOnInit() {
    this.model3 = 'B2';
  }
}
