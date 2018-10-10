(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-3-price-module"],{

/***/ "./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.css":
/*!******************************************************************************************!*\
  !*** ./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.css ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Evaluarea cererii de inregistrare a pretului la medicamente</h3>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Documente incarcate</h5>\n  <hr>\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th>Format</th>\n        <th>Data incarcarii</th>\n        <th>Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let a of aprob\">\n        <th scope=\"row\">{{ a.denumire }}</th>\n        <td>{{ a.format }}</td>\n        <td>{{ a.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <form [formGroup]='zForm'>\n    <div class=\"row\">\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker\" placeholder=\"03/03/2018\" [disabled]=\"true\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n          <label for=\"nrCererii\">Nr. de inregistrare a cererii\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" [disabled]=\"true\">\n          <label for=\"compSolicitant\">Compania-solicitant\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"denumireaMed\" mdbInputDirective type=\"text\" class=\"form-control\" [disabled]=\"true\" placeholder=\"Aspirina (Acid acetilsalicilic)\">\n          <label for=\"denumireaMed\">Denumirea medicamentului\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"codMed\" mdbInputDirective type=\"text\" class=\"form-control\" [disabled]=\"true\" placeholder=\"ASPIRIN\">\n          <label for=\"codMed\">Codul medicamentului\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"doza\" mdbInputDirective type=\"number\" class=\"form-control\" placeholder=\"500.0\" [disabled]=\"true\">\n          <label for=\"doza\">Doza\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Unitate de masura\" [disabled]=\"true\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"prod\" mdbInputDirective type=\"text\" class=\"form-control\" [disabled]=\"true\" placeholder=\"Farmacia Familiei\">\n          <label for=\"prod\">Producator\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Preturi propuse</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"pret\" mdbInputDirective type=\"number\" class=\"form-control\" [disabled]=\"true\" placeholder=\"2.00\">\n          <label for=\"pret\">Pret\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta\" [disabled]=\"true\">\n              <mat-option *ngFor=\"let x of valuta\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"pret2\" mdbInputDirective type=\"number\" class=\"form-control\" [disabled]=\"true\" placeholder=\"0.1\">\n          <label for=\"pret2\">Pret\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta\" [disabled]=\"true\">\n              <mat-option *ngFor=\"let x of valuta\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">\n      Preturi in tari de referinta\n    </h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-2\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Tara\" [disabled]=\"true\">\n              <mat-option *ngFor=\"let x of country\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-2\">\n        <div class=\"md-form\">\n          <input id=\"pret3\" mdbInputDirective type=\"number\" class=\"form-control\" [disabled]=\"true\" placeholder=\"1.90\">\n          <label for=\"pret3\">Pret\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-2\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta\" [disabled]=\"true\">\n              <mat-option *ngFor=\"let x of valuta\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"row\">\n          <div class=\"col\">\n            <div class=\"md-form-modified\">\n              <mat-form-field class=\"w-100\">\n                <input matInput [matDatepicker]=\"picker1\" placeholder=\"Data preluarii cursului valutar\" [disabled]=\"true\"\n                  [formControl]=\"date\">\n                <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>\n                <mat-datepicker touchUi #picker1></mat-datepicker>\n              </mat-form-field>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-2\">\n        <div class=\"position-button\">\n          <div class=\"md-form pt-1\">\n            <button type=\"button\" class=\"btn btn-mdb-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Extrage curs\n              valutar</button>\n          </div>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Curs valutar</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"eur\" mdbInputDirective type=\"number\" class=\"form-control\" value=\"19.57\" formControlName=\"eur\">\n          <label for=\"eur\">Euro (EUR)</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"rur\" mdbInputDirective type=\"number\" class=\"form-control\" value=\"0.41\" formControlName=\"rur\">\n          <label for=\"rur\">Rubla ruseasca (RUR)</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"usd\" mdbInputDirective type=\"number\" class=\"form-control\" value=\"16.61\" formControlName=\"usd\">\n          <label for=\"usd\">Dolar american (USD)</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"pretAccept\" mdbInputDirective type=\"number\" class=\"form-control\" value=\"\" formControlName=\"pretAccept\">\n          <label for=\"pretAccept\">Pret acceptat <strong class=\"text-danger\">*</strong></label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta pretului acceptat \" formControlName=\"valutaFinishProp\">\n              <mat-option *ngFor=\"let x of valutaAccept\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Documente de iesire</h5>\n    <hr>\n    <table class=\"table table-widths-lg text-center\">\n      <thead class=\"black white-text\">\n        <tr>\n          <th scope=\"col\">Denumirea</th>\n          <th>Statut</th>\n          <th>Actiuni</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr *ngFor=\"let a of docIesire\">\n          <th scope=\"row\">{{ a.denumire }}</th>\n          <td>{{ a.statut }}</td>\n          <td>\n            <button class=\"btn btn-default btn-sm waves-light\" mdbWavesEffect>Generare</button>\n            <button [disabled]=a.status class=\"btn btn-mdb-color waves-light btn-sm waves-light\" mdbWavesEffect>Vizualizare</button>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"ordAprobPret\" mdbInputDirective type=\"text\" class=\"form-control\" value=\"AB123\" formControlName=\"ordAprobPret\">\n          <label for=\"ordAprobPret\">Ordin de aprobare a pretului</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data expirarii\" formControlName=\"dataExp\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker2></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Motivul expirarii\" formControlName=\"motivulExp\">\n              <mat-option *ngFor=\"let x of motivulExp\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col\">\n        <div class=\"md-form\">\n          <textarea id=\"note\" type=\"text\" class=\"md-textarea form-control\" mdbInputDirective formControlName=\"note\"></textarea>\n          <label for=\"note\" for=\"form7\">Note</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"text-center\">\n      <button class=\"btn btn-dark-red-color btn-sm waves-light\" mdbWavesEffect>Inapoi la pasul de inregistrare</button>\n      <button class=\"btn btn-mdb-color waves-light btn-sm waves-light\" mdbWavesEffect>Urmatorul pas</button>\n    </div>\n  </form>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: PriceEvaluateMedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PriceEvaluateMedComponent", function() { return PriceEvaluateMedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PriceEvaluateMedComponent = /** @class */ (function () {
    function PriceEvaluateMedComponent(fb) {
        this.fb = fb;
        this.date = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]({ value: new Date(), disabled: true });
        this.aprob = [
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
        ];
        this.valutaAccept = [
            { value: 'none', viewValue: '(None)' },
            { value: 'MDL', viewValue: 'Lei MD' },
            { value: 'RON', viewValue: 'Lei RO' },
            { value: 'HRU', viewValue: 'Hrivne' },
            { value: 'RUR', viewValue: 'Ruble rusesti' },
            { value: 'EUR', viewValue: 'Euro' },
            { value: 'USD', viewValue: 'Dolari americani' },
        ];
        this.docIesire = [
            { denumire: 'Ordin de inregistrare a pretului', statut: 'Generat', status: true },
            { denumire: 'Anexa 1', statut: 'Lipsa', status: false },
            { denumire: 'Anexa 2', statut: 'Lipsa', status: false }
        ];
        this.motivulExp = [
            { value: 'none', viewValue: '(None)' },
            { value: 'exp', viewValue: 'Expirarea contractului pe termen fix' },
            { value: 'recalc', viewValue: 'Recalcularea preturilor' },
        ];
        this.zForm = fb.group({
            'priceRefProp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'valutaFinishProp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'eur': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'rur': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'usd': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'pretAccept': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'ordAprobPret': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'dataExp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'motivulExp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'note': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    PriceEvaluateMedComponent.prototype.ngOnInit = function () {
    };
    PriceEvaluateMedComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-price-evaluate-med',
            template: __webpack_require__(/*! ./price-evaluate-med.component.html */ "./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.html"),
            styles: [__webpack_require__(/*! ./price-evaluate-med.component.css */ "./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], PriceEvaluateMedComponent);
    return PriceEvaluateMedComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Înregistrarea prețului medicamentului</h3>\n    <hr>\n    <form [formGroup]='dataForm'>\n        <div class=\"row\">\n            <div class=\"col-lg-5\">\n                <div class=\"md-form\">\n                    <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\"\n                           formControlName=\"nrCererii\" [attr.disabled]=\"true\">\n                    <label for=\"nrCererii\">Nr. cererii</label>\n                </div>\n            </div>\n  \n            <div class=\"col-lg-5\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" formControlName=\"data\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-lg-2 position-button mt-3\">\n                <label class=\"btn btn-indigo btn-sm\" for=\"incarcaraFisier\">\n                    <input id=\"incarcaraFisier\" type=\"file\" style=\"display:none;\" (change)=\"onChange($event)\"\n                           onclick=\"this.value=null;\"> Incarca Cerere\n                </label>\n            </div>\n        </div>\n    </form>\n  <hr>\n    <table class=\"table table-widths-lg text-center\">\n        <thead class=\"black white-text\">\n            <tr>\n                <th scope=\"col\">Denumire</th>\n                <th>Format</th>\n                <th>Data incarcarii</th>\n                <th>Actiuni</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr *ngFor=\"let d of documents; let i = index\">\n                <th scope=\"row\">{{ d.file.name }}</th>\n                <td>{{ d.format }}</td>\n                <td>{{ d.uploadDate }}</td>\n                <td>\n                    <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect (click)=\"viewFile(i)\">View</button>\n                    <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect (click)=\"removeDocument(i)\">Delete\n                    </button>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <hr>\n    <form [formGroup]='PriceRegForm'>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-label>Compania solicitant <span class=\"text-danger\">*</span></mat-label>\n                        <input type=\"text\" aria-label=\"Number\" [formControl]=\"PriceRegForm.controls['companiesDropDown']\"\n                            matInput formControlName=\"companiesDropDown\" [matAutocomplete]=\"companyAuto\"\n                            (ngModelChange)=\"chekCompanyValue()\">\n                        <mat-autocomplete #companyAuto=\"matAutocomplete\" [displayWith]=\"displayFn\">\n                            <mat-option *ngFor=\"let x of filteredOptions | async\" [value]=\"x\">\n                                {{x.name}}\n                            </mat-option>\n                        </mat-autocomplete>\n                    </mat-form-field>\n                </div>\n            </div>\n\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-label>Medicamentul<span class=\"text-danger\">*</span></mat-label>\n                        <input type=\"text\" aria-label=\"Number\" [formControl]=\"PriceRegForm.controls['medDropDown']\"\n                            matInput formControlName=\"medDropDown\" [matAutocomplete]=\"medAuto\" (ngModelChange)=\"chekMedValue()\">\n                        <mat-autocomplete #medAuto=\"matAutocomplete\" [displayWith]=\"displayFn\">\n                            <mat-option *ngFor=\"let m of companyMedicaments | async\" [value]=\"m\">\n                                {{m.name}}\n                            </mat-option>\n                        </mat-autocomplete>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Doza(e)\">\n                            <mat-option *ngFor=\"let x of doza\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"quantity\" mdbInputDirective type=\"number\" class=\"form-control\">\n                    <label for=\"quantity\">Cantitatea</label>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"codMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"codMed\">Codul(rile) medicamentului</label>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"pretPropusSol\" mdbInputDirective type=\"number\" class=\"form-control\">\n                    <label for=\"pretPropusSol\">Prețul(rile) propus(e) de solicitant</label>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Valuta prețului(rilor) propuse de solicitant\">\n                            <mat-option *ngFor=\"let x of valuta\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"pretMed9Ref\" mdbInputDirective type=\"number\" class=\"form-control\">\n                    <label for=\"pretMed9Ref\">Prețul(rile) medicamentului în 9 țari de referința</label>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Valuta ţărilor de referinţă\">\n                            <mat-option *ngFor=\"let x of valuta\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"copiileCat\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"copiileCat\">Copiile cataloagelor</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"pretAccept\" mdbInputDirective type=\"number\" class=\"form-control\">\n                    <label for=\"pretAccept\">Preţul acceptat</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Valuta ţărilor de referinţă\">\n                            <mat-option *ngFor=\"let x of valuta\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data de expirare\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker2></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"motivulExp\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"motivulExp\">Motivul de expirare</label>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"ord\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"ord\">Ordinul</label>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"anexa\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"anexa\">Anexa</label>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data emiterii ordinului\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker3></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"nrOrd\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrOrd\">Nr. al ordinului</label>\n                </div>\n            </div>\n            <div class=\"col-12\">\n                <div class=\"md-form\">\n                    <textarea id=\"nota\" type=\"text\" class=\"md-textarea form-control\" mdbInputDirective></textarea>\n                    <label for=\"nota\">Notă</label>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <h5 class=\"text-center font-weight-bold\">Cursul</h5>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"usd2\" mdbInputDirective type=\"number\" class=\"form-control\">\n                    <label for=\"usd2\">USD</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"eu2\" mdbInputDirective type=\"number\" class=\"form-control\">\n                    <label for=\"eu2\">EU</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"rur2\" mdbInputDirective type=\"number\" class=\"form-control\">\n                    <label for=\"rur2\">RUR</label>\n                </div>\n            </div>\n        </div>\n        <div class=\"position-button\">\n            <button type=\"submit\" class=\"btn btn-mdb-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adauga unitate\n                de masura\n            </button>\n        </div>\n        <hr>\n        <div class=\"text-center\">\n            <button type=\"submit\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Urmatorul\n                pas\n            </button>\n        </div>\n    </form>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.ts ***!
  \*******************************************************************************/
/*! exports provided: PriceRegMedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PriceRegMedComponent", function() { return PriceRegMedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_service_reg_prices_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/service/reg-prices.service */ "./src/app/shared/service/reg-prices.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../confirmation-dialog/confirmation-dialog.component */ "./src/app/confirmation-dialog/confirmation-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var PriceRegMedComponent = /** @class */ (function () {
    function PriceRegMedComponent(fb, dialog, priceService) {
        this.fb = fb;
        this.dialog = dialog;
        this.priceService = priceService;
        this.documents = [];
        this.subscriptions = [];
        this.companies = [];
        this.medicaments = [];
        this.compSolicitant = [
            { value: 'comp-1', viewValue: 'Compania 1' },
            { value: 'comp-2', viewValue: 'Compania 2' },
            { value: 'comp-3', viewValue: 'Compania 3' },
            { value: 'comp-4', viewValue: 'Compania 4' },
            { value: 'comp-5', viewValue: 'Compania 5' }
        ];
        this.doza = [
            { value: 'micrograme', viewValue: 'micrograme' },
            { value: 'mg', viewValue: 'mg' },
            { value: 'g', viewValue: 'g' }
        ];
        this.valuta = [
            { value: 'MDL', viewValue: 'Lei MD' },
            { value: 'RON', viewValue: 'Lei RO' },
            { value: 'HRU', viewValue: 'Hrivne UKR' },
            { value: 'RUR', viewValue: 'Ruble RU' },
            { value: 'EUR', viewValue: 'Euro' },
            { value: 'USD', viewValue: 'Dolari SUA' },
        ];
        this.country = [
            { value: 'ROM', viewValue: 'Romania' },
            { value: 'UKR', viewValue: 'Ucraina' },
            { value: 'RU', viewValue: 'Rusia' },
            { value: 'FR', viewValue: 'Franta' },
            { value: 'GER', viewValue: 'Germania' },
        ];
        this.PriceRegForm = fb.group({
            'nrCerereInput': { disabled: true, value: null },
            'dataReg': { disabled: true, value: null },
            'companiesDropDown': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'medDropDown': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    PriceRegMedComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.uploadDate = new Date();
        this.PriceRegForm.get('dataReg').setValue(this.uploadDate);
        this.subscriptions.push(this.priceService.generateDocNumber().subscribe(function (generatedNumber) {
            _this.generatedDocNrSeq = generatedNumber;
            _this.PriceRegForm.get('nrCerereInput').setValue(_this.generatedDocNrSeq);
        }, function (error) { return console.log(error); }));
        this.subscriptions.push(this.priceService.getCompanies().subscribe(function (companiesData) {
            _this.companies = companiesData;
            _this.filteredOptions = _this.PriceRegForm.controls['companiesDropDown'].valueChanges
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["startWith"])(''), 
            // map( value => {this.getMedicaments(value.id); return value; }),
            Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (value) { return typeof value === 'string' ? value : value.name; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (name) { return _this._filter(name); }));
        }, function (error) { return console.log(error); }));
        // this.PriceRegForm.controls['medDropDown'].valueChanges
        //   .pipe(
        //     startWith<string | any>(''),
        //     map( value => {this.getMedicaments(value.id); return value; }),
        //     map(value => typeof value === 'string' ? value : value.denumirea),
        //     map(denumirea => this._filter(denumirea))
        //   );
    };
    PriceRegMedComponent.prototype.getMedicaments = function (id) {
        if (id === this.lastCompanyId)
            return;
        this.lastCompanyId = id;
        this.PriceRegForm.controls['medDropDown'].setValue('');
        if (id !== undefined) {
            this.companyMedicaments = this.priceService.getCompanyMedicaments(id); // .pipe(map(medicament => this.populateMedicamentFields(medicament as Medicament)));
        }
    };
    PriceRegMedComponent.prototype.populateMedicamentFields = function (medicament) {
        // this.PriceRegForm.controls['quantity'].setValue(medicament.quantity);
    };
    PriceRegMedComponent.prototype._filter = function (name) {
        var filterValue = name.toLowerCase();
        return this.companies.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    PriceRegMedComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (value) { return value.unsubscribe(); });
    };
    PriceRegMedComponent.prototype.chekCompanyValue = function () {
        var _this = this;
        this.isWrongValueCompany = !this.companies.some(function (elem) {
            return _this.PriceRegForm.get('companiesDropDown').value == null ? true : elem.name == _this.PriceRegForm.get('companiesDropDown').value.name;
        });
    };
    PriceRegMedComponent.prototype.chekMedValue = function () { };
    PriceRegMedComponent.prototype.displayFn = function (entity) {
        return entity ? entity.name : undefined;
    };
    PriceRegMedComponent.prototype.viewFile = function (index) {
        this.currentFile = this.documents[index].name;
        Object(file_saver__WEBPACK_IMPORTED_MODULE_5__["saveAs"])(this.currentFile, this.currentFile.name);
    };
    PriceRegMedComponent.prototype.removeDocument = function (index) {
        var _this = this;
        var dialogRef = this.dialog.open(_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_6__["ConfirmationDialogComponent"], {
            data: { message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.documents.splice(index, 1);
            }
        });
    };
    PriceRegMedComponent.prototype.addDocument = function (event) {
        this.currentFile = event.srcElement.files[0];
        var fileName = this.currentFile.name;
        var lastIndex = fileName.lastIndexOf('.');
        var fileFormat = '';
        if (lastIndex !== -1) {
            fileFormat = '*.' + fileName.substring(lastIndex + 1);
        }
        // this.documents.push({ name: this.currentFile,
        //   format: fileFormat,
        //   uploadDate: new DatePipe('en-US').transform(this.uploadDate,  'dd.MM.yyyy') });
    };
    PriceRegMedComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-price-reg-med',
            template: __webpack_require__(/*! ./price-reg-med.component.html */ "./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.html"),
            styles: [__webpack_require__(/*! ./price-reg-med.component.css */ "./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"], _shared_service_reg_prices_service__WEBPACK_IMPORTED_MODULE_3__["PricesRegService"]])
    ], PriceRegMedComponent);
    return PriceRegMedComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-3/price-routing.module.ts":
/*!**************************************************************!*\
  !*** ./src/app/all-modules/module-3/price-routing.module.ts ***!
  \**************************************************************/
/*! exports provided: PriceRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PriceRoutingModule", function() { return PriceRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _price_reg_med_price_reg_med_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./price-reg-med/price-reg-med.component */ "./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.ts");
/* harmony import */ var _price_evaluate_med_price_evaluate_med_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./price-evaluate-med/price-evaluate-med.component */ "./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    { path: 'register', component: _price_reg_med_price_reg_med_component__WEBPACK_IMPORTED_MODULE_2__["PriceRegMedComponent"] },
    { path: 'evaluate', component: _price_evaluate_med_price_evaluate_med_component__WEBPACK_IMPORTED_MODULE_3__["PriceEvaluateMedComponent"] },
];
var PriceRoutingModule = /** @class */ (function () {
    function PriceRoutingModule() {
    }
    PriceRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], PriceRoutingModule);
    return PriceRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-3/price.module.ts":
/*!******************************************************!*\
  !*** ./src/app/all-modules/module-3/price.module.ts ***!
  \******************************************************/
/*! exports provided: PriceModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PriceModule", function() { return PriceModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _price_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./price-routing.module */ "./src/app/all-modules/module-3/price-routing.module.ts");
/* harmony import */ var _price_evaluate_med_price_evaluate_med_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./price-evaluate-med/price-evaluate-med.component */ "./src/app/all-modules/module-3/price-evaluate-med/price-evaluate-med.component.ts");
/* harmony import */ var _price_reg_med_price_reg_med_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./price-reg-med/price-reg-med.component */ "./src/app/all-modules/module-3/price-reg-med/price-reg-med.component.ts");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var PriceModule = /** @class */ (function () {
    function PriceModule() {
    }
    PriceModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _price_routing_module__WEBPACK_IMPORTED_MODULE_2__["PriceRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_5__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_6__["MaterialSharedModule"].forRoot(),
            ],
            schemas: [],
            declarations: [_price_reg_med_price_reg_med_component__WEBPACK_IMPORTED_MODULE_4__["PriceRegMedComponent"], _price_evaluate_med_price_evaluate_med_component__WEBPACK_IMPORTED_MODULE_3__["PriceEvaluateMedComponent"]]
        })
    ], PriceModule);
    return PriceModule;
}());



