import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../shared/service/request.service';
import {TaskService} from '../../../shared/service/task.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {ReportRegisterMode} from '../../../shared/enum/report-register-mode.enum';
import {ReportLevel} from '../../../shared/enum/report-level.enum';
import {ReportType} from '../../../shared/enum/report-type.enum';
import {Casuality} from '../../../shared/enum/report-casuality.enum';
import {ReportGender} from '../../../shared/enum/report-gender.enum';
import {ReportTypeSaesusar} from '../../../shared/enum/report-type-saesusar.enum';
import {ReportResponseType} from '../../../shared/enum/report-response-type.enum';
import {ReportSource} from '../../../shared/enum/report-source.enum';
import {SpecificReportType} from '../../../shared/enum/specific-report-type.enum';

@Component({
    selector: 'app-c-notificare',
    templateUrl: './c-notificare.component.html',
    styleUrls: ['./c-notificare.component.css']
})
export class CNotificareComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    clinicTrailNotifForm: FormGroup;
    private notificationIndex = -1;

    docs: Document[] = [];
    docTypes: any[] = [];

    addNotificationTypesForm: FormGroup;
    allNotificationTypesList: any[] = [];

    registerType = ReportRegisterMode;
    registerTypeValues: any[] = ReportRegisterMode.values();

    level = ReportLevel;
    levelValues: any[] = ReportLevel.values();

    reportType = ReportType;
    reportTypeValues: any[] = ReportType.values();
    showReportType = false;

    casuality = Casuality;
    casualityValues: any[] = Casuality.values();

    reportGender = ReportGender;
    reportGenderValues: any[] = ReportGender.values();

    reportTypeSaesusar = ReportTypeSaesusar;
    reportTypeSaesusarValues: any[] = ReportTypeSaesusar.values();
    showDiedDate = false;

    reportResponseType = ReportResponseType;
    reportResponseTypeValues: any[] = ReportResponseType.values();

    reportSource = ReportSource;
    reportSourceValues = ReportSource.values();

    specificReportType = SpecificReportType;
    specificReportTypeValues = SpecificReportType.values();


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
                'registerTypeValue': [],
                'registerType': [],
                'dateFrom': [],
                'dateTo': [],
                'drugName': [],
                'identifiedRisks': [],
                'potentialRisks': [],
                'reporter': [],
                'otherRelevantData': [],
                'conclusions': []
            }),
            'reportSarLlrEntity': this.fb.group({
                'clinicalTrailsId': [],
                'registrationRequestId': [],
                'registerTypeValue': [],
                'registerType': [],
                'dateFrom': [],
                'dateTo': [],
                'reporter': [],
                'recordedCases': [],
                'conclusions': []
            }),
            'reportSaeSusarEntity': this.fb.group({
                'specificReportTypeValue': [],
                'specificReportType': [],
                'thisReportDate': [],

                'clinicalTrailsId': [],
                'registrationRequestId': [],
                'registerTypeValue': [],
                'registerType': [],
                'reporter': [],
                'level': [],
                'reportLavel': [],
                'reportTypeValue': [],
                'reportType': [],
                'studyId': [],
                'patientId': [],
                'centerId': [],
                'casualityValue': [],
                'casuality': [],
                'actionTakenDrug': [],
                'companyRemarks': [],
                'patientInitials': [],
                'dateOfBirth': [],
                'age': [],
                'sexValue': [],
                'sex': [],
                'reactionOnSet': [],
                'describeReactions': [],
                'typeSaesusarValue': [],
                'typeSaesusar': [],
                'patientDiedDate': [],
                'suspectDrug': [],
                'dailyDose': [],
                'routesOfAdmin': [],
                'indicationForUse': [],
                'therapyDateFrom': [],
                'therapyDateTo': [],
                'therapyDuration': [],
                'reactionAbatedValue': [],
                'reactionAbated': [],
                'eventReappear': [],
                'eventReappearValue': [],
                'concDrugDates': [],
                'otherRelevantHistory': [],
                'nameAdressManufacturer': [],
                'mfrControlNo': [],
                'dateManufactReceived': [],
                'reportSourceValue': [],
                'reportSource': [],

            })
        });

        this.initPage();
        this.loadDocTypes();
        this.loadNotificationTypes();
        this.subscribeToEvents();

        console.log('specificReportType', this.specificReportType);
        console.log('specificReportTypeValues', this.specificReportTypeValues);
    }

    subscribeToEvents() {
        this.subscriptions.push(
            this.addNotificationTypesForm.get('notificationType').valueChanges.subscribe(value => {
                this.addNotificationTypesForm.get('reportDsurEntity').reset();
                this.addNotificationTypesForm.get('reportSarLlrEntity').reset();
                this.addNotificationTypesForm.get('reportSaeSusarEntity').reset();
                this.addNotificationTypesForm.get('startDateInternational').reset();
                this.addNotificationTypesForm.get('startDateNational').reset();
                this.addNotificationTypesForm.get('endDateNational').reset();
                this.addNotificationTypesForm.get('endDateInternational').reset();
                console.log('notificationTypeChange', value);
                console.log('reportSaeSusarEntity', this.addNotificationTypesForm.get('reportSaeSusarEntity'));
                if (value && value.code == 'DSUR') {
                    this.addNotificationTypesForm.get('reportDsurEntity.drugName').setValue(this.clinicTrailNotifForm.value.clinicalTrails.medicament.name + ' ' + this.clinicTrailNotifForm.value.clinicalTrails.medicament.dose);
                }
            })
        );

        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportDsurEntity.registerTypeValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportDsurEntity.registerType').setValue(this.registerType[value]);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSarLlrEntity.registerTypeValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSarLlrEntity.registerType').setValue(this.registerType[value]);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.registerTypeValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.registerType').setValue(this.registerType[value]);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.level').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.reportLavel').setValue(this.level[value]);
                    console.log('this.addNotificationTypesForm', this.addNotificationTypesForm);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.reportTypeValue').valueChanges.subscribe(value => {
                this.addNotificationTypesForm.get('reportSaeSusarEntity.reportType').setValue('');
                if (value) {
                    this.showReportType = (this.reportType[value] == this.reportType.FOLLOW_UP.toString());
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.reportType').setValue(value);
                    // console.log('reportSaeSusarEntity.reportType', this.addNotificationTypesForm.get('reportSaeSusarEntity'));
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.casualityValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.casuality').setValue(this.casuality[value]);
                    // console.log('this.addNotificationTypesForm', this.addNotificationTypesForm);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.sexValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.sex').setValue(this.reportGender[value]);
                    // console.log('this.addNotificationTypesForm', this.addNotificationTypesForm);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.typeSaesusarValue').valueChanges.subscribe(value => {
                this.addNotificationTypesForm.get('reportSaeSusarEntity.patientDiedDate').reset();
                if (value) {
                    this.showDiedDate = (value == this.reportTypeSaesusar[0]);
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.typeSaesusar').setValue(this.reportTypeSaesusar[value]);
                    // console.log('this.addNotificationTypesForm', this.addNotificationTypesForm);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.reactionAbatedValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.reactionAbated').setValue(this.reportResponseType[value]);
                    // console.log('reactionAbated', this.reportResponseType[value]);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.eventReappearValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.eventReappear').setValue(this.reportResponseType[value]);
                    // console.log('eventReappearValue', this.reportResponseType[value]);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.reportSourceValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.reportSource').setValue(this.reportSource[value]);
                    // console.log('eventReappearValue', this.reportSource[value]);
                }
            })
        );
        this.subscriptions.push(
            this.addNotificationTypesForm.get('reportSaeSusarEntity.specificReportTypeValue').valueChanges.subscribe(value => {
                if (value) {
                    this.addNotificationTypesForm.get('reportSaeSusarEntity.specificReportType').setValue(this.specificReportType[value]);
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
                ));
            })
        );
    }

    loadDocTypes() {
        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('5', 'N').subscribe(step => {
                    let availableDocsArr = [];
                    step.availableDocTypes ? availableDocsArr = step.availableDocTypes.split(',') : availableDocsArr = [];
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypes = this.docTypes.filter(r => availableDocsArr.includes(r.category));
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
                },
                error => console.log(error)
            )
        );
    }

    onSubmit() {
        if (this.addNotificationTypesForm.invalid) {
            alert('invalidForm');
            console.log('this.addNotificationTypesForm', this.addNotificationTypesForm);
            return;
        }
        // this.loadingService.show();

        const formModel = this.clinicTrailNotifForm.getRawValue();
        const findAmendment = formModel.clinicalTrails.clinicTrialNotificationEntities.find(notif => notif.registrationRequestId == formModel.id);
        const collectedDataForm = this.addNotificationTypesForm.value;

        console.log('findAmendment', findAmendment);
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
        } else if (collectedDataForm.notificationType.code == 'SUSAR/SAE') {
            collectedDataForm.reportSaeSusarEntity.clinicalTrailsId = formModel.clinicalTrails.id;
            collectedDataForm.reportSaeSusarEntity.registrationRequestId = formModel.id;
            findAmendment.reportSaeSusarEntity = collectedDataForm.reportSaeSusarEntity;
            console.log('this.addNotificationTypesForm', this.addNotificationTypesForm);
        }

        formModel.requestHistories = [{
            startDate: formModel.startDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'N'
        }];

        formModel.assignedUser = this.authService.getUserName();
        formModel.currentStep = 'F';
        formModel.documents = this.docs;

        console.log('formModel', formModel);
        this.subscriptions.push(this.requestService.finishClinicalTrailNotificationRequest(formModel).subscribe(data => {
                this.router.navigate(['/dashboard/module/']);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
                console.log(error);
            })
        );

        // console.log('form', this.clinicTrailNotifForm.value);
        // console.log('collectedDataForm', collectedDataForm);
        // console.log('findAmendment', findAmendment);


    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

}
