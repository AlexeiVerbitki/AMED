import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../shared/service/request.service";
import {TaskService} from "../../../shared/service/task.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {validate} from "codelyzer/walkerFactory/walkerFn";
import {AuthService} from "../../../shared/service/authetication.service";
import {LoaderService} from "../../../shared/service/loader.service";

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

    addNotificationTypesForm: FormGroup;
    allNotificationTypesList: any[] = [];

    constructor(private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private requestService: RequestService,
                private router: Router,
                private taskService: TaskService,
                private administrationService: AdministrationService,
                private authService: AuthService,
                private loadingService: LoaderService) {
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

        this.addNotificationTypesForm = this.fb.group({
            'notifCode': ['', Validators.required],
            'notificationType': ['', Validators.required],
            'notificationTitle': ['', Validators.required],
            'startDateInternational': [''],
            'startDateNational': [''],
            'endDateNational': [''],
            'endDateInternational': [''],
            'reportDsurEntity': this.fb.group({
                'clinicalTrailsId': [],
                'registrationRequestId': [],
                'dateFrom': [],
                'dateTo': [],
                'drugName': [],
                'identifiedRisks': [],
                'potentialRisks': [],
                'report': [],
                'otherRelevantData': [],
                'conclusions': []
            }),
            'reportSarLlrEntity': this.fb.group({
                'clinicalTrailsId': [],
                'registrationRequestId': [],
                'dateFrom': [],
                'dateTo': [],
                'report': [],
                'recordedCases': [],
                'conclusions': []
            })
        });

        this.initPage();
        this.loadDocTypes();
        this.loadNotificationTypes();

        this.subscriptions.push(
            this.addNotificationTypesForm.get('notificationType').valueChanges.subscribe(value => {
                this.addNotificationTypesForm.get('reportDsurEntity').reset();
                this.addNotificationTypesForm.get('reportSarLlrEntity').reset();
                this.addNotificationTypesForm.get('startDateInternational').reset();
                this.addNotificationTypesForm.get('startDateNational').reset();
                this.addNotificationTypesForm.get('endDateNational').reset();
                this.addNotificationTypesForm.get('endDateInternational').reset();
                console.log('notificationTypeChange', value);
                if (value != null && value.code == 'DSUR') {
                    this.addNotificationTypesForm.get('reportDsurEntity.drugName').setValue(this.clinicTrailNotifForm.value.clinicalTrails.medicament.name + ' ' + this.clinicTrailNotifForm.value.clinicalTrails.medicament.dose);
                }
            })
        );
    }


    initPage() {
        this.subscriptions.push(
            this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getClinicalTrailRequest(params['id']).subscribe(data => {
                        console.log('data', data);
                        this.clinicTrailNotifForm.get('id').setValue(data.id);
                        this.clinicTrailNotifForm.get('requestNumber').setValue(data.requestNumber);
                        this.clinicTrailNotifForm.get('startDate').setValue(new Date(data.startDate));
                        this.clinicTrailNotifForm.get('company').setValue(data.company);
                        this.clinicTrailNotifForm.get('type').setValue(data.type);
                        this.clinicTrailNotifForm.get('typeCode').setValue(data.type.code);
                        this.clinicTrailNotifForm.get('initiator').setValue(data.initiator);
                        this.clinicTrailNotifForm.get('requestHistories').setValue(data.requestHistories);
                        this.clinicTrailNotifForm.get('clinicalTrails').setValue(data.clinicalTrails);

                        this.docs = data.documents;
                        this.docs.forEach(doc => doc.isOld = true);

                        // console.log('this.clinicTrailNotifForm', this.clinicTrailNotifForm);
                    },
                    error => console.log(error)
                ))
            })
        );
    }

    loadDocTypes() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('5', 'N').subscribe(step => {
                    console.log('step', step);
                    console.log('step.availableDocTypes', step.availableDocTypes);
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                console.log('loadDocTypes', data);
                                this.docTypes = data;
                                let docCodesList: string[] = step.availableDocTypes.split(',');
                                // console.log('docCodesList', docCodesList);
                                this.docTypes = this.docTypes.filter(r => docCodesList.includes(r.category));
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );
    }

    loadNotificationTypes() {
        this.subscriptions.push(
            this.administrationService.getClinicalTrailNotificationTypes().subscribe(data => {
                    this.allNotificationTypesList = data;
                    console.log('data', data);
                },
                error => console.log(error)
            )
        );
    }

    onSubmit() {
        if (this.addNotificationTypesForm.invalid) {
            alert('invalidForm');
            return;
        }
        // this.loadingService.show();

        let formModel = this.clinicTrailNotifForm.getRawValue();
        let findAmendment = formModel.clinicalTrails.clinicTrialNotificationEntities.find(notif => notif.registrationRequestId == formModel.id)
        let collectedDataForm = this.addNotificationTypesForm.value;

        findAmendment.title = collectedDataForm.notificationTitle;
        findAmendment.notifCode = formModel.clinicalTrails.code + '-N' + collectedDataForm.notifCode;
        if (collectedDataForm.notificationType != null) {
            findAmendment.clinicTrailNotificationTypeEntity = collectedDataForm.notificationType;

        }
        findAmendment.status = 'F';

        if (collectedDataForm.notificationType.code == 'DDGSC') {
            formModel.clinicalTrails.startDateInternational = collectedDataForm.startDateInternational;
        } else if (collectedDataForm.notificationType.code == 'DDLSC') {
            formModel.clinicalTrails.startDateNational = collectedDataForm.startDateNational;
        } else if (collectedDataForm.notificationType.code == 'DIGSC') {
            formModel.clinicalTrails.endDateInternational = collectedDataForm.endDateInternational;
        } else if (collectedDataForm.notificationType.code == 'DILSC') {
            formModel.clinicalTrails.endDateNational = collectedDataForm.endDateNational;
        } else if (collectedDataForm.notificationType.code == 'DSUR') {
            collectedDataForm.reportDsurEntity.clinicalTrailsId = formModel.clinicalTrails.id;
            collectedDataForm.reportDsurEntity.registrationRequestId = formModel.id;
            findAmendment.reportDsurEntity = collectedDataForm.reportDsurEntity;
        } else if (collectedDataForm.notificationType.code == 'LLR') {
            collectedDataForm.reportSarLlrEntity.clinicalTrailsId = formModel.clinicalTrails.id;
            collectedDataForm.reportSarLlrEntity.registrationRequestId = formModel.id;
            findAmendment.reportSarLlrEntity = collectedDataForm.reportSarLlrEntity;
        }

            formModel.requestHistories = [{
                startDate: formModel.startDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: 'N'
            }];

            formModel.assignedUser = this.authService.getUserName();
            formModel.currentStep = 'F';

            console.log('formModel', formModel);
            this.subscriptions.push(this.requestService.finishClinicalTrailNotificationRequest(formModel).subscribe(data => {
                    this.router.navigate(['/dashboard/module/']);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    console.log(error)
                })
            );

            // console.log('form', this.clinicTrailNotifForm.value);
            // console.log('collectedDataForm', collectedDataForm);
            // console.log('findAmendment', findAmendment);


        }

        ngOnDestroy()
    :
        void {}

    }