/***/ }),

/***/ "./src/app/shared/service/company.service.ts":
/*!***************************************************!*\
  !*** ./src/app/shared/service/company.service.ts ***!
  \***************************************************/
/*! exports provided: CompanyService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompanyService", function() { return CompanyService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CompanyService = /** @class */ (function () {
    function CompanyService(http) {
        this.http = http;
    }
    CompanyService.prototype.getCompanies = function () {
        return this.http.get('/api/all-companies');
    };
    CompanyService.prototype.addCompany = function () { };
    CompanyService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], CompanyService);
    return CompanyService;
}());



/***/ }),

/***/ "./src/app/shared/service/document.service.ts":
/*!****************************************************!*\
  !*** ./src/app/shared/service/document.service.ts ***!
  \****************************************************/
/*! exports provided: DocumentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentService", function() { return DocumentService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DocumentService = /** @class */ (function () {
    function DocumentService(http) {
        this.http = http;
    }
    DocumentService.prototype.generateDocNr = function () {
        return this.http.get('/api/generate-doc-nr', {});
    };
    DocumentService.prototype.uploadDocument = function () { };
    DocumentService.prototype.removeDocument = function () { };
    DocumentService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], DocumentService);
    return DocumentService;
}());



/***/ }),

/***/ "./src/app/shared/service/medicament.service.ts":
/*!******************************************************!*\
  !*** ./src/app/shared/service/medicament.service.ts ***!
  \******************************************************/
