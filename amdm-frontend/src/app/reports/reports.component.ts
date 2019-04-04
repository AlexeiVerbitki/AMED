import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavbarTitleService} from '../shared/service/navbar-title.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AdministrationService} from '../shared/service/administration.service';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {

  eForm: FormGroup;
  reportTypes: any[] = [];
  reports: any[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private navbarTitleService: NavbarTitleService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private administrationService: AdministrationService) {
    this.eForm = fb.group({
      'reportType': [null],
      'report': [null],
    });
  }

  ngOnInit() {
    this.navbarTitleService.showTitleMsg('Rapoarte');
    this.subscriptions.push(this.administrationService.getAllReportTypes().subscribe(data => {
            this.reportTypes = data;
        })
    );
  }

  onReportTypeChange(event) {
    this.reports = [];
    if (event) {
      this.subscriptions.push(this.administrationService.getAllReportsByReportType(event.id).subscribe(data => {
            this.reports = data;
          })
      );
    }
  }

  ngOnDestroy() {
    this.navbarTitleService.showTitleMsg('');
    this.subscriptions.forEach(s => s.unsubscribe());
}

}
