(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-7-drug-control-module"],{

/***/ "./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.css":
/*!**********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Cerere de solicitare a duplicatului autorizatiei de activitate cu precursori/psihotrope/stupefiante</h3>\n  <hr>\n  <table class=\"table table-widths text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <div class=\"col position-button\">\n    <label for=\"incarcaFisier\" class=\"btn btn-indigo btn-sm\">\n      <input id=\"incarcaFisier\" type=\"file\" style=\"display:none;\"> Incarca Fisier\n    </label>\n  </div>\n  <form [formGroup]='zForm'>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" required formControlName=\"data\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"nrReg\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"nrReg\">\n          <label for=\"nrReg\">Nr. de inregistrare a cererii\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n      <hr>\n      <div class=\"col-md-12\">\n        <div class=\"md-form\">\n          <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"compSolicitant\">\n          <label for=\"compSolicitant\">Compania-solicitant\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n    </div>\n  </form>\n  <hr>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: CerereDubAutorActComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CerereDubAutorActComponent", function() { return CerereDubAutorActComponent; });
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


var CerereDubAutorActComponent = /** @class */ (function () {
    function CerereDubAutorActComponent(fb) {
        this.fb = fb;
        this.cerere = [
            { denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.zForm = fb.group({
            'data': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'compSolicitant': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
    }
    CerereDubAutorActComponent.prototype.ngOnInit = function () {
    };
    CerereDubAutorActComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-cerere-dub-autor-act',
            template: __webpack_require__(/*! ./cerere-dub-autor-act.component.html */ "./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.html"),
            styles: [__webpack_require__(/*! ./cerere-dub-autor-act.component.css */ "./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], CerereDubAutorActComponent);
    return CerereDubAutorActComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.css":
/*!**********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Cerere de autorizare a importului/exportului precursorilor/psihotropelor/stupefiantelor</h3>\n  <hr>\n  <table class=\"table table-widths text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <div class=\"col position-button\">\n    <label for=\"incarcaFisier\" class=\"btn btn-indigo btn-sm\">\n      <input id=\"incarcaFisier\" type=\"file\" style=\"display:none;\"> Incarca Fisier\n    </label>\n  </div>\n  <hr>\n  <form [formGroup]='zForm'>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker\" placeholder=\"Data inregistrarii\" required formControlName=\"dataReg\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"nrReg\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"nrReg\">\n          <label for=\"nrReg\">Nr. de inregistrare a cererii\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"compSolicitant\">\n          <label for=\"compSolicitant\">Compania-solicitant\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Tipul autorizarii\" formControlName=\"tipulAutorizarii\">\n              <mat-option *ngFor=\"let x of tipulAutorizarii\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Tipul medicamentului\" formControlName=\"tipMed\">\n              <mat-option *ngFor=\"let x of tipMed\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Codul medicamentului\" formControlName=\"codMed\">\n              <mat-option *ngFor=\"let x of codMed\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"denumire\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"denumire\">\n          <label for=\"denumire\">Denumirea medicamentului\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"cantitateMed\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"cantitateMed\">\n          <label for=\"cantitateMed\">Cantitatea medicamentului\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Forma\" formControlName=\"forma\">\n              <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"row\">\n          <div class=\"col-9\">\n            <div class=\"md-form\">\n              <input id=\"doza\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"doza\">\n              <label for=\"doza\">Doza\n                <span class=\"text-danger\">*</span>\n              </label>\n            </div>\n          </div>\n          <div class=\"col-3\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Volum\" formControlName=\"volum1\">\n                  <mat-option *ngFor=\"let x of volum\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"seria\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"seria\">\n          <label for=\"seria\">Seria\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Substanta activa\" formControlName=\"subsActiva\">\n              <mat-option *ngFor=\"let x of subsActiva\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"row\">\n          <div class=\"col-9\">\n            <div class=\"md-form\">\n              <input id=\"cantSubsActive\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"cantSubsActive\">\n              <label for=\"cantSubsActive\">Cantitatea substanței active\n                <span class=\"text-danger\">*</span>\n              </label>\n            </div>\n          </div>\n          <div class=\"col-3\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Volum\" formControlName=\"volum2\">\n                  <mat-option *ngFor=\"let x of volum\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </form>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: CerereImportExportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CerereImportExportComponent", function() { return CerereImportExportComponent; });
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


var CerereImportExportComponent = /** @class */ (function () {
    function CerereImportExportComponent(fb) {
        this.fb = fb;
        this.cerere = [
            { denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.tipulAutorizarii = [
            { value: 'none', viewValue: '(None)' },
            { value: 'Import', viewValue: 'Import' },
            { value: 'Export', viewValue: 'Export' },
        ];
        this.tipMed = [
            { value: 'none', viewValue: '(None)' },
            { value: 'Precursor', viewValue: 'Precursor' },
            { value: 'Psihotrop', viewValue: 'Psihotrop' },
            { value: 'Stupefiant', viewValue: 'Stupefiant' },
        ];
        this.codMed = [
            { value: 'none', viewValue: '(None)' },
            { value: 'ANLGN', viewValue: 'ANLGN' },
            { value: 'CORVL', viewValue: 'CORVL' },
            { value: 'ASPIRIN', viewValue: 'ASPIRIN' },
            { value: 'VALIDOL', viewValue: 'VALIDOL' },
            { value: 'GRIPC', viewValue: 'GRIPC' },
        ];
        this.forma = [
            { value: 'none', viewValue: '(None)' },
            { value: 'Pulbere', viewValue: 'Pulbere' },
            { value: 'Drajeu', viewValue: 'Drajeu' },
        ];
        this.volum = [
            { value: 'none', viewValue: '(None)' },
            { value: 'mg', viewValue: 'mg' },
            { value: 'ui', viewValue: 'ui' },
        ];
        this.subsActiva = [
            { value: 'none', viewValue: '(None)' },
            { value: 'Mildonii', viewValue: 'Mildonii' },
            { value: 'Acid_acetilsalicilic', viewValue: 'Acid_acetilsalicilic' },
        ];
        this.zForm = fb.group({
            'dataReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'compSolicitant': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'tipulAutorizarii': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'tipMed': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'codMed': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumire': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'cantitateMed': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'forma': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'doza': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'volum1': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'seria': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'subsActiva': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'cantSubsActive': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'volum2': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    CerereImportExportComponent.prototype.ngOnInit = function () {
    };
    CerereImportExportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-cerere-import-export',
            template: __webpack_require__(/*! ./cerere-import-export.component.html */ "./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.html"),
            styles: [__webpack_require__(/*! ./cerere-import-export.component.css */ "./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], CerereImportExportComponent);
    return CerereImportExportComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.css":
/*!**********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Cerere de modificare a autorizarii de activitate cu precursori/psihotrope/stupefiante</h3>\n    <hr>\n    <table class=\"table table-widths text-center\">\n      <thead class=\"black white-text\">\n        <tr>\n          <th scope=\"col\">Denumire</th>\n          <th scope=\"col\">Format</th>\n          <th scope=\"col\">Data incarcarii</th>\n          <th scope=\"col\">Actiuni</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr *ngFor=\"let x of cerere\">\n          <th scope=\"row\">{{ x.denumirea }}</th>\n          <td>{{ x.format }}</td>\n          <td>{{ x.dataIncarcarii }}</td>\n          <td>\n            <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n            <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n    <div class=\"col position-button\">\n      <label for=\"incarcaFisier\" class=\"btn btn-indigo btn-sm\">\n        <input id=\"incarcaFisier\" type=\"file\" style=\"display:none;\"> Incarca Fisier\n      </label>\n    </div>\n    <form [formGroup]='zForm'>\n      <div class=\"row\">\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <input matInput [matDatepicker]=\"picker\" placeholder=\"Data inregistrarii\" required formControlName=\"dataReg\">\n              <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n              <mat-datepicker touchUi #picker></mat-datepicker>\n            </mat-form-field>\n          </div>\n        </div>\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <input id=\"nrReg\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"nrReg\">\n            <label for=\"nrReg\">Nr. de inregistrare a cererii\n              <span class=\"text-danger\">*</span>\n            </label>\n          </div>\n        </div>\n        <hr>\n        <div class=\"col-md-12\">\n          <div class=\"md-form\">\n            <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"compSolicitant\">\n            <label for=\"compSolicitant\">Compania-solicitant\n              <span class=\"text-danger\">*</span>\n            </label>\n          </div>\n        </div>\n      </div>\n      <div class=\"text-center\">\n        <button class=\"btn btn-primary btn-sm waves-light\" mdbWavesEffect>Adresa solicitantului <i class=\"fa fa-sort\" aria-hidden=\"true\"></i></button>\n      </div>\n        <div class=\"row\">\n          <div class=\"col-md-4\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Raion\">\n                  <mat-option *ngFor=\"let x of raion\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n          <div class=\"col-md-4\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Localitate\">\n                  <mat-option *ngFor=\"let x of localitate\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n          <div class=\"col-md-4\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Strada\">\n                  <mat-option *ngFor=\"let x of strada\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n          <div class=\"col-md-4\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Nr.\">\n                  <mat-option *ngFor=\"let x of nr\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n          <div class=\"col-md-4\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Bloc\">\n                  <mat-option *ngFor=\"let x of bloc\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n          <div class=\"col-md-4\">\n            <div class=\"md-form\">\n              <input id=\"oficiu\" mdbInputDirective type=\"text\" class=\"form-control\">\n              <label for=\"oficiu\">Oficiu\n                <span class=\"text-danger\">*</span>\n              </label>\n            </div>\n          </div>\n        </div>\n      <hr>\n      <h5 class=\"text-center font-weight-bold\">Persoana responsabila</h5>\n      <hr>\n      <div class=\"row\">\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"name\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"name\">\n            <label for=\"name\">Nume\n              <span class=\"text-danger\">*</span>\n            </label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"surname\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"surname\">\n            <label for=\"surname\">Prenume\n              <span class=\"text-danger\">*</span>\n            </label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"idnp\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"idnp\">\n            <label for=\"idnp\">IDNP\n              <span class=\"text-danger\">*</span>\n            </label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"cellphone\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"cellphone\">\n            <label for=\"cellphone\">Telefon mobil\n              <span class=\"text-danger\">*</span>\n            </label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"phoneFix\" mdbInputDirective type=\"text\" class=\"form-control\">\n            <label for=\"phoneFix\">Telefon fix</label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"email\" mdbInputDirective type=\"email\" class=\"form-control\" formControlName=\"email\">\n            <label for=\"email\">Email\n              <span class=\"text-danger\">*</span>\n            </label>\n          </div>\n        </div>\n      </div>\n      <hr>\n      <div class=\"row\">\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"Tipul medicamentului\" formControlName=\"tipMed\">\n                <mat-option *ngFor=\"let x of tipMed\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <input matInput [matDatepicker]=\"picker1\" placeholder=\"Data expirarii\" required formControlName=\"dataExp\">\n              <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>\n              <mat-datepicker touchUi #picker1></mat-datepicker>\n            </mat-form-field>\n          </div>\n        </div>\n      </div>\n    </form>\n    <hr>\n  </div>"

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: CerereModAutorActComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CerereModAutorActComponent", function() { return CerereModAutorActComponent; });
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


var CerereModAutorActComponent = /** @class */ (function () {
    function CerereModAutorActComponent(fb) {
        this.fb = fb;
        this.cerere = [
            { denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.raion = [
            { value: 'raion-1', viewValue: 'Raion 1' },
            { value: 'raion-2', viewValue: 'Raion 2' },
            { value: 'raion-3', viewValue: 'Raion 3' },
        ];
        this.localitate = [
            { value: 'localitate-1', viewValue: 'Localitate 1' },
            { value: 'localitate-2', viewValue: 'Localitate 2' },
            { value: 'localitate-3', viewValue: 'Localitate 3' },
        ];
        this.strada = [
            { value: 'strada-1', viewValue: 'Strada 1' },
            { value: 'strada-2', viewValue: 'Strada 2' },
            { value: 'strada-3', viewValue: 'Strada 3' },
        ];
        this.nr = [
            { value: 'nr-1', viewValue: 'Nr 1' },
            { value: 'nr-2', viewValue: 'Nr 2' },
            { value: 'nr-3', viewValue: 'Nr 3' },
        ];
        this.bloc = [
            { value: 'bloc-1', viewValue: 'Bloc 1' },
            { value: 'bloc-2', viewValue: 'Bloc 2' },
            { value: 'bloc-3', viewValue: 'Bloc 3' },
        ];
        this.tipMed = [
            { value: 'none', viewValue: '(None)' },
            { value: 'Precursor', viewValue: 'Precursor' },
            { value: 'Psihotrop', viewValue: 'Psihotrop' },
            { value: 'Stupefiant', viewValue: 'Stupefiant' },
        ];
        this.zForm = fb.group({
            'dataReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'compSolicitant': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'name': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'surname': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'idnp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'cellphone': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'email': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'tipMed': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'dataExp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    CerereModAutorActComponent.prototype.ngOnInit = function () {
    };
    CerereModAutorActComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-cerere-mod-autor-act',
            template: __webpack_require__(/*! ./cerere-mod-autor-act.component.html */ "./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.html"),
            styles: [__webpack_require__(/*! ./cerere-mod-autor-act.component.css */ "./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], CerereModAutorActComponent);
    return CerereModAutorActComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.css":
/*!******************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.css ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n\t<h3 class=\"text-center my-3 font-weight-bold\">Cerere de solicitare a autorizatiei de activitate cu precursori/psihotrope/stupefiante</h3>\n\t<hr>\n\t<table class=\"table table-widths text-center\">\n\t\t<thead class=\"black white-text\">\n\t\t<tr>\n\t\t\t<th scope=\"col\">Denumire</th>\n\t\t\t<th scope=\"col\">Format</th>\n\t\t\t<th scope=\"col\">Data incarcarii</th>\n\t\t\t<th scope=\"col\">Actiuni</th>\n\t\t</tr>\n\t\t</thead>\n\t\t<tbody>\n\t\t<tr *ngFor=\"let x of cerere\">\n\t\t\t<th scope=\"row\">{{ x.denumirea }}</th>\n\t\t\t<td>{{ x.format }}</td>\n\t\t\t<td>{{ x.dataIncarcarii }}</td>\n\t\t\t<td>\n\t\t\t\t<button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n\t\t\t\t<button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n\t\t\t</td>\n\t\t</tr>\n\t\t</tbody>\n\t</table>\n\t<div class=\"col position-button\">\n\t\t<label for=\"loadFile\" class=\"btn btn-indigo btn-sm\">\n\t\t\t<input id=\"loadFile\" type=\"file\" style=\"display:none;\"> Incarca Fisier\n\t\t</label>\n\t</div>\n\t<form [formGroup]='zForm'>\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<input matInput [matDatepicker]=\"picker\" placeholder=\"Data inregistrarii\" required formControlName=\"dataReg\">\n\t\t\t\t\t\t<mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n\t\t\t\t\t\t<mat-datepicker touchUi #picker></mat-datepicker>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"nrReg\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"nrReg\">\n\t\t\t\t\t<label for=\"nrReg\">Nr. de inregistrare a cererii\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<hr>\n\t\t\t<div class=\"col-md-12\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"compSolicitant\">\n\t\t\t\t\t<label for=\"compSolicitant\">Compania-solicitant\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"text-center\">\n\t\t\t<button class=\"btn btn-primary btn-sm waves-light\" mdbWavesEffect>Adresa solicitantului <i class=\"fa fa-sort\" aria-hidden=\"true\"></i></button>\n\t\t</div>\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<mat-select placeholder=\"Raion\">\n\t\t\t\t\t\t\t<mat-option *ngFor=\"let x of raion\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<mat-select placeholder=\"Localitate\">\n\t\t\t\t\t\t\t<mat-option *ngFor=\"let x of localitate\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<mat-select placeholder=\"Strada\">\n\t\t\t\t\t\t\t<mat-option *ngFor=\"let x of strada\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<mat-select placeholder=\"Nr.\">\n\t\t\t\t\t\t\t<mat-option *ngFor=\"let x of nr\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<mat-select placeholder=\"Bloc\">\n\t\t\t\t\t\t\t<mat-option *ngFor=\"let x of bloc\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"oficiu\" mdbInputDirective type=\"text\" class=\"form-control\">\n\t\t\t\t\t<label for=\"oficiu\">Oficiu\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<hr>\n\t\t<h5 class=\"text-center font-weight-bold\">Persoana responsabila</h5>\n\t\t<hr>\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"name\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"name\">\n\t\t\t\t\t<label for=\"name\">Nume\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"surname\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"surname\">\n\t\t\t\t\t<label for=\"surname\">Prenume\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"idnp\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"idnp\">\n\t\t\t\t\t<label for=\"idnp\">IDNP\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"cellphone\" mdbInputDirective type=\"text\" class=\"form-control\" required formControlName=\"cellphone\">\n\t\t\t\t\t<label for=\"cellphone\">Telefon mobil\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"phoneFix\" mdbInputDirective type=\"text\" class=\"form-control\">\n\t\t\t\t\t<label for=\"phoneFix\">Telefon fix</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<input id=\"email\" mdbInputDirective type=\"email\" class=\"form-control\" formControlName=\"email\">\n\t\t\t\t\t<label for=\"email\">Email\n\t\t\t\t\t\t<span class=\"text-danger\">*</span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<hr>\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<mat-select placeholder=\"Tipul medicamentului\" formControlName=\"tipMed\">\n\t\t\t\t\t\t\t<mat-option *ngFor=\"let x of tipMed\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<div class=\"md-form\">\n\t\t\t\t\t<mat-form-field class=\"w-100\">\n\t\t\t\t\t\t<input matInput [matDatepicker]=\"picker1\" placeholder=\"Data expirarii\" required formControlName=\"dataExp\">\n\t\t\t\t\t\t<mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>\n\t\t\t\t\t\t<mat-datepicker touchUi #picker1></mat-datepicker>\n\t\t\t\t\t</mat-form-field>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n\t<hr>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: CerereSolicAutorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CerereSolicAutorComponent", function() { return CerereSolicAutorComponent; });
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


var CerereSolicAutorComponent = /** @class */ (function () {
    function CerereSolicAutorComponent(fb) {
        this.fb = fb;
        this.cerere = [
            { denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.raion = [
            { value: 'raion-1', viewValue: 'Raion 1' },
            { value: 'raion-2', viewValue: 'Raion 2' },
            { value: 'raion-3', viewValue: 'Raion 3' },
        ];
        this.localitate = [
            { value: 'localitate-1', viewValue: 'Localitate 1' },
            { value: 'localitate-2', viewValue: 'Localitate 2' },
            { value: 'localitate-3', viewValue: 'Localitate 3' },
        ];
        this.strada = [
            { value: 'strada-1', viewValue: 'Strada 1' },
            { value: 'strada-2', viewValue: 'Strada 2' },
            { value: 'strada-3', viewValue: 'Strada 3' },
        ];
        this.nr = [
            { value: 'nr-1', viewValue: 'Nr 1' },
            { value: 'nr-2', viewValue: 'Nr 2' },
            { value: 'nr-3', viewValue: 'Nr 3' },
        ];
        this.bloc = [
            { value: 'bloc-1', viewValue: 'Bloc 1' },
            { value: 'bloc-2', viewValue: 'Bloc 2' },
            { value: 'bloc-3', viewValue: 'Bloc 3' },
        ];
        this.tipMed = [
            { value: 'none', viewValue: '(None)' },
            { value: 'Precursor', viewValue: 'Precursor' },
            { value: 'Psihotrop', viewValue: 'Psihotrop' },
            { value: 'Stupefiant', viewValue: 'Stupefiant' },
        ];
        this.zForm = fb.group({
            'dataReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'compSolicitant': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'name': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'surname': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'idnp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'cellphone': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'email': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'tipMed': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'dataExp': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    CerereSolicAutorComponent.prototype.ngOnInit = function () {
    };
    CerereSolicAutorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-cerere-solic-autor',
            template: __webpack_require__(/*! ./cerere-solic-autor.component.html */ "./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.html"),
            styles: [__webpack_require__(/*! ./cerere-solic-autor.component.css */ "./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], CerereSolicAutorComponent);
    return CerereSolicAutorComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-7/drug-control-routing.module.ts":
/*!*********************************************************************!*\
  !*** ./src/app/all-modules/module-7/drug-control-routing.module.ts ***!
  \*********************************************************************/
/*! exports provided: DrugControlRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugControlRoutingModule", function() { return DrugControlRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _cerere_solic_autor_cerere_solic_autor_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cerere-solic-autor/cerere-solic-autor.component */ "./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.ts");
/* harmony import */ var _cerere_mod_autor_act_cerere_mod_autor_act_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cerere-mod-autor-act/cerere-mod-autor-act.component */ "./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.ts");
/* harmony import */ var _cerere_import_export_cerere_import_export_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cerere-import-export/cerere-import-export.component */ "./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.ts");
/* harmony import */ var _cerere_dub_autor_act_cerere_dub_autor_act_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cerere-dub-autor-act/cerere-dub-autor-act.component */ "./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.ts");
/* harmony import */ var _reg_drug_control_reg_drug_control__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reg-drug-control/reg-drug-control */ "./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var routes = [
    { path: 'activity-authorization', component: _cerere_solic_autor_cerere_solic_autor_component__WEBPACK_IMPORTED_MODULE_2__["CerereSolicAutorComponent"] },
    { path: 'transfer-authorization', component: _cerere_import_export_cerere_import_export_component__WEBPACK_IMPORTED_MODULE_4__["CerereImportExportComponent"] },
    { path: 'modify-authority', component: _cerere_mod_autor_act_cerere_mod_autor_act_component__WEBPACK_IMPORTED_MODULE_3__["CerereModAutorActComponent"] },
    { path: 'duplicate-authority', component: _cerere_dub_autor_act_cerere_dub_autor_act_component__WEBPACK_IMPORTED_MODULE_5__["CerereDubAutorActComponent"] },
    { path: 'reg-drug-control', component: _reg_drug_control_reg_drug_control__WEBPACK_IMPORTED_MODULE_6__["RegDrugControl"] },
];
var DrugControlRoutingModule = /** @class */ (function () {
    function DrugControlRoutingModule() {
    }
    DrugControlRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], DrugControlRoutingModule);
    return DrugControlRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-7/drug-control.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/all-modules/module-7/drug-control.module.ts ***!
  \*************************************************************/
/*! exports provided: DrugControlModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugControlModule", function() { return DrugControlModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _drug_control_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drug-control-routing.module */ "./src/app/all-modules/module-7/drug-control-routing.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _cerere_solic_autor_cerere_solic_autor_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cerere-solic-autor/cerere-solic-autor.component */ "./src/app/all-modules/module-7/cerere-solic-autor/cerere-solic-autor.component.ts");
/* harmony import */ var _cerere_mod_autor_act_cerere_mod_autor_act_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cerere-mod-autor-act/cerere-mod-autor-act.component */ "./src/app/all-modules/module-7/cerere-mod-autor-act/cerere-mod-autor-act.component.ts");
/* harmony import */ var _cerere_import_export_cerere_import_export_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./cerere-import-export/cerere-import-export.component */ "./src/app/all-modules/module-7/cerere-import-export/cerere-import-export.component.ts");
/* harmony import */ var _cerere_dub_autor_act_cerere_dub_autor_act_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./cerere-dub-autor-act/cerere-dub-autor-act.component */ "./src/app/all-modules/module-7/cerere-dub-autor-act/cerere-dub-autor-act.component.ts");
/* harmony import */ var _reg_drug_control_reg_drug_control__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./reg-drug-control/reg-drug-control */ "./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var DrugControlModule = /** @class */ (function () {
    function DrugControlModule() {
    }
    DrugControlModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _drug_control_routing_module__WEBPACK_IMPORTED_MODULE_2__["DrugControlRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_5__["MaterialSharedModule"].forRoot(),
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__["CollapseModule"]
            ],
            declarations: [_cerere_dub_autor_act_cerere_dub_autor_act_component__WEBPACK_IMPORTED_MODULE_9__["CerereDubAutorActComponent"], _cerere_import_export_cerere_import_export_component__WEBPACK_IMPORTED_MODULE_8__["CerereImportExportComponent"], _cerere_mod_autor_act_cerere_mod_autor_act_component__WEBPACK_IMPORTED_MODULE_7__["CerereModAutorActComponent"], _cerere_solic_autor_cerere_solic_autor_component__WEBPACK_IMPORTED_MODULE_6__["CerereSolicAutorComponent"], _reg_drug_control_reg_drug_control__WEBPACK_IMPORTED_MODULE_10__["RegDrugControl"]]
        })
    ], DrugControlModule);
    return DrugControlModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.css":
/*!****************************************************************************!*\
  !*** ./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-forms {\r\n    position: relative;\r\n    margin-top: 1.5rem;\r\n    margin-bottom: 1.5rem;\r\n}\r\n\r\nlabel.required:not(:empty):after,\r\n.field-header.required:after {\r\n    content: \" *\";\r\n    color: red;\r\n    position: absolute;\r\n    right: 0px;\r\n    top: -15px;\r\n}\r\n\r\n.mt-4s {\r\n    padding-top: 45px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.html":
/*!*****************************************************************************!*\
  !*** ./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Inregistrare cerere</h3>\n  <hr>\n  <div class=\"container\">\n    <form [formGroup]='dataForm'>\n      <div class=\"row\">\n        <div class=\"col-lg-5\">\n          <div class=\"md-form\">\n            <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"nrCererii\" [attr.disabled]=\"true\">\n            <label for=\"nrCererii\">Nr. cererii</label>\n          </div>\n        </div>\n\n        <div class=\"col-lg-4\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" formControlName=\"data\">\n              <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n              <mat-datepicker touchUi #picker></mat-datepicker>\n            </mat-form-field>\n          </div>\n        </div>\n        <div class=\"col-lg-3 position-button mt-4s\">\n          <label class=\"btn btn-indigo btn-sm\" for=\"incarcaraFisier\">\n            <input id=\"incarcaraFisier\" type=\"file\" style=\"display:none;\" (change)=\"onChange($event)\" onclick=\"this.value=null;\"> Incarca Cerere\n          </label>\n        </div>\n      </div>\n    </form>\n  </div>\n  <hr>\n  <table class=\"table table-widths text-center\">\n    <thead class=\"black white-text\">\n    <tr>\n      <th scope=\"col\">Denumire</th>\n      <th scope=\"col\">Format</th>\n      <th scope=\"col\">Data incarcarii</th>\n      <th scope=\"col\">Actiuni</th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let x of cereri; let i = index\">\n      <th scope=\"row\">{{ x.denumirea }}</th>\n      <td>{{ x.format }}</td>\n      <td>{{ x.dataIncarcarii }}</td>\n      <td>\n        <button class=\"btn btn-mdb-color btn-sm waves-light\" (click)=\"loadFile()\" mdbWavesEffect>Vizualizare</button>\n        <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" (click)=\"removeDocument(i)\" mdbWavesEffect>Stergere</button>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <hr>\n  <form [formGroup]='rForm'>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-forms\">\n          <mat-form-field class=\"w-100\">\n            <mat-label>Compania solicitant <span class=\"text-danger\">*</span></mat-label>\n            <input type=\"text\" aria-label=\"Number\" [formControl]=\"rForm.controls['compGet']\"\n                   matInput formControlName=\"compGet\" [matAutocomplete]=\"auto\" (ngModelChange)=\"checkCompanyValue()\">\n            <mat-autocomplete #auto=\"matAutocomplete\" [displayWith]=\"displayFn\">\n              <mat-option *ngFor=\"let x of filteredOptions | async\" [value]=\"x\">\n                {{x.name}}\n              </mat-option>\n            </mat-autocomplete>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"med\">\n          <label for=\"med\">Medicamentul\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"text-center w-100 mt-3\">\n        <div class=\"alert alert-primary\">\n          <span>Nr. de inregistrare a cererii: </span>\n          <strong>{{generatedDocNrSeq}}</strong>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"text-center\">\n      <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect (click)=\"nextStep()\">Urmatorul pas</button>\n    </div>\n  </form>\n</div>\n\n\n"

/***/ }),

/***/ "./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.ts":
/*!***************************************************************************!*\
  !*** ./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.ts ***!
  \***************************************************************************/
/*! exports provided: RegDrugControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegDrugControl", function() { return RegDrugControl; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_service_administration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../shared/service/administration.service */ "./src/app/shared/service/administration.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../confirmation-dialog/confirmation-dialog.component */ "./src/app/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_7__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var RegDrugControl = /** @class */ (function () {
    function RegDrugControl(fb, dialog, router, administrationService) {
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
    RegDrugControl.prototype.ngOnInit = function () {
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
    RegDrugControl.prototype.displayFn = function (user) {
        return user ? user.name : undefined;
    };
    RegDrugControl.prototype.onChange = function (event) {
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
    RegDrugControl.prototype.removeDocument = function (index) {
        var _this = this;
        var dialogRef = this.dialog.open(_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_6__["ConfirmationDialogComponent"], {
            data: { message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.cereri.splice(index, 1);
            }
        });
    };
    RegDrugControl.prototype.loadFile = function () {
        Object(file_saver__WEBPACK_IMPORTED_MODULE_7__["saveAs"])(this.file, this.file.name);
    };
    RegDrugControl.prototype.chekCompanyValue = function () {
        var _this = this;
        this.isWrongValueCompany = !this.companii.some(function (elem) {
            return _this.rForm.get('compGet').value == null ? true : elem.name === _this.rForm.get('compGet').value.name;
        });
    };
    RegDrugControl.prototype.nextStep = function () {
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
    RegDrugControl.prototype._filter = function (name) {
        var filterValue = name.toLowerCase();
        return this.companii.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    RegDrugControl.prototype.saveToFileSystem = function (response, docName) {
        var blob = new Blob([response]);
        Object(file_saver__WEBPACK_IMPORTED_MODULE_7__["saveAs"])(blob, docName);
    };
    RegDrugControl = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-reg-drug-control',
            template: __webpack_require__(/*! ./reg-drug-control.html */ "./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.html"),
            styles: [__webpack_require__(/*! ./reg-drug-control.css */ "./src/app/all-modules/module-7/reg-drug-control/reg-drug-control.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _shared_service_administration_service__WEBPACK_IMPORTED_MODULE_4__["AdministrationService"]])
    ], RegDrugControl);
    return RegDrugControl;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-7-drug-control-module.js.map