import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";

@Component({
    selector: 'app-evaluare-cerere-lic',
    templateUrl: './evaluare-cerere-lic.component.html',
    styleUrls: ['./evaluare-cerere-lic.component.css']
})
export class EvaluareCerereLicComponent implements OnInit, OnDestroy {

    modelToSubmit: any = {};
    docs: Document [] = [];
    tipCerere: string;
    licenseId: string;
    states: any[];
    localities: any[];

    private subscriptions: Subscription[] = [];

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private administrationService: AdministrationService,
                private licenseService: LicenseService) {
    }

    ngOnInit() {
        this.initFormData();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.licenseId = params['id'];

                this.subscriptions.push(
                    this.licenseService.retrieveLicenseById(this.licenseId).subscribe(data => {
                            console.log('data', data);
                            this.mForm.get('nrCererii').setValue(data.nr);
                            this.mForm.get('dataEliberarii').setValue(data.releaseDate);
                            this.tipCerere = data.option;
                            this.docs = data.documents;

                            this.subscriptions.push(
                                this.administrationService.getAllStates().subscribe(data => {
                                        this.states = data;
                                    },
                                    error => console.log(error)
                                )
                            );


                        },
                        error => console.log(error)
                    )
                );

            }
            else {
                return;
            }

        }));


        this.onChanges();
    }


    private initFormData() {
        this.rForm = this.fb.group({
            'tipIntreprindere': '',
            'region': '',
            'locality': '',
            'street': '',
            'farmDir': '',
            'adresaObcLicen': '',
            'blocul': '',
            'decizieLuata': '',
            'decisionDate': '',
            'argumentDec': '',
            'useTax': '',
            'seriaLic': '',
            'releaseDate': '',
            'dataSistarii': '',
            'motivulSistarii': '',
            'CPCDDate': '',
            'CPCDMethod': '',
            'CPCDEmail': '',
            'CPCDPhone': '',
            'ASPDate': '',
            'ASPMethod': '',
            'ASPEmail': '',
            'ASPPhone': '',
            'CPCDNrdeintrare': '',
            'ASPNrdeintrare': '',
            'MandatedReleaseName': '',
            'MandatedReleaseNr': '',
            'MandatedReleaseDate': ''

        });


        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataEliberarii': [{value: null, disabled: true}]


        });
    }

    onChanges(): void {
        this.rForm.get('region').valueChanges.subscribe(val => {
            if (this.rForm.get('region'))
            {
                this.subscriptions.push(
                    this.administrationService.getLocalitiesByState(this.rForm.get('region').value.id).subscribe(data => {
                            this.localities = data;
                            // this.rForm.get('locality').setValue(data);
                        },
                        error => console.log(error)
                    )
                );
            }
        });

       /* this.rForm.get('compGet').valueChanges.subscribe(val => {
            console.log('sdf', val);
            this.rForm.get('adresa').setValue(val.legalAddress);
            this.rForm.get('idno').setValue(val.idno);
        });*/
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