/*! exports provided: MedicamentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MedicamentService", function() { return MedicamentService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MedicamentService = /** @class */ (function () {
    function MedicamentService(http) {
        this.http = http;
    }
    MedicamentService.prototype.getCompanyMedicaments = function (companyId) {
        var Params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]();
        Params = Params.set('companyId', companyId);
        return this.http.get('/api/company-medicaments', { params: Params });
    };
    MedicamentService.prototype.addMedicament = function () { };
    MedicamentService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], MedicamentService);
    return MedicamentService;
}());



/***/ }),

/***/ "./src/app/shared/service/reg-prices.service.ts":
/*!******************************************************!*\
  !*** ./src/app/shared/service/reg-prices.service.ts ***!
  \******************************************************/
/*! exports provided: PricesRegService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PricesRegService", function() { return PricesRegService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _document_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./document.service */ "./src/app/shared/service/document.service.ts");
/* harmony import */ var _company_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./company.service */ "./src/app/shared/service/company.service.ts");
/* harmony import */ var _medicament_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./medicament.service */ "./src/app/shared/service/medicament.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PricesRegService = /** @class */ (function () {
    function PricesRegService(docService, companyService, medicamentService) {
        this.docService = docService;
        this.companyService = companyService;
        this.medicamentService = medicamentService;
    }
    PricesRegService.prototype.getCompanies = function () {
        return this.companyService.getCompanies();
    };
    PricesRegService.prototype.generateDocNumber = function () {
        return this.docService.generateDocNr();
    };
    PricesRegService.prototype.getCompanyMedicaments = function (companyId) {
        return this.medicamentService.getCompanyMedicaments(companyId);
    };
    PricesRegService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' }),
        __metadata("design:paramtypes", [_document_service__WEBPACK_IMPORTED_MODULE_1__["DocumentService"],
            _company_service__WEBPACK_IMPORTED_MODULE_2__["CompanyService"],
            _medicament_service__WEBPACK_IMPORTED_MODULE_3__["MedicamentService"]])
    ], PricesRegService);
    return PricesRegService;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-3-price-module.js.map