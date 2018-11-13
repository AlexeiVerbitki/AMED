import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Expert} from "../models/expert";
import {AdministrationService} from "../shared/service/administration.service";

@Component({
    selector: 'app-expert-comitee',
    templateUrl: './expert-comitee.component.html',
    styleUrls: ['./expert-comitee.component.css']
})
export class ExpertComiteeComponent implements OnInit {
    expertForm: FormGroup;
    private subscriptions: Subscription[] = [];
    chairmans: any[];
    farmacologs: any[];
    farmacists: any[];
    medics: any[];
    expertObj: Expert = new Expert();
    isFormSubmitted : boolean;
    typeObj : any;
    title : any = 'Cerere inregistrare medicament';

    constructor(private fb: FormBuilder,
                private administrationService: AdministrationService) {
        this.expertForm = fb.group({
            'data': {disabled: true, value: new Date()},
            'comiteeNr': [null],
            'chairman': [null,Validators.required],
            'farmacolog': [null,Validators.required],
            'farmacist': [null,Validators.required],
            'medic': [null,Validators.required],
            'comment': [null],
            'status': [null,Validators.required]
        });
    }

    ngOnInit() {

        if(this.typeObj == 'POST_AUTHORIZATION')
        {
            this.title = 'Modificare postautorizare medicament';
        }

        this.subscriptions.push(
            this.administrationService.getAllEmployees().subscribe(data => {
                    this.chairmans = data;
                    this.chairmans = this.chairmans.filter(r => r.chairmanOfExperts == 1);
                    this.farmacologs = data;
                    this.farmacologs = this.farmacologs.filter(r => r.profession.category == 'FG');
                    this.farmacists = data;
                    this.farmacists = this.farmacists.filter(r => r.profession.category == 'FT');
                    this.medics = data;
                    this.medics = this.medics.filter(r => r.profession.category == 'MD');
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.expertForm.get('comiteeNr').setValue(data);
                    this.expertObj.comiteeNr = data;
                },
                error => console.log(error)
            )
        );

    }

    get type(): string {
        return this.typeObj;
    }

    @Input()
    set type(type: string) {
        this.typeObj = type;
    }

    checkChairman()
    {
        this.expertObj.chairman =this.expertForm.get('chairman').value;
    }

    checkFarmacolog()
    {
        this.expertObj.farmacolog=this.expertForm.get('farmacolog').value;
    }

    checkFarmacist()
    {
        this.expertObj.farmacist=this.expertForm.get('farmacist').value;
    }

    checkMedic()
    {
        this.expertObj.medic=this.expertForm.get('medic').value;
    }

    checkComment()
    {
        this.expertObj.comment=this.expertForm.get('comment').value;
    }

    checkStatus()
    {
        this.expertObj.status=this.expertForm.get('status').value;
    }

    get expert(): Expert {
        return this.expertObj;
    }

    @Input()
    set expert(expertObj: Expert) {
        this.expertObj = expertObj;
    }

    get formSubmitted(): boolean {
        return this.isFormSubmitted;
    }

    @Input()
    set formSubmitted(isFormSubmitted: boolean) {
        this.isFormSubmitted = isFormSubmitted;
    }

}
