(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-1-medicament-registration-module"],{

/***/ "./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.css":
/*!**************************************************************************************!*\
  !*** ./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.css ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Evaluare primara</h3>\n  <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\" disabled value=\"Nr12345\">\n          <label for=\"nrCererii\">Nr. cererii\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" disabled>\n            <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n  <hr>\n  <!-- Begin table -->\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"compSolicitant\">Compania solicitant\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"med\">Medicamentul\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-12\">\n      <div class=\"md-form\">\n        <mat-radio-group [(ngModel)]=\"model3\" disabled>\n          <div class=\"container\">\n            <div class=\"row\">\n              <div class=\"col-12\">\n                <mat-radio-button name=\"prop1\" value=\"A2\">Primară</mat-radio-button>\n              </div>\n              <div class=\"col-12\">\n                <mat-radio-button name=\"prop2\" value=\"B2\">Repetată</mat-radio-button>\n              </div>\n            </div>\n          </div>\n        </mat-radio-group>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <div class=\"md-form\">\n    <mat-form-field class=\"w-100\">\n      <mat-select placeholder=\"Forma farmaceutică\" disabled>\n        <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n      </mat-select>\n    </mat-form-field>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Substanţa(e) activă(e)</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"denumirea\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"denumirea\">Denumirea</label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Doza\">\n            <mat-option *ngFor=\"let x of doza\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"quantity\" mdbInputDirective type=\"number\" class=\"form-control\">\n        <label for=\"quantity\">Cantitatea</label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"codCas\" mdbInputDirective type=\"text\" class=\"form-control\" disabled value=\"Cod12345\">\n        <label for=\"codCas\">Codul CAS a substanţei active</label>\n      </div>\n    </div>\n  </div>\n  <div class=\"text-center\">\n    <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adauga nouă Substanţa(e)\n      activă(e)</button>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"denumireaComunInter\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"denumireaComunInter\">Denumirea comună internaționala</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"volum\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"volum\">Volumul</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"divizare\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"divizare\">Divizare(ări) ambalajului</label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"codMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"codMed\">Codul(rile) medicamentului</label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"termenVal\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"termenVal\">Termen de valabilitate</label>\n      </div>\n    </div>\n  </div>\n  <hr>\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Clasificarea medicamentului\">\n              <mat-option *ngFor=\"let x of clasifyMed\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <h5 class=\"text-center font-weight-bold\">Grup medicament</h5>\n          <hr>\n          <div class=\"container\">\n            <mat-radio-group [(ngModel)]=\"model2\">\n              <div class=\"row\">\n                <div class=\"col-12\">\n                  <mat-radio-button name=\"prop1\" value=\"A1\">Vital</mat-radio-button>\n                </div>\n                <div class=\"col-12\">\n                  <mat-radio-button name=\"prop2\" value=\"B1\">Esenţial</mat-radio-button>\n                </div>\n                <div class=\"col-12\">\n                  <mat-radio-button name=\"prop2\" value=\"C1\">Nonesenţial</mat-radio-button>\n                </div>\n              </div>\n            </mat-radio-group>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <h5 class=\"text-center font-weight-bold\">Eliberare receta</h5>\n          <hr>\n          <div class=\"container\">\n            <mat-radio-group [(ngModel)]=\"model3\">\n              <div class=\"row\">\n                <div class=\"col-12\">\n                  <mat-radio-button name=\"prop1\" value=\"A2\">Cu prescripţia</mat-radio-button>\n                </div>\n                <div class=\"col-12\">\n                  <mat-radio-button name=\"prop2\" value=\"B2\">Fără prescripţia</mat-radio-button>\n                </div>\n              </div>\n            </mat-radio-group>\n          </div>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"denumireaAutProd\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"denumireaAutProd\">Deţinătorul(ii) autorizaţiei de producere</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"taraDetinAutProd\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"taraDetinAutProd\">Ţara deţinătorului autorizaţiei de producere</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"adresaDetAutProd\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"adresaDetAutProd\">Adresa deţinătorului autorizaţiei de producere</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"prodSubsActiv\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"prodSubsActiv\">Producătorul(ii) substanţei active</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"taraProSubsActiv\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"taraProSubsActiv\">Ţara producătorului substanţei active</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"adresaProdSubsActive\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"adresaProdSubsActive\">Adresa producătorului substanţei active</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"prodProduFinish\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"prodProduFinish\">Producătorul(ii) produsului finit</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"taraProdProduInit\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"taraProdProduInit\">Ţara producătorului produsului finit</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"adresaProdProduFinish\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"adresaProdProduFinish\">Adresa producătorului produsului finit</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <div class=\"alert alert-primary\">\n            Nr. scrisorii(ilor) de notificare\n            <a href=\"#\" class=\"alert-link\">12345</a>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker1\" placeholder=\"Data scrisorii(ilor) de notificare\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker1></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"bonulPlata\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"bonulPlata\">Bonul(rile) de plată</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data bonului(rilor) de plată\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker2></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"suma\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"suma\">Suma achitării (lei)</label>\n        </div>\n      </div>\n      <div class=\"col-md-12\">\n        <div class=\"md-form\">\n          <input id=\"motivEmiBon\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"motivEmiBon\">Motivul emiterii bonului</label>\n        </div>\n      </div>\n    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" routerLink=\"/doc/analyze\" mdbWavesEffect>Urmatorul\n        pas</button>\n      <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" routerLink=\"/drugs/cancel\" mdbWavesEffect>Intrerupere</button>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.ts ***!
  \*************************************************************************************/
/*! exports provided: EvaluarePrimaraComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EvaluarePrimaraComponent", function() { return EvaluarePrimaraComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EvaluarePrimaraComponent = /** @class */ (function () {
    function EvaluarePrimaraComponent() {
        this.forma = [
            { value: 'forma-1', viewValue: 'Forma 1' },
            { value: 'forma-2', viewValue: 'Forma 2' },
            { value: 'forma-3', viewValue: 'Forma 3' },
        ];
        this.doza = [
            { value: 'mg', viewValue: 'mg' },
            { value: 'g', viewValue: 'g' }
        ];
        this.cerere = [
            { denumirea: 'Cerere de inregistrare a medicamentului 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.clasifyMed = [
            { value: 'original', viewValue: 'Original' },
            { value: 'generic', viewValue: 'Generic' }
        ];
    }
    EvaluarePrimaraComponent.prototype.ngOnInit = function () {
        this.model2 = 'A1';
        this.model3 = 'B2';
    };
    EvaluarePrimaraComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-evaluare-primara',
            template: __webpack_require__(/*! ./evaluare-primara.component.html */ "./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.html"),
            styles: [__webpack_require__(/*! ./evaluare-primara.component.css */ "./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], EvaluarePrimaraComponent);
    return EvaluarePrimaraComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-1/medicament-registration-routing.module.ts":
/*!********************************************************************************!*\
  !*** ./src/app/all-modules/module-1/medicament-registration-routing.module.ts ***!
  \********************************************************************************/
/*! exports provided: MedicamentRegistrationRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MedicamentRegistrationRoutingModule", function() { return MedicamentRegistrationRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _samsa_samsa_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./samsa/samsa.component */ "./src/app/all-modules/module-1/samsa/samsa.component.ts");
/* harmony import */ var _evaluare_primara_evaluare_primara_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./evaluare-primara/evaluare-primara.component */ "./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.ts");
/* harmony import */ var _reg_cerere_reg_cerere_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reg-cerere/reg-cerere.component */ "./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [
    { path: 'register', component: _reg_cerere_reg_cerere_component__WEBPACK_IMPORTED_MODULE_4__["RegCerereComponent"] },
    { path: 'evaluate', component: _evaluare_primara_evaluare_primara_component__WEBPACK_IMPORTED_MODULE_3__["EvaluarePrimaraComponent"] },
    { path: 'samsa', component: _samsa_samsa_component__WEBPACK_IMPORTED_MODULE_2__["SamsaComponent"] },
];
var MedicamentRegistrationRoutingModule = /** @class */ (function () {
    function MedicamentRegistrationRoutingModule() {
    }
    MedicamentRegistrationRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], MedicamentRegistrationRoutingModule);
    return MedicamentRegistrationRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-1/medicament-registration.module.ts":
/*!************************************************************************!*\
  !*** ./src/app/all-modules/module-1/medicament-registration.module.ts ***!
  \************************************************************************/
/*! exports provided: MedicamentRegistrationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MedicamentRegistrationModule", function() { return MedicamentRegistrationModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _medicament_registration_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./medicament-registration-routing.module */ "./src/app/all-modules/module-1/medicament-registration-routing.module.ts");
/* harmony import */ var _reg_cerere_reg_cerere_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reg-cerere/reg-cerere.component */ "./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.ts");
/* harmony import */ var _evaluare_primara_evaluare_primara_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./evaluare-primara/evaluare-primara.component */ "./src/app/all-modules/module-1/evaluare-primara/evaluare-primara.component.ts");
/* harmony import */ var _samsa_samsa_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./samsa/samsa.component */ "./src/app/all-modules/module-1/samsa/samsa.component.ts");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var MedicamentRegistrationModule = /** @class */ (function () {
    function MedicamentRegistrationModule() {
    }
    MedicamentRegistrationModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _medicament_registration_routing_module__WEBPACK_IMPORTED_MODULE_2__["MedicamentRegistrationRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_6__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_7__["MaterialSharedModule"].forRoot(),
            ],
            schemas: [],
            declarations: [_reg_cerere_reg_cerere_component__WEBPACK_IMPORTED_MODULE_3__["RegCerereComponent"], _evaluare_primara_evaluare_primara_component__WEBPACK_IMPORTED_MODULE_4__["EvaluarePrimaraComponent"], _samsa_samsa_component__WEBPACK_IMPORTED_MODULE_5__["SamsaComponent"]]
        })
    ], MedicamentRegistrationModule);
    return MedicamentRegistrationModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-forms {\r\n  position: relative;\r\n  margin-top: 1.5rem;\r\n  margin-bottom: 1.5rem;\r\n}\r\n\r\nlabel.required:not(:empty):after,\r\n.field-header.required:after {\r\n  content: \" *\";\r\n  color: red;\r\n  position: absolute;\r\n  right: 0px;\r\n  top: -15px;\r\n}\r\n\r\n.mt-4s {\r\n  padding-top: 45px;\r\n}\r\n\r\n.md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Inregistrare cerere</h3>\n    <hr>\n        <form [formGroup]='dataForm'>\n            <div class=\"row\">\n                <div class=\"col-lg-5\">\n                    <div class=\"md-form\">\n                        <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\"\n                               formControlName=\"nrCererii\" [attr.disabled]=\"true\">\n                        <label for=\"nrCererii\">Nr. cererii</label>\n                    </div>\n                </div>\n\n                <div class=\"col-lg-5\">\n                    <div class=\"md-form-modified\">\n                        <mat-form-field class=\"w-100\">\n                            <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" formControlName=\"data\">\n                            <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n                            <mat-datepicker touchUi #picker></mat-datepicker>\n                        </mat-form-field>\n                    </div>\n                </div>\n                <div class=\"col-lg-2 position-button mt-3\">\n                    <label class=\"btn btn-indigo btn-sm\" for=\"incarcaraFisier\">\n                        <input id=\"incarcaraFisier\" type=\"file\" style=\"display:none;\" (change)=\"onChange($event)\"\n                               onclick=\"this.value=null;\"> Incarca Cerere\n                    </label>\n                </div>\n            </div>\n        </form>\n    <hr>\n    <table class=\"table table-widths text-center\">\n        <thead class=\"black white-text\">\n        <tr>\n            <th scope=\"col\">Denumire</th>\n            <th scope=\"col\">Format</th>\n            <th scope=\"col\">Data incarcarii</th>\n            <th scope=\"col\">Actiuni</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr *ngFor=\"let x of cereri; let i = index\">\n            <th scope=\"row\">{{ x.denumirea }}</th>\n            <td>{{ x.format }}</td>\n            <td>{{ x.dataIncarcarii }}</td>\n            <td>\n                <button class=\"btn btn-mdb-color btn-sm waves-light\" (click)=\"loadFile()\" mdbWavesEffect>Vizualizare\n                </button>\n                <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" (click)=\"removeDocument(i)\"\n                        mdbWavesEffect>Stergere\n                </button>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n    <hr>\n    <form [formGroup]='rForm'>\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-label>Compania solicitant <span class=\"text-danger\">*</span></mat-label>\n                        <input type=\"text\" aria-label=\"Number\" [formControl]=\"rForm.controls['compGet']\"\n                               matInput\n                               formControlName=\"compGet\" [matAutocomplete]=\"auto\" (ngModelChange)=\"checkCompanyValue()\">\n                        <mat-autocomplete #auto=\"matAutocomplete\" [displayWith]=\"displayFn\">\n                            <mat-option *ngFor=\"let x of filteredOptions | async\" [value]=\"x\">\n                                {{x.name}}\n                            </mat-option>\n                        </mat-autocomplete>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"med\">\n                    <label for=\"med\">Medicamentul\n                        <span class=\"text-danger\">*</span>\n                    </label>\n                </div>\n            </div>\n            <div class=\"col-md-12\">\n                <div class=\"md-form\">\n                    <h5 class=\"text-center font-weight-bold\">\n                        Inregistrare\n                    </h5>\n                    <hr>\n                    <mat-radio-group formControlName=\"primRep\">\n                        <div class=\"container\">\n                            <div class=\"row\">\n                                <div class=\"col-12\">\n                                    <mat-radio-button name=\"prop1\" value=\"A2\">Primară</mat-radio-button>\n                                </div>\n                                <div class=\"col-12\">\n                                    <mat-radio-button name=\"prop2\" value=\"B2\">Repetată</mat-radio-button>\n                                </div>\n                            </div>\n                        </div>\n                    </mat-radio-group>\n                </div>\n            </div>\n            <div class=\"text-center w-100 mt-3\">\n                <div class=\"alert alert-primary\">\n                    <span>Nr. de inregistrare a cererii: </span>\n                    <strong>{{generatedDocNrSeq}}</strong>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"text-center\">\n            <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect (click)=\"nextStep()\">\n                Urmatorul pas\n            </button>\n        </div>\n    </form>\n</div>\n\n<div class=\"alerts-position\">\n    <div *ngIf=\"formSubmitted && !rForm.controls['med'].valid\">\n        <div *ngIf=\"!rForm.controls['med'].valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n                                                  role=\"alert\">\n            <strong>Medicamentul</strong> trebuie introdus\n            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n    </div>\n    <div *ngIf=\"formSubmitted && !rForm.controls['compGet'].valid\">\n        <div *ngIf=\"!rForm.controls['compGet'].valid\"\n                class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n                role=\"alert\">\n            <strong>Compania solicitantă</strong> trebuie selectată\n            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n    </div>\n    <div *ngIf=\"formSubmitted && !rForm.controls['primRep'].valid\">\n        <div *ngIf=\"!rForm.controls['primRep'].valid\"\n                class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n                role=\"alert\">\n            <strong>Tipul inregistrarii</strong> trebuie selectat\n            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n    </div>\n    <div *ngIf=\"formSubmitted && cereri.length==0\">\n        <div *ngIf=\"cereri.length==0\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n                                      role=\"alert\">\n            Cererea nu a fost incarcata\n            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n    </div>\n    <div *ngIf=\"formSubmitted && isWrongValueCompany && rForm.controls['compGet'].valid\">\n        <div *ngIf=\"isWrongValueCompany && rForm.controls['compGet'].valid\"\n                class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n                role=\"alert\">\n            Compania selectata este incorecta\n            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.ts ***!
  \*************************************************************************/
/*! exports provided: RegCerereComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegCerereComponent", function() { return RegCerereComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_service_administration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../shared/service/administration.service */ "./src/app/shared/service/administration.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../confirmation-dialog/confirmation-dialog.component */ "./src/app/confirmation-dialog/confirmation-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var RegCerereComponent = /** @class */ (function () {
    function RegCerereComponent(fb, dialog, router, administrationService) {
        this.fb = fb;
        this.dialog = dialog;
        this.router = router;
        this.administrationService = administrationService;
        this.cereri = [];
        this.subscriptions = [];
        this.rForm = fb.group({
            'compGet': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'med': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'primRep': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
        this.dataForm = fb.group({
            'data': { disabled: true, value: null },
            'nrCererii': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
    }
    RegCerereComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentDate = new Date();
        this.subscriptions.push(this.administrationService.generateDocNr().subscribe(function (data) {
            _this.generatedDocNrSeq = data;
            _this.dataForm.get('nrCererii').setValue(_this.generatedDocNrSeq);
        }, function (error) { return console.log(error); }));
        this.subscriptions.push(this.administrationService.getAllCompanies().subscribe(function (data) {
            _this.companii = data;
            _this.filteredOptions = _this.rForm.controls['compGet'].valueChanges
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["startWith"])(''), 
            // map(value => this._filter(value.viewValue))
            Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (value) { return typeof value === 'string' ? value : value.name; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (name) { return _this._filter(name); }));
        }, function (error) { return console.log(error); }));
        this.dataForm.get('data').setValue(this.currentDate);
    };
    RegCerereComponent.prototype.displayFn = function (user) {
        return user ? user.name : undefined;
    };
    RegCerereComponent.prototype.onChange = function (event) {
        this.file = event.srcElement.files[0];
        var fileName = this.file.name;
        var lastIndex = fileName.lastIndexOf('.');
        var fileFormat = '';
        if (lastIndex !== -1) {
            fileFormat = '*.' + fileName.substring(lastIndex + 1);
        }
        this.sysDate = this.currentDate.getDate() + "." + (this.currentDate.getMonth() + 1) + "." + this.currentDate.getFullYear();
        this.cereri.push({ denumirea: fileName, format: fileFormat, dataIncarcarii: this.sysDate });
    };
    RegCerereComponent.prototype.removeDocument = function (index) {
        var _this = this;
        var dialogRef = this.dialog.open(_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ConfirmationDialogComponent"], {
            data: { message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.cereri.splice(index, 1);
            }
        });
    };
    RegCerereComponent.prototype.loadFile = function () {
        Object(file_saver__WEBPACK_IMPORTED_MODULE_3__["saveAs"])(this.file, this.file.name);
    };
    RegCerereComponent.prototype.checkCompanyValue = function () {
        var _this = this;
        this.isWrongValueCompany = !this.companii.some(function (elem) {
            return _this.rForm.get('compGet').value == null ? true : elem.name === _this.rForm.get('compGet').value.name;
        });
    };
    RegCerereComponent.prototype.nextStep = function () {
        var _this = this;
        this.formSubmitted = true;
        this.isWrongValueCompany = !this.companii.some(function (elem) {
            return _this.rForm.get('compGet').value == null ? true : elem.name === _this.rForm.get('compGet').value.name;
        });
        if (!this.rForm.controls['compGet'].valid || !this.rForm.controls['primRep'].valid || !this.rForm.controls['med'].valid
            || this.cereri.length === 0 || this.isWrongValueCompany) {
            return;
        }
        this.formSubmitted = false;
        // TODO save in DB values from form
        // this.subscriptions.push(this.claimService.editClaim(this.model).subscribe(data => {
        //     this.router.navigate(['/evaluate/initial']);
        //   })
        // );
    };
    RegCerereComponent.prototype._filter = function (name) {
        var filterValue = name.toLowerCase();
        return this.companii.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    RegCerereComponent.prototype.saveToFileSystem = function (response, docName) {
        var blob = new Blob([response]);
        Object(file_saver__WEBPACK_IMPORTED_MODULE_3__["saveAs"])(blob, docName);
    };
    RegCerereComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-reg-cerere',
            template: __webpack_require__(/*! ./reg-cerere.component.html */ "./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.html"),
            styles: [__webpack_require__(/*! ./reg-cerere.component.css */ "./src/app/all-modules/module-1/reg-cerere/reg-cerere.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _shared_service_administration_service__WEBPACK_IMPORTED_MODULE_4__["AdministrationService"]])
    ], RegCerereComponent);
    return RegCerereComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-1/samsa/samsa.component.css":
/*!****************************************************************!*\
  !*** ./src/app/all-modules/module-1/samsa/samsa.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-1/samsa/samsa.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/all-modules/module-1/samsa/samsa.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">SAMSA</h3>\n  <hr>\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\" disabled value=\"Nr12345\">\n        <label for=\"nrCererii\">Nr. cererii\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"compSolicitant\">Compania solicitant\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"med\">Medicamentul\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-radio-group [(ngModel)]=\"model\" disabled>\n          <div class=\"container\">\n            <div class=\"row\">\n              <div class=\"col-6\">\n                <mat-radio-button name=\"prop1\" value=\"A2\">Primară</mat-radio-button>\n              </div>\n              <div class=\"col-6\">\n                <mat-radio-button name=\"prop2\" value=\"B2\">Repetată</mat-radio-button>\n              </div>\n            </div>\n          </div>\n        </mat-radio-group>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-3\">\n      <div class=\"md-form\">\n        <input id=\"nrDizDist\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nrDizDist\">Nr. dispoziţiei de distribuire\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker1\" placeholder=\"Data dispoziţiei de distribuire\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker1></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Experţii\">\n            <mat-option *ngFor=\"let x of experts\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Domeniile de expertiză p-u experţi\">\n            <mat-option *ngFor=\"let x of domains\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"rezExpt\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"rezExpt\">Rezultatul expertizei</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"rezLCCM\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"rezLCCM\">Rezultatul LCCM</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <div class=\"alert alert-primary text-center\">\n          Nr. scrisorii(ilor) de notificare:\n          <a href=\"#\" class=\"alert-link\">Example 12345</a>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data scrisorii(ilor) de notificare\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker2></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"sumaAchit\" mdbInputDirective type=\"number\" class=\"form-control\">\n        <label for=\"sumaAchit\">Suma achitată (lei)</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker7\" placeholder=\"Data achitării\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker7\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker7></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <div class=\"alert alert-primary text-center\">\n          Nr. de înregistrare a medicamentului:\n          <a href=\"#\" class=\"alert-link\">Example 1234</a>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"ordAutMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"ordAutMed\">Ordinul de autorizare a medicamentului</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form-modified\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker6\" placeholder=\"Data ordinului de autorizare\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker6\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker6></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n  </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect (click)=\"basicModal.show()\">Anulare</button>\n      <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Crearea</button>\n      <button class=\"btn btn-mdb-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Inregistrare</button>\n    </div>\n    <hr>\n\n\n  <div mdbModal #basicModal=\"mdbModal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myBasicModalLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\" role=\"document\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"basicModal.hide()\">\n            <span aria-hidden=\"true\">×</span>\n          </button>\n          <h4 class=\"modal-title w-100\" id=\"myModalLabel\">Anulare</h4>\n        </div>\n        <div class=\"modal-body\">\n          <div class=\"row\">\n            <div class=\"col-12\">\n              <div class=\"md-form\">\n                <mat-form-field class=\"w-100\">\n                  <input matInput [matDatepicker]=\"picker4\" placeholder=\"Data achitării\" [formControl]=\"date\" disabled>\n                  <mat-datepicker-toggle matSuffix [for]=\"picker4\" disabled></mat-datepicker-toggle>\n                  <mat-datepicker touchUi #picker4></mat-datepicker>\n                </mat-form-field>\n              </div>\n            </div>\n            <div class=\"col-md-12\">\n              <div class=\"md-form\">\n                <input id=\"motAnulCert\" mdbInputDirective type=\"text\" class=\"form-control\">\n                <label for=\"motAnulCert\">Motivul anulării certificatului</label>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-dark-red-color waves-light btn-sm\" aria-label=\"Close\" (click)=\"basicModal.hide()\" mdbWavesEffect>Anulare</button>\n          <button type=\"button\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm\" mdbWavesEffect>Confirmare</button>\n        </div>\n      </div>\n    </div>\n  </div>"

/***/ }),

/***/ "./src/app/all-modules/module-1/samsa/samsa.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/all-modules/module-1/samsa/samsa.component.ts ***!
  \***************************************************************/
/*! exports provided: SamsaComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SamsaComponent", function() { return SamsaComponent; });
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


var SamsaComponent = /** @class */ (function () {
    function SamsaComponent() {
        this.date = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]({ value: new Date(), disabled: true });
        this.cerere = [
            { denumirea: 'Cerere de inregistrare a medicamentului 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Cerere de inregistrare a medicamentului 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.experts = [
            { value: 'expert-1', viewValue: 'Expert 1' },
            { value: 'expert-2', viewValue: 'Expert 2' },
            { value: 'expert-3', viewValue: 'Expert 3' },
        ];
        this.domains = [
            { value: 'domains-1', viewValue: 'Domeniu 1' },
            { value: 'domains-2', viewValue: 'Domeniu 2' },
            { value: 'domains-3', viewValue: 'Domeniu 3' },
        ];
    }
    SamsaComponent.prototype.ngOnInit = function () {
        this.model = 'B2';
    };
    SamsaComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-samsa',
            template: __webpack_require__(/*! ./samsa.component.html */ "./src/app/all-modules/module-1/samsa/samsa.component.html"),
            styles: [__webpack_require__(/*! ./samsa.component.css */ "./src/app/all-modules/module-1/samsa/samsa.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SamsaComponent);
    return SamsaComponent;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-1-medicament-registration-module.js.map