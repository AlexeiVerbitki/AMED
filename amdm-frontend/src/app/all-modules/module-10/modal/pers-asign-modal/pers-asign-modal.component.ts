import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AdministrationService} from '../../../../shared/service/administration.service';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthService} from '../../../../shared/service/authetication.service';

@Component({
    selector: 'app-pers-asign-modal',
    templateUrl: './pers-asign-modal.component.html',
    styleUrls: ['./pers-asign-modal.component.css']
})
export class PersAsignModalComponent implements OnInit, OnDestroy {
    executors: any;
    selectedItem: any;
    usersToFilter = [];
    private subscriptions: Subscription[] = [];

    constructor(private administrationService: AdministrationService, public dialogConfirmation: MatDialogRef<PersAsignModalComponent>,
                private authService: AuthService, @Inject(MAT_DIALOG_DATA) private dataDialog: any) {
    }

    ngOnInit() {
        this.usersToFilter = this.dataDialog.executors.map(e => e.name).slice();
        this.usersToFilter.push(this.authService.getUserName());
        this.usersToFilter.push(this.dataDialog.initiator);

        this.subscriptions.push(this.administrationService.getAllValidUsers().subscribe(data => {
                this.executors = data.filter(ex => !this.usersToFilter.includes(ex.username));
            },
            error => console.log(error)
            )
        );
    }

// this.authService.getUserName() this.dataDialog.initiator
    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    addPerson() {
        this.dialogConfirmation.close(this.selectedItem);
    }
}
