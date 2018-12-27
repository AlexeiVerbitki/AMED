import {Component, OnDestroy, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {LocalityService} from "../../../shared/service/locality.service";

@Component({
    selector: 'app-add-ec-agent',
    templateUrl: './add-ec-agent.component.html',
    styleUrls: ['./add-ec-agent.component.css']
})
export class AddEcAgentComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    forEdit: boolean = false;

    ecAgentTypes: any[];
    states: any[];
    localitiesForState: any[];
    localitiesForStateMain: any[];
    ecAgentParentInitial : any;
    ecAgentFilialsInitial : any[];

    pharmacyRepresentantProf: any;
    // farmacistiPerAddress: any[] = [];
    filiale: any[] = [];


    //Validations
    rForm: FormGroup;
    oForm: FormGroup;
    rFormSubbmitted: boolean = false;
    oFormSubbmitted: boolean = false;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private administrationService: AdministrationService,
                private localityService: LocalityService,
                private licenseService: LicenseService,
                private fb: FormBuilder,
                private errorHandlerService: ErrorHandlerService,
                public dialogFarmacist: MatDialog,
                public dialogConfirmation: MatDialog,
                public dialogRef: MatDialogRef<AddEcAgentComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    }

    ngOnInit() {
        this.initFormData();
        this.subscriptions.push(
            this.licenseService.loadEcAgentTypes().subscribe(data => this.ecAgentTypes = data));
        this.subscriptions.push(
            this.administrationService.getAllStates().subscribe(data => {
                    this.states = data;
                    if (this.dataDialog.idno) {
                        this.forEdit = true;
                        this.subscriptions.push(
                            this.administrationService.getParentAgentEcForIdno(this.dataDialog.idno).subscribe(data => {
                                console.log('patch', data);
                                this.ecAgentParentInitial = data.body;
                                this.patchData(data.body);
                            }));
                    }
                }
            ));
        if (!this.dataDialog.idno)
        {
            this.subscriptions.push(
                this.administrationService.generateEcAgentCode().subscribe(data => this.rForm.get('code').setValue(data)));
        }




        this.onChanges();
    }


    private initFormData() {
        this.rForm = this.fb.group({
            'idno': [{value : null, disabled: this.dataDialog.idno ? true : false }, [Validators.required, Validators.maxLength(13), Validators.pattern('[0-9]+')]],
            'code': [{value : null, disabled: true }],
            'shortName': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }, Validators.required],
            'longName': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }],
            'registrationDate': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }, Validators.required],
            'legalAddress': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }, Validators.required],
            'tipIntreprindereMain': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }, Validators.required],
            'stateMain': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }, Validators.required],
            'localityForStateMain': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }, Validators.required],
            'streetMain': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }],
            'directorMain': [{value : null, disabled: this.dataDialog.onlyNewFilial ? true : false }],
        });

        this.oForm = this.fb.group({
            'tipIntreprindere': [null, Validators.required],
            'state': [null, Validators.required],
            'localityForState': [null, Validators.required],
            'street': [null],
            'director': [null],
        });
    }

    private patchData(data: any) {
        this.rForm.get('code').patchValue(data.code);
        this.rForm.get('idno').patchValue(data.idno);
        this.rForm.get('shortName').patchValue(data.name);
        this.rForm.get('longName').patchValue(data.longName);
        this.rForm.get('registrationDate').patchValue(new Date(data.registrationDate));
        this.rForm.get('legalAddress').patchValue(data.legalAddress);
        this.rForm.get('tipIntreprindereMain').patchValue(data.type);
        this.rForm.get('streetMain').patchValue(data.street);
        this.rForm.get('directorMain').patchValue(data.director);
        if (data.locality)
        {
            this.rForm.get('stateMain').patchValue(this.states.find(st => st.id === data.locality.stateId));
            this.rForm.get('localityForStateMain').patchValue(data.locality);
        }

        this.subscriptions.push(
            this.administrationService.getFilialsForIdno(this.dataDialog.idno).subscribe(data => {
                console.log('patch', data);
                this.filiale = data.body;
                this.ecAgentFilialsInitial = data.body;

                this.filiale.forEach(fl => {
                    fl.companyType = fl.type.description;
                    fl.address = this.states.find(st => st.id === fl.locality.stateId).description + ', ' + fl.locality.description + ', ' + fl.street;
                })
            }));


        if (this.dataDialog.onlyNewFilial)
        {
            console.log('sfsd');
            this.rForm.get('idno').setValidators(null);
            this.rForm.get('shortName').setValidators(null);
            this.rForm.get('registrationDate').setValidators(null);
            this.rForm.get('legalAddress').setValidators(null);
            this.rForm.get('tipIntreprindereMain').setValidators(null);
            this.rForm.get('stateMain').setValidators(null);
            this.rForm.get('localityForStateMain').setValidators(null);

            this.rForm.get('idno').updateValueAndValidity();
            this.rForm.get('shortName').updateValueAndValidity();
            this.rForm.get('registrationDate').updateValueAndValidity();
            this.rForm.get('legalAddress').updateValueAndValidity();
            this.rForm.get('tipIntreprindereMain').updateValueAndValidity();
            this.rForm.get('stateMain').updateValueAndValidity();
            this.rForm.get('localityForStateMain').updateValueAndValidity();
        }




    }

    onChanges(): void {
        this.oForm.get('state').valueChanges.subscribe(val => {
            if (val) {
                this.subscriptions.push(
                    this.administrationService.getLocalitiesByState(val.id).subscribe(data => this.localitiesForState = data));
            }
            else {
                this.localitiesForState = [];
                this.oForm.get('localityForState').setValue(null);
            }
        });


        this.rForm.get('stateMain').valueChanges.subscribe(val => {
            if (val) {
                this.subscriptions.push(
                    this.administrationService.getLocalitiesByState(val.id).subscribe(data => this.localitiesForStateMain = data));
            }
            else {
                this.localitiesForStateMain = [];
                this.rForm.get('localityForStateMain').setValue(null);
            }
        });

        this.oForm.get('tipIntreprindere').valueChanges.subscribe(val => {
            if (val) {
                this.pharmacyRepresentantProf = val.representant;
            }
            else {
                this.pharmacyRepresentantProf = null;
            }
        });
    }

    // newFarmacist() {
    //     const dialogRef2 = this.dialogFarmacist.open(AddLicenseFarmacistComponent, {
    //         data: {
    //             //NoData
    //         },
    //         hasBackdrop: false
    //     });
    //
    //     dialogRef2.afterClosed().subscribe(result => {
    //         if (result.success) {
    //             this.farmacistiPerAddress = [...this.farmacistiPerAddress, result.farmacist];
    //             this.oForm.get('farmDir').setValue(result.farmacist);
    //         }
    //     });
    // }

    addNewFilial() {
        this.oFormSubbmitted = true;
        if (this.filiale == null) {
            this.filiale = [];
        }


        if (!this.oForm.valid) {
            return;
        }

        this.oFormSubbmitted = false;

        let filiala: any = {};

        filiala.companyType = this.oForm.get('tipIntreprindere').value.description;
        filiala.address = this.oForm.get('state').value.description + ', ' + this.oForm.get('localityForState').value.description + ', ' + this.oForm.get('street').value;
        // filiala.agentPharmaceutist = this.farmacistiPerAddress;
        // filiala.selectedPharmaceutist = this.oForm.get('farmDir').value;
        filiala.type = this.oForm.get('tipIntreprindere').value;
        filiala.locality = this.oForm.get('localityForState').value;
        filiala.street = this.oForm.get('street').value;
        filiala.director = this.oForm.get('director').value;


        this.subscriptions.push(
            this.administrationService.generateEcAgentCode().subscribe(data =>
                filiala.code = data
            ));

        this.filiale.push(filiala);


        // this.farmacistiPerAddress = [];
        this.oForm.get('tipIntreprindere').setValue(null);
        this.oForm.get('localityForState').setValue(null);
        this.oForm.get('state').setValue(null);
        this.oForm.get('street').setValue(null);
        this.oForm.get('director').setValue(null);
        // this.oForm.get('farmDir').setValue(null);
    }

    save() {
        this.rFormSubbmitted = true;
        if (!this.dataDialog.onlyNewFilial && !this.rForm.valid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        this.rFormSubbmitted = false;

        let modelToSubmit: any[] = this.composeModel();

        console.log('model', modelToSubmit);


        let response;

        if (this.forEdit)
        {
            this.subscriptions.push(
                this.administrationService.updateEcAgent(modelToSubmit).subscribe(data => {
                    response = {
                        success: true,
                    };
                    this.dialogRef.close(response);

                },  error => { response = {
                    success: false
                };
                }));
        }
        else {
            this.subscriptions.push(
                this.administrationService.saveEcAgent(modelToSubmit).subscribe(data => {
                    response = {
                        success: true,
                    };
                    this.dialogRef.close(response);

                },  error => { response = {
                    success: false
                };
                }));
        }


    }


    private composeModel() {
        let modelToSubmit: any [] = [];

        let mainAgent: any = {};

        if (this.forEdit)
        {
            mainAgent = this.ecAgentParentInitial;
        }

        mainAgent.code = this.rForm.get('code').value;
        mainAgent.name = this.rForm.get('shortName').value;
        mainAgent.idno = this.rForm.get('idno').value;
        mainAgent.longName = this.rForm.get('longName').value;
        mainAgent.registrationDate = this.rForm.get('registrationDate').value;
        mainAgent.legalAddress = this.rForm.get('legalAddress').value;

        mainAgent.type = this.rForm.get('tipIntreprindereMain').value;
        mainAgent.locality = this.rForm.get('localityForStateMain').value;
        mainAgent.street = this.rForm.get('streetMain').value;
        mainAgent.director = this.rForm.get('directorMain').value;
        mainAgent.filiala = 0;

        modelToSubmit.push(mainAgent);

        this.filiale.forEach(fl => {
            fl.name = mainAgent.name;
            fl.idno = mainAgent.idno;
            fl.longName = mainAgent.longName;
            fl.registrationDate = mainAgent.registrationDate;
            fl.legalAddress = mainAgent.legalAddress;
            fl.filiala = 1;


            modelToSubmit.push(fl);
        });

        return modelToSubmit;

    }

    removeFilial(index) {
        const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta inregistrare?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.filiale.splice(index, 1);
            }
        });
    }


    cancel() {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
