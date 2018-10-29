import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../models/document";
import {ModalService} from "../shared/service/modal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../shared/service/request.service";
import {DocumentService} from "../shared/service/document.service";
import {AdministrationService} from "../shared/service/administration.service";
import {AuthService} from "../shared/service/authetication.service";
import {MedicamentService} from "../shared/service/medicament.service";

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
    generatedDocNrSeq: string;

    constructor(private fb: FormBuilder,
                private modalService: ModalService,
                private router: Router,
                private documentService: DocumentService,
                private administrationService: AdministrationService,
                private medicamentService: MedicamentService,
                private requestService: RequestService,
                private authService: AuthService,
                private activatedRoute: ActivatedRoute) {
        this.iForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            'currentStep': ['A'],
            'company': [''],
            'companyValue': [''],
            'motiv': ['', Validators.required],
            'check': [''],
            'requestHistories': ['']
        });
    }

    ngOnInit() {
        this.modalService.data.next('');
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.iForm.get('id').setValue(data.id);
                        this.iForm.get('requestNumber').setValue(data.requestNumber);
                        this.iForm.get('company').setValue(data.medicament.company);
                        this.iForm.get('companyValue').setValue(data.medicament.company.name);
                        this.iForm.get('requestHistories').setValue(data.requestHistories);
                        this.documents = data.medicament.documents;
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
            this.administrationService.generateDocNr().subscribe(data => {
                    this.generatedDocNrSeq = data;
                },
                error => console.log(error)
            )
        );
    }

    ngAfterViewInit(): void {
        this.modalService.data.asObservable().subscribe(value => {
            if (value != '' && (value.action == 'CLOSE_MODAL' || value.action == 'CLOSE_WAITING_MODAL')) {
                this.iForm.get('data').setValue(new Date());
                this.subscriptions.push(this.requestService.getMedicamentRequest(this.iForm.get('id').value).subscribe(data => {
                    this.documents = data.medicament.documents;
                    this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    let xs = this.documents;
                    xs = xs.map(x => {
                        x.isOld = true;
                        return x;
                    });
                }));
            }
        })
    }

    viewOrdin() {
        this.subscriptions.push(this.documentService.viewOrdinDeInrerupereAInregistrariiMedicamentului(this.generatedDocNrSeq).subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }, error => {
                console.log('error ', error);
            }
            )
        );
    }

    nextStep() {
        this.formSubmitted = true;

        if (this.iForm.get('motiv').invalid && this.iForm.get('check').value == false) {
            return;
        }

        this.formSubmitted = false;
        this.generateOrderAndSaveInDB();
    }

    generateOrderAndSaveInDB() {
        this.subscriptions.push(this.documentService.generateOrdinDeInrerupereAInregistrariiMedicamentului(this.generatedDocNrSeq, this.iForm.get('requestNumber').value).subscribe(data => {
                //register in db
                var docEntity = {
                    date: new Date(),
                    name: 'Ordin de întrerupere a procedurii de înregistrare a medicamentului Nr ' + this.generatedDocNrSeq + '.pdf',
                    path: data,
                    docType: 'OI',
                    requestId: this.iForm.get('id').value,
                    username: this.authService.getUserName(),
                    interruptionReason: this.iForm.get('motiv').value,
                    startDate: this.iForm.get('data').value
                };

                this.subscriptions.push(this.medicamentService.saveOrderInterrupt(docEntity).subscribe(data => {
                        this.router.navigate(['dashboard/module']);
                    }, error => console.log('Ordinul de inrerurpere nu a putut fi salvat in baza de date.'))
                );

            }, error => console.log('Ordinul de inrerurpere nu a putut fi generat.'))
        );
    }

    requestNL() {
        this.modalService.data.next({
                requestNumber: this.iForm.get('requestNumber').value,
                requestId: this.iForm.get('id').value,
                modalType: 'NOTIFICATION',
                startDate: this.iForm.get('data').value
            }
        );
    }

}
