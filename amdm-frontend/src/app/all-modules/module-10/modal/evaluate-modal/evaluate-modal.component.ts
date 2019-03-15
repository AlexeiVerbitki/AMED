import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthService} from '../../../../shared/service/authetication.service';

@Component({
    selector: 'app-evaluate-modal',
    templateUrl: './evaluate-modal.component.html',
    styleUrls: ['./evaluate-modal.component.css']
})
export class EvaluateModalComponent implements OnInit {

    historyEntity = {'id': null, 'addDate': new Date(), 'actionDescription': '', 'assignee': ''};

    constructor(@Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogConfirmation: MatDialogRef<EvaluateModalComponent>,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.historyEntity.actionDescription = '';
        this.historyEntity.assignee = this.authService.getUserName();
    }

    cancel(): void {
        this.dialogConfirmation.close(this.historyEntity);
    }

    addComment(): void {
        this.dialogConfirmation.close(this.historyEntity);
    }
}
