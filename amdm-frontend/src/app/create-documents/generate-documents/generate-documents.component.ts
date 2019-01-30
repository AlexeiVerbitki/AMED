import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DdListComponent} from './dd-list/dd-list.component';
import {OaListComponent} from './oa-list/oa-list.component';
import {RequestsDdComponent} from './requests-dd/requests-dd.component';
import {MedicamentsOaComponent} from './medicaments-oa/medicaments-oa.component';
import {OiListComponent} from './oi-list/oi-list.component';
import {RequestsOiComponent} from './requests-oi/requests-oi.component';
import {DdModifyListComponent} from './dd-modify-list/dd-modify-list.component';
import {OmListComponent} from './om-list/om-list.component';
import {OiModifyListComponent} from './oi-modify-list/oi-modify-list.component';
import {RequestsDdModifyComponent} from './requests-dd-modify/requests-dd-modify.component';
import {MedicamentsOmComponent} from './medicaments-om/medicaments-om.component';
import {RequestsOiModifyComponent} from './requests-oi-modify/requests-oi-modify.component';
import {NavbarTitleService} from '../../shared/service/navbar-title.service';
import {DdCtListComponent} from "./dd-ct-list/dd-ct-list.component";
import {RequestDdCtComponent} from "./request-dd-ct/request-dd-ct.component";
import {LoaderService} from "../../shared/service/loader.service";
import {LmpcModifyListComponent} from "./lmpc-modify-list/lmpc-modify-list.component";
import {LmpcListComponent} from "./lmpc-list/lmpc-list.component";
import {RequestDdCtAmendComponent} from "./request-dd-ct-amend/request-dd-ct-amend.component";
import {DdCtAmendListComponent} from "./dd-ct-amend-list/dd-ct-amend-list.component";

@Component({
    selector: 'app-generate-documents',
    templateUrl: './generate-documents.component.html',
    styleUrls: ['./generate-documents.component.css']
})
export class GenerateDocumentsComponent implements OnInit {

    @ViewChild('ddList') ddListHtml: DdListComponent;
    @ViewChild('ddmList') ddmListHtml: DdModifyListComponent;
    @ViewChild('oaList') oaListHtml: OaListComponent;
    @ViewChild('omList') omListHtml: OmListComponent;
    @ViewChild('oiList') oiListHtml: OiListComponent;
    @ViewChild('oimList') oimListHtml: OiModifyListComponent;
    @ViewChild('requestDD') requestDD: RequestsDdComponent;
    @ViewChild('requestDDM') requestDDM: RequestsDdModifyComponent;
    @ViewChild('medicamentsOA') medicamentsOA: MedicamentsOaComponent;
    @ViewChild('medicamentsOM') medicamentsOM: MedicamentsOmComponent;
    @ViewChild('requestOI') requestOI: RequestsOiComponent;
    @ViewChild('requestOIM') requestOIM: RequestsOiModifyComponent;
    @ViewChild('anihModList') anihModListHtml: LmpcModifyListComponent;
    @ViewChild('anihList') anihListHtml: LmpcListComponent;
    @ViewChild('ddCtList') ddCtListHtml: DdCtListComponent;
    @ViewChild('ddCtAmendList') ddCtAmendListHtml: DdCtAmendListComponent;
    @ViewChild('requestDDCt') requestDDCt: RequestDdCtComponent;
    @ViewChild('requestDDCtAmend') requestDDCtAmend: RequestDdCtAmendComponent;
    constructor(private navbarTitleService: NavbarTitleService,
                private loadingService: LoaderService) {
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Creare documente');
    }

    ddListModified(event) {
        this.requestDD.loadRequestForDD();
    }

    ddmListModified(event) {
        this.requestDDM.loadRequestForDD();
    }

    oiListModified(event) {
        this.requestOI.loadRequestForOI();
    }

    oimListModified(event) {
        this.requestOIM.loadRequestForOI();
    }

    oaListModified(event) {
        this.medicamentsOA.loadMedicamentsForOA();
    }

    omListModified(event) {
        this.medicamentsOM.loadMedicamentsForOA();
    }

    loadDDs(event) {
        this.ddListHtml.loadDDs();
    }

    loadDDMs(event) {
        this.ddmListHtml.loadDDs();
    }

    loadOIs(event) {
        this.oiListHtml.loadOIs();
    }

    loadOIMs(event) {
        this.oimListHtml.loadOIs();
    }

    loadOAs(event) {
        this.oaListHtml.loadOAs();
    }

    loadOMs(event) {
        this.omListHtml.loadOAs();
    }

    loadDDCts(event) {
        this.ddCtListHtml.loadDDs();
    }

    loadDDAmendCts(event) {
        this.ddCtAmendListHtml.loadDDAs();
    }

    ddListCtModified(event) {
        this.requestDDCt.loadRequestForDD();
    }

    ddListCtAmendModified(event) {
        this.requestDDCtAmend.loadRequestForDDA();
    }
    
     loadAnihListModified(event) {
        this.anihModListHtml.loadRequestForAnih();
    }

    loadAnihList(event) {
        this.anihListHtml.loadAnnihMeds();
    }

    ngOnDestroy(): void {
       this.navbarTitleService.showTitleMsg('');
    }

}
