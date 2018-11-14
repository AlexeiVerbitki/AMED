import {
    Component,
    ComponentFactoryResolver,
    OnDestroy,
    OnInit, ViewChild,
} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { Subscription} from 'rxjs';
import {Document} from '../../../models/document';
import {MatDialog, MatTabGroup} from '@angular/material';
import {saveAs} from 'file-saver';
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "../../../shared/service/loader.service";
import {PriceService} from "../../../shared/service/prices.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";


enum MedicamentType {
    Drug = 1,
    Original = 2 ,
    Generic = 3
}


@Component({
  selector: 'app-price-reg-med',
  templateUrl: './price-reg-med.component.html',
  styleUrls: ['./price-reg-med.component.css'],
  providers: [PriceService]
})
export class PriceRegMedComponent implements OnInit, OnDestroy {

      requestNumber: number;
      documents: Document[] = [];
      private subscriptions: Subscription[] = [];
      private getMedSubscr: Subscription;
      private generatedDocNrSeq: any;

      requests: any[] = [];

      formSubmitted: boolean;

      color = 'green';

      @ViewChild('tabGroup') private tabGroup: MatTabGroup;
      startRecDate: Date = new Date();

    tabs = ['Medicamentul 1'];
    selected = new FormControl(0);


    mandatoryDocuments: any[] = [{
        description: 'Cerere',
        number: undefined,
        status: "Nu este atasat"
    }];

