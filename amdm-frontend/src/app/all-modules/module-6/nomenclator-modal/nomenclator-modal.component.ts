import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {NomenclatorService} from '../../../shared/service/nomenclator.service';
import {Subscription} from 'rxjs';
import {LoaderService} from '../../../shared/service/loader.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-nomenclator-modal',
  templateUrl: './nomenclator-modal.component.html',
  styleUrls: ['./nomenclator-modal.component.css']
})
export class NomenclatorModalComponent implements OnInit, OnDestroy {

  row: any = {};
  private subscriptions: Subscription[] = [];
  makets: any[] = [];
  instructions: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private nomenclatureService: NomenclatorService,
              private loadingService: LoaderService) {
      this.row = data;
  }

  navigateToUrl(rowDetails: any) {
    const path = rowDetails.path;

    if (path) {
      this.subscriptions.push(this.nomenclatureService.loadFile(path).subscribe(data => {
            this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
          },
          error => {
            console.log(error);
          }
          )
      );
    }
  }

  private saveToFileSystem(response: any, docName: string) {
    const blob = new Blob([response]);
    saveAs(blob, docName);
  }

  ngOnInit() {
    this.loadingService.show();
    this.subscriptions.push(this.nomenclatureService.getMedicamentInstructions(this.row.id).subscribe(data => {
      this.loadingService.hide();
      this.makets = data.filter(r => r.type == 'M');
      this.instructions = data.filter(r => r.type == 'I');

    }, error => {
      console.log('error => ', error);
      this.loadingService.hide();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
