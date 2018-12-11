import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Document} from "../../../models/document";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";

@Component({
    selector: 'app-c-notificare',
    templateUrl: './c-notificare.component.html',
    styleUrls: ['./c-notificare.component.css']
})
export class CNotificareComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    clinicTrailNotifForm: FormGroup;
    private notificationIndex: number = -1;

    docs: Document[] = [];
    docTypes: any[] = [];

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private router: Router
                ,) {
    }

    ngOnInit() {
        this.clinicTrailNotifForm = this.fb.group({
            'id': [''],
            'requestNumber': {value: '', disabled: true},
            'startDate': {value: '', disabled: true},
            'company': [''],
            'type': [''],
            'typeCode': [''],
            'initiator': [null],
            'assignedUser': [null],
            'outputDocuments': [],
            'clinicalTrails': [],
            'requestHistories': []
        });

        this.initPage();
    }



    initPage() {
        this.subscriptions.push(
            this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                        console.log(data);
                    },
                    error => console.log(error)
                ))
            })
        );
    }

    ngOnDestroy(): void {
    }

}
