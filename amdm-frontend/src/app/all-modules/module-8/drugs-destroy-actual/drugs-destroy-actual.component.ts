import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Document} from "../../../models/document";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {AnnihilationService} from "../../../shared/service/annihilation/annihilation.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {DocumentService} from "../../../shared/service/document.service";

@Component({
  selector: 'app-drugs-destroy-actual',
  templateUrl: './drugs-destroy-actual.component.html',
  styleUrls: ['./drugs-destroy-actual.component.css']
})
export class DrugsDestroyActualComponent implements OnInit, OnDestroy  {

    private subscriptions: Subscription[] = [];
    docs: Document [] = [];
    rFormSubbmitted: boolean = false;


    requestId: string;
    oldData : any;

    medicamentsToDestroy: any[];
    commisions: any[];


    //count time
    startDate: Date;
    endDate: Date;

    outDocuments: any[] = [];

    //Validations
    mForm: FormGroup;
    rForm: FormGroup;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private administrationService: AdministrationService,
              public dialog: MatDialog,
              private authService: AuthService,
              private medicamentService: MedicamentService,
              private annihilationService : AnnihilationService,
              private loadingService: LoaderService,
              private documentService: DocumentService) { }

  ngOnInit() {
      this.startDate = new Date();

      this.initFormData();


      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
          if (params['id']) {
              this.requestId = params['id'];

              this.subscriptions.push(
                  this.annihilationService.retrieveAnnihilationByRequestId(this.requestId).subscribe(data => {
                      this.oldData = data;
                      this.patchData(data);
                      this.subscriptions.push(
                          this.annihilationService.retrieveCommisions().subscribe(data => {
                                this.commisions = data;
                              }
                          )
                      );
                      }
                  )
              );
          }
          else {
              return;
          }
      }));




      this.onChanges();
  }


    private initFormData() {
        this.mForm = this.fb.group({
            'nrCererii': [{value: null, disabled: true}, Validators.required],
            'dataCererii': [{value: null, disabled: true}],
            'company': [{value: null, disabled: true}, Validators.required],
        });


        this.rForm = this.fb.group({
            'commision': [ null, Validators.required],
        });

    }



    onChanges(): void {

    }


    private patchData(data) {
      console.log('sdfsd', data);
        this.mForm.get('nrCererii').patchValue(data.requestNumber);
        this.mForm.get('dataCererii').patchValue(new Date(data.startDate));
        this.mForm.get('company').patchValue(data.company.name);

        this.rForm.get('commision').patchValue(data.medicamentAnnihilation.commisions);

        this.docs = data.medicamentAnnihilation.documents;
        this.docs.forEach(doc => doc.isOld = true);

        this.medicamentsToDestroy  = data.medicamentAnnihilation.medicamentsMedicamentAnnihilationMeds;
        this.refreshOutputDocuments();
    }

    private refreshOutputDocuments() {
        this.outDocuments = [];

        let outDocument1 = {
            name: 'Scrisoare de solicitare a persoanelor pentru Comisia de NIM',
            number: '',
            status: this.getOutputDocStatus('NS')
        };

        let outDocument2 = {
            name: 'Procesul-verbal de NIM',
            number: '',
            status: this.getOutputDocStatus('NP')
        };

        this.outDocuments.push(outDocument1);
        this.outDocuments.push(outDocument2);
    }

    getOutputDocStatus(category: string): any
    {
        let result;
        result = this.docs.find( doc =>
        {
            if (doc.docType.category === category)
            {
                return true;
            }
        });
        if (result)
        {
            return {
                mode : 'A',
                description : 'Atasat'
            };
        }

        return {
            mode : 'N',
            description : 'Nu este atasat'
        };
    }


    submit()
    {
        this.rFormSubbmitted = true;
        if (this.docs.length==0 || !this.checkAllDocumentsWasAttached())
        {
            return;
        }

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('F');

        this.subscriptions.push(
            this.annihilationService.finishAnnihilation(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );
    }

    confirm()
    {
        this.rFormSubbmitted = true;
        if (this.docs.length==0)
        {
            return;
        }

        this.rFormSubbmitted = false;
        let modelToSubmit = this.composeModel('A');

        this.subscriptions.push(
            this.annihilationService.confirmEvaluateAnnihilation(modelToSubmit).subscribe(data => {
                    this.router.navigate(['/dashboard/module']);
                }
            )
        );
    }



    private composeModel(currentStep : string) {

        this.endDate = new Date();

        let modelToSubmit: any = this.oldData;
        let annihilationModel: any = this.oldData.medicamentAnnihilation;


        modelToSubmit.id = this.requestId;

        annihilationModel.documents = this.docs;

        annihilationModel.medicamentsMedicamentAnnihilationMeds = this.medicamentsToDestroy;

        annihilationModel.commisions = this.rForm.get('commision').value;

        modelToSubmit.requestHistories = [{
            startDate: this.startDate,
            endDate: this.endDate,
            username: this.authService.getUserName(),
            step: 'A'
        }];

        modelToSubmit.currentStep = currentStep;
        modelToSubmit.assignedUser = this.authService.getUserName();

        modelToSubmit.medicamentAnnihilation = annihilationModel;
        return modelToSubmit;
    }

    viewDoc(document: any) {
        this.loadingService.show();
        this.subscriptions.push(this.annihilationService.viewProcesVerbal(this.composeModel('A')).subscribe(data => {
                let file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                this.loadingService.hide();
            }
            )
        );
    }

    checkAllDocumentsWasAttached(): boolean
    {
        return !this.outDocuments.find(od => od.status.mode === 'N');
    }

    documentAdded(event) {
        this.refreshOutputDocuments();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
