import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Document} from "../../../models/document";
import {Observable, Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {LicenseService} from "../../../shared/service/license/license.service";
import {Router} from "@angular/router";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-reg-med-cerere-lic',
  templateUrl: './reg-med-cerere-lic.component.html',
  styleUrls: ['./reg-med-cerere-lic.component.css']
})
export class RegMedCerereLicComponent implements OnInit, OnDestroy {

  companii: any[];
  docs : Document [] = [];
  tipCerere : string;

  private subscriptions: Subscription[] = [];
  rFormSubbmitted : boolean = false;

  //Validations
  mForm: FormGroup;
  rForm: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private administrationService: AdministrationService,
              private licenseService: LicenseService,
              public dialog: MatDialog) {


  }

  ngOnInit() {
      this.subscriptions.push(
          this.administrationService.getAllCompanies().subscribe(data => {
                  this.companii = data;
              },
              error => console.log(error)
          )
      );

      this.initFormData();

      this.onChanges();
  }

    private initFormData() {
        this.rForm = this.fb.group({
            'compGet': [null, Validators.required],
            'adresa': [{value: null, disabled: true}],
            'idno': [{value: null, disabled: true}],
            'telefonContact': [null, Validators.required],
            'emailContact': '',
            'persResDepCereriiFirstname': [null, Validators.required],
            'persResDepCereriiLastname': [null, Validators.required],
            'nrProcurii1': [null, Validators.required],
            'dataProcurii1': [null, Validators.required],

        });


        this.mForm = this.fb.group({
            'tipCerere': [{value: null}],
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataEliberarii': [{value: null, disabled: true}]


        });

        this.mForm.get('dataEliberarii').setValue(new Date());
    }

    submitNew(){
        this.rFormSubbmitted = true;

        if (!this.mForm.valid || !this.rForm.valid || this.docs.length==0)
        {
          return;
        }

        this.rFormSubbmitted = false;

        let modelToSubmit : any = {};
        let licenseModel : any = {};
        let mandatedContact : any = {};
        licenseModel.releaseDate = this.mForm.get('dataEliberarii').value;



        mandatedContact.requestPersonFirstname = this.rForm.get('persResDepCereriiFirstname').value;
        mandatedContact.requestPersonLastname = this.rForm.get('persResDepCereriiLastname').value;
        mandatedContact.requestMandateNr = this.rForm.get('nrProcurii1').value;
        mandatedContact.requestMandateDate = this.rForm.get('dataProcurii1').value;
        mandatedContact.phoneNumber = this.rForm.get('telefonContact').value;
        mandatedContact.email = this.rForm.get('emailContact').value;
        licenseModel.mandatedContact = mandatedContact;

        licenseModel.documents = this.docs;

        modelToSubmit.license = licenseModel;
        modelToSubmit.requestNumber = this.mForm.get('nrCererii').value;
        modelToSubmit.company = this.rForm.get('compGet').value;

        console.log( licenseModel);
        this.subscriptions.push(
            this.licenseService.confirmRegisterLicense(modelToSubmit).subscribe(data => {
                  // console.log('succes');
                    let result = data.body;
                    console.log('sdf', result);
                  this.router.navigate(['/dashboard/module/license/evaluate', result]);
                },
                error => console.log(error)
            )
        );
    }

    onChanges(): void {
        this.mForm.get('tipCerere').valueChanges.subscribe(val => {
            //Already set up
            if (this.tipCerere && this.tipCerere !== val)
            {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    data: {message: 'Sunteti sigur ca doriti sa schimbati optiunea? Datele colectate vor fi pierdute.', confirm: false}
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.tipCerere = val;
                        this.subscriptions.push(
                            this.administrationService.generateDocNr().subscribe(data => {
                                    this.mForm.get('nrCererii').setValue(data);
                                    this.mForm.reset();
                                }
                            )
                        );
                    }
                    else {
                        this.mForm.get('tipCerere').setValue(this.tipCerere);
                    }
                });
            }
            else if (this.tipCerere !== val) {
                this.tipCerere = val;
                this.subscriptions.push(
                    this.administrationService.generateDocNr().subscribe(data => {
                            this.mForm.get('nrCererii').setValue(data);
                        }
                    )
                );
            }
        });

        this.rForm.get('compGet').valueChanges.subscribe(val => {
            if (val)
            {
                this.rForm.get('adresa').setValue(val.legalAddress);
                this.rForm.get('idno').setValue(val.idno);
            }
            else {
                this.rForm.get('adresa').setValue(null);
                this.rForm.get('idno').setValue(null);
            }

        });
    }


  ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
  }


}
