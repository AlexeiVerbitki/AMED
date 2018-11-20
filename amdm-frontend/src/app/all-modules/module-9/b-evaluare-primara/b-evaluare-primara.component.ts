import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";

@Component({
    selector: 'app-b-evaluare-primara',
    templateUrl: './b-evaluare-primara.component.html',
    styleUrls: ['./b-evaluare-primara.component.css']
})
export class BEvaluarePrimaraComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    constructor(private activatedRoute: ActivatedRoute,
                private requestService: RequestService) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getClinicalTrailAmendmentRequest(params['id']).subscribe(data => {
                    console.log(data);
                    },
                    error => console.log(error)
                ))
            }));
    }

}
