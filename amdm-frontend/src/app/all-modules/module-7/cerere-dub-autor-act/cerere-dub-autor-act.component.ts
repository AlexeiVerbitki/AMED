import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from "rxjs";
import {AdministrationService} from "../../../shared/service/administration.service";
import {map, startWith} from "rxjs/operators";
import {AuthService} from "../../../shared/service/authetication.service";
import {RequestService} from "../../../shared/service/request.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cerere-dub-autor-act',
  templateUrl: './cerere-dub-autor-act.component.html',
  styleUrls: ['./cerere-dub-autor-act.component.css']
})
export class CerereDubAutorActComponent implements OnInit {

  cerereDupAutorForm: FormGroup;
  documents: Document [] = [];
  formSubmitted: boolean;
  currentDate: Date;
  generatedDocNrSeq: number;
  private subscriptions: Subscription[] = [];
  companies: any[];
  filteredOptions: Observable<any[]>;

  constructor(private fb: FormBuilder, private administrationService: AdministrationService, private authService : AuthService,
              private requestService : RequestService, private router: Router) {
    this.cerereDupAutorForm = fb.group({
        'dataReg': {disabled: true, value: null},
        'currentStep' : ['R'],
        'startDate': [new Date()],
        'endDate': [''],
        'requestNumber': [null, Validators.required],
        'company' : [null, Validators.required],
        'type':
            fb.group({
                'id' : ['9',Validators.required]}),
    });
  }

  ngOnInit() {

    this.currentDate = new Date();
    this.cerereDupAutorForm.get('dataReg').setValue(this.currentDate);

    this.subscriptions.push(
        this.administrationService.generateDocNr().subscribe(data => {
          this.generatedDocNrSeq = data;
          this.cerereDupAutorForm.get('requestNumber').setValue(this.generatedDocNrSeq);
          },
            error => console.log(error)
        )
    );

      this.subscriptions.push(
          this.administrationService.getAllCompanies().subscribe(data => {
                  this.companies = data;
                  this.filteredOptions = this.cerereDupAutorForm.get('company').valueChanges
                      .pipe(
                          startWith<string | any>(''),
                          map(value => typeof value === 'string' ? value : value.name),
                          map(name => this._filter(name))
                      );
              },
              error => console.log(error)
          )
      );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.companies.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  saveRequest() {

      this.formSubmitted = true;

      if (this.documents.length === 0 || !this.cerereDupAutorForm.get('company').valid) {
          return;
      }

      this.formSubmitted = false;

      this.cerereDupAutorForm.get('endDate').setValue(new Date());
      this.cerereDupAutorForm.get('company').setValue(this.cerereDupAutorForm.value.company);

      let modelToSubmit : any = this.cerereDupAutorForm.value;
      modelToSubmit.requestHistories = [{startDate : this.cerereDupAutorForm.get('startDate').value, endDate : this.cerereDupAutorForm.get('endDate').value,
          username : this.authService.getUserName(), step : 'R' }];
      modelToSubmit.documents = this.documents;

      console.log(modelToSubmit);

      this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
              this.router.navigate(['dashboard/module']);
          })
      );
    
  }
}
