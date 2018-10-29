// import {Component, OnInit} from '@angular/core';
//
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
//
// import {MatDialog} from '@angular/material';
// import {saveAs} from 'file-saver';
// import {Subscription} from 'rxjs';
// import {AdministrationService} from '../../../shared/service/administration.service';
// import {Router} from '@angular/router';
// import {Document} from "../../../models/document";
// import {RequestService} from "../../../shared/service/request.service";
// import {AuthService} from "../../../shared/service/authetication.service";
// import {ModalService} from "../../../shared/service/modal.service";
//
// @Component({
//     selector: 'app-reg-cerere',
//     templateUrl: './reg-cerere.component.html',
//     styleUrls: ['./reg-cerere.component.css']
// })
// export class RegCerereComponent implements OnInit {
//
//     documents: Document [] = [];
//     companii: any[];
//     rForm: FormGroup;
//
//     generatedDocNrSeq: number;
//     //filteredOptions: Observable<any[]>;
//     formSubmitted: boolean;
//     //isWrongValueCompany: boolean;
//     private subscriptions: Subscription[] = [];
//
//     constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router,
//                 private requestService: RequestService,
//                 private authService: AuthService,
//                 private modalService: ModalService,
//                 private administrationService: AdministrationService) {
//         this.rForm = fb.group({
//             'data': {disabled: true, value: new Date()},
//             'requestNumber': [null],
//             'startDate': [new Date()],
//             'currentStep': ['E'],
//             'medicament':
//                 fb.group({
//                     'name': ['', Validators.required],
//                     'company': [null, Validators.required],
//                     'status': ['P']
//                 }),
//             'company': [''],
//             'type':
//                 fb.group({
//                     'code': ['MEDP', Validators.required]
//                 }),
//         });
//     }
//
//     ngOnInit() {
//         this.modalService.data.next('');
//         this.subscriptions.push(
//             this.administrationService.generateDocNr().subscribe(data => {
//                     this.generatedDocNrSeq = data;
//                     this.rForm.get('requestNumber').setValue(this.generatedDocNrSeq);
//                 },
//                 error => console.log(error)
//             )
//         );
//
//         this.subscriptions.push(
//             this.administrationService.getAllCompanies().subscribe(data => {
//                     this.companii = data;
//                 },
//                 error => console.log(error)
//             )
//         );
//     }
//
//     // displayFn(user?: any): string | undefined {
//     //     return user ? user.name : undefined;
//     // }
//
//     nextStep() {
//         this.formSubmitted = true;
//
//         if (this.documents.length === 0 || !this.rForm.valid) {
//             return;
//         }
//
//         this.formSubmitted = false;
//
//         this.rForm.get('company').setValue(this.rForm.value.medicament.company);
//
//         let modelToSubmit: any = this.rForm.value;
//         modelToSubmit.requestHistories = [{
//             startDate: this.rForm.get('startDate').value, endDate: new Date(),
//             username: this.authService.getUserName(), step: 'R'
//         }];
//         modelToSubmit.medicament.documents = this.documents;
//         modelToSubmit.medicament.registrationDate = new Date();
//
//         this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
//                 this.router.navigate(['dashboard/module/medicament-registration/evaluate/' + data.body]);
//             })
//         );
//     }
//
// }