    updateRouteId: string;

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private priceService: PriceService,
              private router: Router,
              private route: ActivatedRoute,
              private resolver: ComponentFactoryResolver,
              private loadingService: LoaderService) {

          this.subscriptions.push(
          this.route.params.subscribe(params => {
              if (params['id']) {
                  this.updateRouteId = params.id;
              }
          }));
  }

  ngOnInit() {


      if(this.updateRouteId != undefined) {
          this.subscriptions.push(
              this.priceService.getPricesRequest(this.updateRouteId).subscribe(request => {
                  console.log('requewst', JSON.stringify(request));
                  this.generatedDocNrSeq = request.requestNumber;
                  // this.pricesRequestId = request.pricesRequest.id;
                  // this.PriceRegForm.get('id').setValue(request.id);
                  // this.PriceRegForm.get('requestNumber').setValue(this.generatedDocNrSeq);
                  // this.PriceRegForm.get('company').setValue(request.company);
                  // this.PriceRegForm.get('medicament').setValue(request.pricesRequest.medicament);
                  // this.PriceRegForm.get('initiator').setValue(request.initiator);
                  // this.PriceRegForm.get('requestHistories').setValue(request.requestHistories);
                  // this.onMedSelected(request.pricesRequest.medicament);
                  // this.initPrices(request.pricesRequest);

                  this.documents = [];
                  request.pricesRequest.documents.forEach(doc => this.documents.push(doc));
          }));
      } else {
          this.subscriptions.push(
              this.priceService.generateDocNumber().subscribe(generatedNumber => {
                      this.generatedDocNrSeq = generatedNumber;
                      this.requestNumber = this.generatedDocNrSeq;
                  },
                  error => {console.log(error); alert(error);}
              )
          );
      }
  }


    documentAdded($event) {

      console.log('documentAdded', $event);
      console.log('documents', this.documents);

      this.documents.forEach(addedDoc => {
          // this.mandatoryDocuments.splice( this.mandatoryDocuments.indexOf('foo'), 1 );
          for(var i = 0; i < this.mandatoryDocuments.length; i++) {
              if(this.mandatoryDocuments[i].number == addedDoc.number && this.mandatoryDocuments[i].description == addedDoc.docType.description) {
                  this.mandatoryDocuments.splice(i, 1);
                  break;
              }
          }
      });
    }


    nextStep() {
        this.loadingService.show();
        this.formSubmitted = true;

        let canSave: boolean = this.documents.length > 0 &&
            (this.requests.length == this.tabs.length &&
            this.requests.every(value => value.valid)) && this.mandatoryDocuments.length == 0;

        if(!canSave)
        {
            this.loadingService.hide();

            for(let i = 0; i < this.tabs.length; i++) {
                let r = this.requests[i];
                if(r == undefined || r.valid == undefined || !r.valid) {
                    this.selected.setValue(i);
                }
            }

            return;
        }

        this.formSubmitted = false;

        let user: string = this.priceService.getUsername();

        let requestHistory: any = {
            startDate : this.startRecDate,
            endDate: new Date(),
            username : user,
            step : 'R'
        };

        let priceModels: any[] = [];

        this.requests.forEach(req => {
            let documents: Document[] = [];

            this.documents.forEach(doc =>{
                if(doc.docType.description == 'Anexa 1 la ordinul de înregistrare a prețului' && doc.number != req.requestNumber){
                    return true;
                }
                documents.push(doc);
            });

            priceModels.push({
                requestNumber: req.requestNumber,
                initiator: user,
                assignedUser: user,
                startDate: this.startRecDate,
                endDate: new Date(),
                requestHistories: [requestHistory],
                company: req.company,
                documents: documents,
                currentStep: 'R',
                type:{ code: 'PMED' },
                price: {
                    value: req.price,
                    currency: req.currency,
                    medicament: req.medicament,
                    referencePrices: req.referencePrices,
                    folderNr: this.requestNumber,
                    type: {id: 1}
                },
            })
        });

        this.subscriptions.push(this.priceService.savePrice(priceModels).subscribe(data => {
                if (!data.body) {
                    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            message: 'A apărut o eroare. Nu s-au putut salva careva prețuri.',
                            confirm: false
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        // if(result) {
                        this.router.navigate(['dashboard/homepage']);
                        // }
                    });
                } else {
                    this.router.navigate(['dashboard/homepage']);
                }
                // this.router.navigate(['dashboard/module/price/evaluate/' + data.body]);
                this.loadingService.hide();
            }, error1 => {
                alert(error1);
                this.loadingService.hide();
            })
        );
        return false;
    }


  ngOnDestroy() {
      this.subscriptions.forEach(value => value.unsubscribe());
  }

    // ngAfterContentInit() {
    //     alert('ngAfterContentInit');
    //     // this.footer now points to the instance of `FooterComponent`
    // }
    //
    ngAfterViewInit() {
        console.log('ngAfterViewInit', this.tabGroup);
        // this.subscriptions.push(this.tabGroup.selectedIndexChange.subscribe(index => console.log("selectedIndexChange", index)));
        this.subscriptions.push(this.tabGroup.selectedIndexChange.subscribe(index => console.log("selectedIndexChange", index)));
    }

    onFormChange($event) {
      if($event.index != undefined) {
          this.requests[$event.index] = $event;

          let mandatoryDocAddedToList: boolean = this.mandatoryDocuments.some(value => value.number == $event.requestNumber);
          if(!mandatoryDocAddedToList) {
              this.mandatoryDocuments.push({
                  description: 'Anexa 1 la ordinul de înregistrare a prețului',
                  number: $event.requestNumber,
                  status: "Nu este atasat"
              });
          }

          console.log('requests', this.requests);
      }
    }


    addTab() {
        this.tabs.push('Medicamentul ' + (this.tabs.length + 1));
        this.selected.setValue(this.tabs.length - 1);
    }

    removeTab(index: number) {
        let reqNr = this.requests[index].requestNumber;
        if(reqNr != undefined) {
            for(let i = 0; i < this.mandatoryDocuments.length; i++){
                if(this.mandatoryDocuments[i].number == reqNr) {
                    this.mandatoryDocuments.splice(i, 1);
                    break;
                }
            }
        }
        this.requests.splice(index, 1);
        this.tabs.splice(index, 1);
    }
}
