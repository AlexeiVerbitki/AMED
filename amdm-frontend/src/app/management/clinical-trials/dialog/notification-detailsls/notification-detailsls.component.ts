import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RequestService} from '../../../../shared/service/request.service';
import {ClinicalTrialService} from '../../../../shared/service/clinical-trial.service';
import {ReportRegisterMode} from '../../../../shared/enum/report-register-mode.enum';
import {SpecificReportType} from '../../../../shared/enum/specific-report-type.enum';
import {ReportLevel} from '../../../../shared/enum/report-level.enum';
import {Casuality} from '../../../../shared/enum/report-casuality.enum';
import {ReportGender} from '../../../../shared/enum/report-gender.enum';
import {ReportTypeSaesusar} from '../../../../shared/enum/report-type-saesusar.enum';
import {ReportResponseType} from '../../../../shared/enum/report-response-type.enum';
import {ReportSource} from '../../../../shared/enum/report-source.enum';
import {saveAs} from 'file-saver';
import {UploadFileService} from '../../../../shared/service/upload/upload-file.service';

@Component({
    selector: 'app-notification-detailsls',
    templateUrl: './notification-detailsls.component.html',
    styleUrls: ['./notification-detailsls.component.css']
})
export class NotificationDetailslsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    ctNotifForm: FormGroup;
    isPatientDied = false;

    registerType = ReportRegisterMode;
    specificReportType = SpecificReportType;
    level = ReportLevel;
    casuality = Casuality;
    reportGender = ReportGender;
    reportTypeSaesusar = ReportTypeSaesusar;
    reportResponseType = ReportResponseType;
    reportSource = ReportSource;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private requestService: RequestService,
                private ctService: ClinicalTrialService,
                public dialogRef: MatDialogRef<NotificationDetailslsComponent>,
                private uploadService: UploadFileService) {
    }

    ngOnInit() {
        console.log('dataDialog', this.dataDialog);

        this.ctNotifForm = this.fb.group({
            'documents': [],
            'title': [{value: null, disabled: true}],
            'clinicTrailNotificationTypeEntity': [],
            'startDateInternational': {value: null, disabled: true},
            'startDateNational': {value: null, disabled: true},
            'endDateNational': {value: null, disabled: true},
            'endDateInternational': {value: null, disabled: true},
            'reportDsurEntity': this.fb.group({
                'clinicalTrailsId': [],
                'registrationRequestId': [],
                'registerType': {value: null, disabled: true},
                'dateFrom': {value: null, disabled: true},
                'dateTo': {value: null, disabled: true},
                'drugName': {value: null, disabled: true},
                'identifiedRisks': {value: null, disabled: true},
                'potentialRisks': {value: null, disabled: true},
                'reporter': {value: null, disabled: true},
                'otherRelevantData': {value: null, disabled: true},
                'conclusions': {value: null, disabled: true}
            }),
            'reportSarLlrEntity': this.fb.group({
                'clinicalTrailsId': [],
                'registrationRequestId': [],
                'registerType': {value: null, disabled: true},
                'dateFrom': {value: null, disabled: true},
                'dateTo': {value: null, disabled: true},
                'reporter': {value: null, disabled: true},
                'recordedCases': {value: null, disabled: true},
                'conclusions': {value: null, disabled: true}
            }),
            'reportSaeSusarEntity': this.fb.group({
                'specificReportType': {value: null, disabled: true},
                'thisReportDate': {value: null, disabled: true},
                'registerType': {value: null, disabled: true},
                'reporter': {value: null, disabled: true},
                'reportType': {value: null, disabled: true},
                'reportLavel': {value: null, disabled: true},
                'studyId': {value: null, disabled: true},
                'patientId': {value: null, disabled: true},
                'centerId': {value: null, disabled: true},
                'casuality': {value: null, disabled: true},
                'actionTakenDrug': {value: null, disabled: true},
                'companyRemarks': {value: null, disabled: true},
                'patientInitials': {value: null, disabled: true},
                'dateOfBirth': {value: null, disabled: true},
                'age': {value: null, disabled: true},
                'sex': {value: null, disabled: true},
                'reactionOnSet': {value: null, disabled: true},
                'describeReactions': {value: null, disabled: true},
                'typeSaesusar': {value: null, disabled: true},
                'patientDiedDate': {value: null, disabled: true},
                'suspectDrug': {value: null, disabled: true},
                'indicationForUse': {value: null, disabled: true},
                'dailyDose': {value: null, disabled: true},
                'routesOfAdmin': {value: null, disabled: true},
                'therapyDateFrom': {value: null, disabled: true},
                'therapyDateTo': {value: null, disabled: true},
                'therapyDuration': {value: null, disabled: true},
                'reactionAbated': {value: null, disabled: true},
                'eventReappear': {value: null, disabled: true},
                'concDrugDates': {value: null, disabled: true},
                'otherRelevantHistory': {value: null, disabled: true},
                'nameAdressManufacturer': {value: null, disabled: true},
                'mfrControlNo': {value: null, disabled: true},
                'dateManufactReceived': {value: null, disabled: true},
                'reportSource': {value: null, disabled: true}

            })
        });

        this.subscriptions.push(
            this.ctService.loadRegistrationRequestById(this.dataDialog.id).subscribe(data => {
                console.log('data', data);
                this.ctNotifForm.get('documents').setValue(data.documents);
                const currentNotification = data.clinicalTrails.clinicTrialNotificationEntities.find(notification => this.dataDialog.id == notification.registrationRequestId);
                console.log('currentNotification', currentNotification);
                this.ctNotifForm.get('title').setValue(currentNotification.title);
                this.ctNotifForm.get('clinicTrailNotificationTypeEntity').setValue(currentNotification.clinicTrailNotificationTypeEntity);
                this.ctNotifForm.get('startDateInternational').setValue(data.clinicalTrails.startDateInternational ? new Date(data.clinicalTrails.startDateInternational) : null);
                this.ctNotifForm.get('startDateNational').setValue(data.clinicalTrails.startDateNational ? new Date(data.clinicalTrails.startDateNational) : null);
                this.ctNotifForm.get('endDateNational').setValue(data.clinicalTrails.endDateNational ? new Date(data.clinicalTrails.endDateNational) : null);
                this.ctNotifForm.get('endDateInternational').setValue(data.clinicalTrails.endDateInternational ? new Date(data.clinicalTrails.endDateInternational) : null);

                if (currentNotification.clinicTrailNotificationTypeEntity.code == 'DSUR') {
                    this.ctNotifForm.get('reportDsurEntity.registerType').setValue(this.registerType[currentNotification.reportDsurEntity.registerType]);
                    this.ctNotifForm.get('reportDsurEntity.dateFrom').setValue(currentNotification.reportDsurEntity.dateFrom ? new Date(currentNotification.reportDsurEntity.dateFrom) : null);
                    this.ctNotifForm.get('reportDsurEntity.dateTo').setValue(currentNotification.reportDsurEntity.dateTo ? new Date(currentNotification.reportDsurEntity.dateTo) : null);
                    this.ctNotifForm.get('reportDsurEntity.drugName').setValue(currentNotification.reportDsurEntity.drugName);
                    this.ctNotifForm.get('reportDsurEntity.reporter').setValue(currentNotification.reportDsurEntity.reporter);
                    this.ctNotifForm.get('reportDsurEntity.identifiedRisks').setValue(currentNotification.reportDsurEntity.identifiedRisks);
                    this.ctNotifForm.get('reportDsurEntity.potentialRisks').setValue(currentNotification.reportDsurEntity.potentialRisks);
                    this.ctNotifForm.get('reportDsurEntity.otherRelevantData').setValue(currentNotification.reportDsurEntity.otherRelevantData);
                    this.ctNotifForm.get('reportDsurEntity.conclusions').setValue(currentNotification.reportDsurEntity.conclusions);
                } else if (currentNotification.clinicTrailNotificationTypeEntity.code == 'LLR') {
                    this.ctNotifForm.get('reportSarLlrEntity.registerType').setValue(this.registerType[currentNotification.reportSarLlrEntity.registerType]);
                    this.ctNotifForm.get('reportSarLlrEntity.dateFrom').setValue(currentNotification.reportSarLlrEntity.dateFrom ? new Date(currentNotification.reportSarLlrEntity.dateFrom) : null);
                    this.ctNotifForm.get('reportSarLlrEntity.dateTo').setValue(currentNotification.reportSarLlrEntity.dateTo ? new Date(currentNotification.reportSarLlrEntity.dateTo) : null);
                    this.ctNotifForm.get('reportSarLlrEntity.reporter').setValue(currentNotification.reportSarLlrEntity.reporter);
                    this.ctNotifForm.get('reportSarLlrEntity.recordedCases').setValue(currentNotification.reportSarLlrEntity.recordedCases);
                    this.ctNotifForm.get('reportSarLlrEntity.conclusions').setValue(currentNotification.reportSarLlrEntity.conclusions);
                } else if (currentNotification.clinicTrailNotificationTypeEntity.code == 'SUSAR/SAE') {
                    console.log('specificReportType', currentNotification.reportSaeSusarEntity.specificReportType);
                    this.ctNotifForm.get('reportSaeSusarEntity.specificReportType').setValue(this.specificReportType[currentNotification.reportSaeSusarEntity.specificReportType]);
                    this.ctNotifForm.get('reportSaeSusarEntity.thisReportDate').setValue(currentNotification.reportSaeSusarEntity.thisReportDate ? new Date(currentNotification.reportSaeSusarEntity.thisReportDate) : null);
                    this.ctNotifForm.get('reportSaeSusarEntity.registerType').setValue(this.registerType[currentNotification.reportSaeSusarEntity.registerType]);
                    this.ctNotifForm.get('reportSaeSusarEntity.reporter').setValue(currentNotification.reportSaeSusarEntity.reporter);
                    this.ctNotifForm.get('reportSaeSusarEntity.reportType').setValue(currentNotification.reportSaeSusarEntity.reportType);
                    this.ctNotifForm.get('reportSaeSusarEntity.reportLavel').setValue(this.level[currentNotification.reportSaeSusarEntity.reportLavel]);
                    this.ctNotifForm.get('reportSaeSusarEntity.studyId').setValue(currentNotification.reportSaeSusarEntity.studyId);
                    this.ctNotifForm.get('reportSaeSusarEntity.patientId').setValue(currentNotification.reportSaeSusarEntity.patientId);
                    this.ctNotifForm.get('reportSaeSusarEntity.centerId').setValue(currentNotification.reportSaeSusarEntity.centerId);
                    this.ctNotifForm.get('reportSaeSusarEntity.casuality').setValue(this.casuality[currentNotification.reportSaeSusarEntity.casuality]);
                    this.ctNotifForm.get('reportSaeSusarEntity.actionTakenDrug').setValue(currentNotification.reportSaeSusarEntity.actionTakenDrug);
                    this.ctNotifForm.get('reportSaeSusarEntity.companyRemarks').setValue(currentNotification.reportSaeSusarEntity.companyRemarks);
                    this.ctNotifForm.get('reportSaeSusarEntity.patientInitials').setValue(currentNotification.reportSaeSusarEntity.patientInitials);
                    this.ctNotifForm.get('reportSaeSusarEntity.dateOfBirth').setValue(currentNotification.reportSaeSusarEntity.dateOfBirth ? new Date(currentNotification.reportSaeSusarEntity.dateOfBirth) : null);
                    this.ctNotifForm.get('reportSaeSusarEntity.age').setValue(currentNotification.reportSaeSusarEntity.age);
                    this.ctNotifForm.get('reportSaeSusarEntity.sex').setValue(this.reportGender[currentNotification.reportSaeSusarEntity.sex]);
                    this.ctNotifForm.get('reportSaeSusarEntity.reactionOnSet').setValue(currentNotification.reportSaeSusarEntity.reactionOnSet ? new Date(currentNotification.reportSaeSusarEntity.reactionOnSet) : null);
                    this.ctNotifForm.get('reportSaeSusarEntity.describeReactions').setValue(currentNotification.reportSaeSusarEntity.describeReactions);
                    this.ctNotifForm.get('reportSaeSusarEntity.typeSaesusar').setValue(this.reportTypeSaesusar[currentNotification.reportSaeSusarEntity.typeSaesusar]);
                    this.isPatientDied = this.reportTypeSaesusar[currentNotification.reportSaeSusarEntity.typeSaesusar] == 'PATIENT DIED';
                    this.isPatientDied ? this.ctNotifForm.get('reportSaeSusarEntity.patientDiedDate').setValue(new Date(currentNotification.reportSaeSusarEntity.patientDiedDate)) : null;
                    this.ctNotifForm.get('reportSaeSusarEntity.suspectDrug').setValue(currentNotification.reportSaeSusarEntity.suspectDrug);
                    this.ctNotifForm.get('reportSaeSusarEntity.dailyDose').setValue(currentNotification.reportSaeSusarEntity.dailyDose);
                    this.ctNotifForm.get('reportSaeSusarEntity.routesOfAdmin').setValue(currentNotification.reportSaeSusarEntity.routesOfAdmin);
                    this.ctNotifForm.get('reportSaeSusarEntity.indicationForUse').setValue(currentNotification.reportSaeSusarEntity.indicationForUse);
                    this.ctNotifForm.get('reportSaeSusarEntity.therapyDateFrom').setValue(new Date(currentNotification.reportSaeSusarEntity.therapyDateFrom));
                    this.ctNotifForm.get('reportSaeSusarEntity.therapyDateTo').setValue(new Date(currentNotification.reportSaeSusarEntity.therapyDateTo));
                    this.ctNotifForm.get('reportSaeSusarEntity.therapyDuration').setValue(currentNotification.reportSaeSusarEntity.therapyDuration);
                    this.ctNotifForm.get('reportSaeSusarEntity.reactionAbated').setValue(this.reportResponseType[currentNotification.reportSaeSusarEntity.reactionAbated]);
                    this.ctNotifForm.get('reportSaeSusarEntity.eventReappear').setValue(this.reportResponseType[currentNotification.reportSaeSusarEntity.eventReappear]);
                    this.ctNotifForm.get('reportSaeSusarEntity.concDrugDates').setValue(currentNotification.reportSaeSusarEntity.concDrugDates);
                    this.ctNotifForm.get('reportSaeSusarEntity.otherRelevantHistory').setValue(currentNotification.reportSaeSusarEntity.otherRelevantHistory);

                    this.ctNotifForm.get('reportSaeSusarEntity.nameAdressManufacturer').setValue(currentNotification.reportSaeSusarEntity.nameAdressManufacturer);
                    this.ctNotifForm.get('reportSaeSusarEntity.mfrControlNo').setValue(currentNotification.reportSaeSusarEntity.mfrControlNo);
                    this.ctNotifForm.get('reportSaeSusarEntity.dateManufactReceived').setValue(new Date(currentNotification.reportSaeSusarEntity.dateManufactReceived));
                    this.ctNotifForm.get('reportSaeSusarEntity.reportSource').setValue(this.reportSource[currentNotification.reportSaeSusarEntity.reportSource]);

                }

                console.log('this.ctNotifForm', this.ctNotifForm);

            })
        );
    }

    cancel() {
        this.dialogRef.close();
    }

    loadFileFrom(path: string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
            },
            error => {
                console.log(error);
            })
        );
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

}
