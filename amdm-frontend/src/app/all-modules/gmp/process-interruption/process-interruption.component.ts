import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {ModalService} from '../../../shared/service/modal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentService} from '../../../shared/service/document.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {RequestService} from '../../../shared/service/request.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {TaskService} from '../../../shared/service/task.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';

@Component({
  selector: 'app-process-interruption',
  templateUrl: './process-interruption.component.html',
  styleUrls: ['./process-interruption.component.css']
})
export class ProcessInterruptionComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  iForm: FormGroup;
  documents: Document [] = [];
  company: any;
  formSubmitted: boolean;
  outputDocuments: any[] = [];
  docTypes: any[];
  initialData: any;
  registrationRequestMandatedContacts: any[];

  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private router: Router,
              private documentService: DocumentService,
              private administrationService: AdministrationService,
              private requestService: RequestService,
              private errorHandlerService: SuccessOrErrorHandlerService,
              private navbarTitleService: NavbarTitleService,
              private taskService: TaskService,
              private loadingService: LoaderService,
              public dialogConfirmation: MatDialog,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute) {
    this.iForm = fb.group({
      'id': [],
      'data': {disabled: true, value: new Date()},
      'requestNumber': [null],
      'startDate': [],
      'currentStep': ['A'],
      'initiator': [''],
      'assignedUser': [''],
      'company': [''],
      'companyValue': [''],
      'motiv': ['', Validators.required],
      'requestHistories': ['']
    });
  }

  ngOnInit() {
    this.navbarTitleService.showTitleMsg('Autorizație de fabricație a medicamentelor / Întrerupere proces');

    this.modalService.data.next('');
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
          this.subscriptions.push(this.requestService.loadGMPDetails(params['id']).subscribe(data => {
                this.initialData = Object.assign({}, data);
                this.iForm.get('id').setValue(data.id);
                this.iForm.get('initiator').setValue(data.initiator);
                this.iForm.get('requestNumber').setValue(data.requestNumber);
                this.iForm.get('company').setValue(data.company);
                this.iForm.get('companyValue').setValue(data.company.name);
                this.iForm.get('motiv').setValue(data.interruptionReason);
                this.iForm.get('requestHistories').setValue(data.requestHistories);
                this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
                this.documents = data.documents;
                this.outputDocuments = data.outputDocuments;
                this.checkOutputDocumentsStatus();
                this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                let xs = this.documents;
                xs = xs.map(x => {
                  x.isOld = true;
                  return x;
                });
              })
          );
        })
    );

    this.subscriptions.push(
        this.taskService.getRequestStepByIdAndCode('43', 'I').subscribe(step => {
              this.subscriptions.push(
                  this.administrationService.getAllDocTypes().subscribe(data => {
                        this.docTypes = data;
                        this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                      },
                      error => console.log(error)
                  )
              );
            },
            error => console.log(error)
        )
    );
  }

  ngAfterViewInit(): void {

  }

  interrupt() {

    this.formSubmitted = true;

    if (this.iForm.get('motiv').invalid) {
      return;
    }

    this.formSubmitted = false;

    const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
      data: {
        message: 'Sunteti sigur(a)?',
        confirm: false
      }
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.show();
        this.subscriptions.push(this.requestService.interruptGMPProcess({
              username: this.authService.getUserName(),
              reason: this.iForm.get('motiv').value,
              requestId: this.iForm.get('id').value,
              startDate: this.iForm.get('data').value
            }).subscribe(data => {
              this.loadingService.hide();
              this.router.navigate(['dashboard/homepage']);
            }, error => this.loadingService.hide())
        );
      }
    });
  }

  requestNL() {

    this.formSubmitted = true;

    if (this.iForm.get('motiv').invalid) {
      return;
    }

    this.formSubmitted = false;

    const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
      width: '1000px',
      height: '800px',
      data: {
        requestNumber: this.iForm.get('requestNumber').value,
        requestId: this.iForm.get('id').value,
        modalType: 'NOTIFICATION_GMP',
        startDate: this.iForm.get('data').value,
        companyName: this.iForm.get('company').value.name,
        address: this.iForm.get('company').value.legalAddress,
        registrationRequestMandatedContact: this.registrationRequestMandatedContacts[0],
        motiv: this.iForm.get('motiv').value
      },
      hasBackdrop: false
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result.success) {
        this.outputDocuments.push(result);
        this.initialData.outputDocument = this.outputDocuments;
        this.subscriptions.push(this.requestService.addGMPRequest(this.initialData).subscribe(data => {
              this.outputDocuments = data.body.outputDocuments;
              this.checkOutputDocumentsStatus();
            }, error => console.log(error))
        );
      }
    });
  }

  viewDoc(document: any) {

    this.formSubmitted = true;

    if (this.iForm.get('motiv').invalid) {
      return;
    }

    this.formSubmitted = false;

    if (document.docType.category == 'NL') {
      const modelToSubmit = {
        nrDoc: document.number,
        responsiblePerson: this.registrationRequestMandatedContacts[0].mandatedLastname + ' ' + this.registrationRequestMandatedContacts[0].mandatedFirstname,
        companyName: this.iForm.get('company').value.name,
        requestDate: document.date,
        country: 'Moldova',
        address: this.iForm.get('company').value.legalAddress,
        phoneNumber: this.registrationRequestMandatedContacts[0].phoneNumber,
        email: this.registrationRequestMandatedContacts[0].email,
        message: document.content,
        function: document.signerFunction,
        signerName: document.signerName
      };

      let observable: Observable<any> = null;
      observable = this.documentService.viewRequestNew(modelToSubmit);

      this.subscriptions.push(observable.subscribe(data => {
            const file = new Blob([data], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.loadingService.hide();
          }, error => {
            this.loadingService.hide();
          }
          )
      );
    }
  }

  remove(doc: any) {
    const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
      data: {
        message: 'Sunteti sigur(a)?',
        confirm: false
      }
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {

        this.outputDocuments.forEach((item, index) => {
          if (item === doc) { this.outputDocuments.splice(index, 1); }
        });
        this.initialData.outputDocuments = this.outputDocuments;

        this.subscriptions.push(this.requestService.addGMPRequest(this.initialData).subscribe(data => {
              this.outputDocuments = data.body.outputDocuments;
              this.checkOutputDocumentsStatus();
            }, error => console.log(error))
        );
      }
    });
  }

  checkOutputDocumentsStatus() {
    for (const entry of this.outputDocuments) {
      const isMatch = this.documents.some(elem => {
        return (elem.docType.category == entry.docType.category) ? true : false;
      });
      if (isMatch) {
        entry.status = 'Atasat';
      } else {
        entry.status = 'Nu este atasat';
      }
    }
  }

  isDisabledNLButton(): boolean {
    return this.outputDocuments.some(elem => {
      return elem.docType.category == 'NL' ? true : false;
    });
  }

  back() {

    const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
      data: {
        message: 'Sunteti sigur(a)?',
        confirm: false
      }
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.show();
        this.outputDocuments.forEach((item, index) => {
          if (item.docType.category === 'NL') { this.outputDocuments.splice(index, 1); }
        });
        this.initialData.outputDocuments = this.outputDocuments;

        this.documents.forEach((item, index) => {
          if (item.docType.category === 'NL') { this.documents.splice(index, 1); }
        });
        this.initialData.outputDocuments = this.outputDocuments;
        this.initialData.documents = this.documents;

        const reqHist = this.initialData.requestHistories.reduce((p, n) => p.id > n.id ? p : n);

        this.initialData.requestHistories.push({
          startDate: this.iForm.get('data').value, endDate: new Date(),
          username: this.authService.getUserName(), step: 'I'
        });

        this.subscriptions.push(this.requestService.addGMPRequest(this.initialData).subscribe(data => {
              this.loadingService.hide();
              if (reqHist.step == 'E') {
                this.router.navigate(['dashboard/module/gmp/evaluate/' + this.initialData.id]);
              }
            }, error => this.loadingService.hide())
        );
      }
    });

  }

  documentModified(event) {
    this.formSubmitted = false;
    this.checkOutputDocumentsStatus();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    // if(!this.rForm.dirty){
    //     return true;
    // }
    // const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
    //     data: {
    //         message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
    //         confirm: false,
    //     }
    // });
    //
    // return dialogRef.afterClosed();
    return true;

  }

  ngOnDestroy(): void {
    this.navbarTitleService.showTitleMsg('');
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
