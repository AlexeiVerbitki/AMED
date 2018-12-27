import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DdListComponent} from "./dd-list/dd-list.component";
import {OaListComponent} from "./oa-list/oa-list.component";
import {RequestsDdComponent} from "./requests-dd/requests-dd.component";
import {MedicamentsOaComponent} from "./medicaments-oa/medicaments-oa.component";
import {OiListComponent} from "./oi-list/oi-list.component";
import {RequestsOiComponent} from "./requests-oi/requests-oi.component";

@Component({
    selector: 'app-generate-documents',
    templateUrl: './generate-documents.component.html',
    styleUrls: ['./generate-documents.component.css']
})
export class GenerateDocumentsComponent implements OnInit {

    gForm: FormGroup;
    @ViewChild('ddList') ddListHtml: DdListComponent;
    @ViewChild('oaList') oaListHtml: OaListComponent;
    @ViewChild('oiList') oiListHtml: OiListComponent;
    @ViewChild('requestDD') requestDD: RequestsDdComponent;
    @ViewChild('medicamentsOA') medicamentsOA: MedicamentsOaComponent;
    @ViewChild('requestOI') requestOI: RequestsOiComponent;
    typeG: string = 'DD';

    constructor(private fb: FormBuilder) {
        this.gForm = this.fb.group({
            'tipGenerare': ['DD']
        })

        this.gForm.get('tipGenerare').valueChanges.subscribe(
            r => {
                this.typeG = r;
                if (r == 'OA') {
                    this.medicamentsOA.loadMedicamentsForOA();
                    this.oaListHtml.loadOAs();
                } else if (r == 'OI') {
                    this.requestOI.loadRequestForOI();
                    this.oiListHtml.loadOIs();
                } else {
                    this.requestDD.loadRequestForDD();
                    this.ddListHtml.loadDDs();
                }
            }
        );
    }

    ngOnInit() {
        if (this.requestDD) {
            this.requestDD.loadRequestForDD();
        }
        if (this.ddListHtml) {
            this.ddListHtml.loadDDs();
        }
    }


    ngAfterViewInit(): void {
        this.ddListHtml.loadDDs();
        this.requestDD.loadRequestForDD();
    }

    ddListModified(event) {
        this.requestDD.loadRequestForDD();
    }

    oiListModified(event) {
        this.requestOI.loadRequestForOI();
    }

    oaListModified(event) {
        this.medicamentsOA.loadMedicamentsForOA();
    }

    loadDDs(event) {
        this.ddListHtml.loadDDs();
    }

    loadOIs(event) {
        this.oiListHtml.loadOIs();
    }

    loadOAs(event) {
        this.oaListHtml.loadOAs();
    }

}
