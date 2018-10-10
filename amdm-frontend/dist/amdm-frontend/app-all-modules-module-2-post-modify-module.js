(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-2-post-modify-module"],{

/***/ "./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.css":
/*!****************************************************************************************!*\
  !*** ./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.css ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Aprobarea modificărilor postautorizare</h3>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Ordin de întrerupere înregistrarii</h5>\n  <hr>\n  <form [formGroup]='dataForm'>\n      <div class=\"row\">\n          <div class=\"col-lg-5\">\n              <div class=\"md-form\">\n                  <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\"\n                         formControlName=\"nrCererii\" [attr.disabled]=\"true\">\n                  <label for=\"nrCererii\">Nr. cererii</label>\n              </div>\n          </div>\n\n          <div class=\"col-lg-5\">\n              <div class=\"md-form-modified\">\n                  <mat-form-field class=\"w-100\">\n                      <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" formControlName=\"data\">\n                      <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n                      <mat-datepicker touchUi #picker></mat-datepicker>\n                  </mat-form-field>\n              </div>\n          </div>\n          <div class=\"col-lg-2 position-button mt-3\">\n              <label class=\"btn btn-indigo btn-sm\" for=\"incarcaraFisier\">\n                  <input id=\"incarcaraFisier\" type=\"file\" style=\"display:none;\" (change)=\"onChange($event)\"\n                         onclick=\"this.value=null;\"> Incarca Cerere\n              </label>\n          </div>\n      </div>\n  </form>\n<hr>\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th>Format</th>\n        <th>Data incarcarii</th>\n        <th>Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let a of aprob\">\n        <th scope=\"row\">{{ a.denumire }}</th>\n        <td>{{ a.format }}</td>\n        <td>{{ a.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <form [formGroup]='zForm'>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Compania-solicitant\">\n              <mat-option *ngFor=\"let x of compSolicitant\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"nrRegMed\" class=\"form-control\">\n          <label for=\"nrRegMed\">Nr. de înregistrare a medicamentului</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Tipul(rile) modificărilor postautorizare\">\n              <mat-option *ngFor=\"let x of tipPost\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"nameComerc\" class=\"form-control\" disabled value=\"Valiexchimp\">\n          <label for=\"nameComerc\">Denumirea comercială</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"nameIntern\" class=\"form-control\" disabled value=\"Valiexchimp 2\">\n          <label for=\"nameIntern\">Denumirea comună internaționala</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"codATC\" class=\"form-control\" disabled value=\"CD12345\">\n          <label for=\"codATC\">Codul ATC</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Forma farmaceutica\">\n              <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Aprobarea a modificărilor postautorizare</h5>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"nrOrd1\" class=\"form-control\">\n          <label for=\"nrOrd1\">Nr. ordinului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker2></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Intreruperea a procedurii</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"nrOrd2\" class=\"form-control\">\n          <label for=\"nrOrd2\">Nr. ordinului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker3></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"md-form\">\n          <textarea type=\"text\" id=\"motivCancelProd\" class=\"md-textarea form-control\" mdbInputDirective></textarea>\n          <label for=\"motivCancelProd\" for=\"form7\">Motivul întreruperii procedurii</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"nrScrisorii\" class=\"form-control\">\n          <label for=\"nrScrisorii\">Nr. scrisorii</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker4\" placeholder=\"Data scrisorii\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker4\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker4></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"titlulScrisorii\" class=\"form-control\">\n          <label for=\"titlulScrisorii\">Titlul scrisorii</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Deținătorului certificatului de înregistrare</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"name\" class=\"form-control\">\n          <label for=\"name\">Denumirea</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Ţara\">\n              <mat-option *ngFor=\"let x of tara\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"adressJur\" class=\"form-control\">\n          <label for=\"adressJur\">Adresa juridică</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Producătorului substanţei active</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"denuSubsActive\" class=\"form-control\">\n          <label for=\"denuSubsActive\">Denumirea</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Ţara\">\n              <mat-option *ngFor=\"let x of tara\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"adresJurSubsAct\" class=\"form-control\">\n          <label for=\"adresJurSubsAct\">Adresa juridică</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Producătorului produsului finit</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"denuProdFinish\" class=\"form-control\">\n          <label for=\"denuProdFinish\">Denumirea</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Ţara\">\n              <mat-option *ngFor=\"let x of tara\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input mdbInputDirective type=\"text\" id=\"adressJurProdFinish\" class=\"form-control\">\n          <label for=\"adressJurProdFinish\">Adresa juridică</label>\n        </div>\n      </div>\n    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" routerLink=\"/doc/analyze\" mdbWavesEffect>Macheta grafică</button>\n      <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" routerLink=\"/drugs/cancel\" mdbWavesEffect>Rezumatul caracteristicilor produsului</button>\n      <button class=\"btn btn-mdb-color waves-light btn-sm waves-light\" routerLink=\"/drugs/cancel\" mdbWavesEffect>Prospectul pentru utilizator</button>\n    </div>\n  </form>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.ts ***!
  \***************************************************************************************/
/*! exports provided: AprobModifyPostComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AprobModifyPostComponent", function() { return AprobModifyPostComponent; });
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


var AprobModifyPostComponent = /** @class */ (function () {
    function AprobModifyPostComponent(fb) {
        this.fb = fb;
        this.aprob = [
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumire: 'Test', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
        ];
        this.compSolicitant = [
            { value: 'companie-1', viewValue: 'Companie Solicitanta 1' },
            { value: 'companie-2', viewValue: 'Companie Solicitanta 2' },
            { value: 'companie-3', viewValue: 'Companie Solicitanta 3' },
            { value: 'companie-4', viewValue: 'Companie Solicitanta 4' },
        ];
        this.tipPost = [
            { value: 'tip-1', viewValue: 'Tipul 1' },
            { value: 'tip-2', viewValue: 'Tipul 2' },
            { value: 'tip-3', viewValue: 'Tipul 3' },
            { value: 'tip-4', viewValue: 'Tipul 4' },
            { value: 'tip-5', viewValue: 'Tipul 5' },
            { value: 'tip-6', viewValue: 'Tipul 6' },
        ];
        this.forma = [
            { value: 'forma-1', viewValue: 'Forma 1' },
            { value: 'forma-2', viewValue: 'Forma 2' },
            { value: 'forma-3', viewValue: 'Forma 3' },
            { value: 'forma-4', viewValue: 'Forma 4' },
        ];
        this.tara = [
            { value: 'tara-1', viewValue: 'Tara 1' },
            { value: 'tara-2', viewValue: 'Tara 2' },
            { value: 'tara-3', viewValue: 'Tara 3' },
            { value: 'tara-4', viewValue: 'Tara 4' },
        ];
        this.document = [
            { denumirea: 'Bonurile de plată', statut: 'Generat' },
            { denumirea: 'Dispoziția de distribuire', statut: 'Generat' },
            { denumirea: 'Scrisoare de solicitare a informației', statut: 'Generat' },
            { denumirea: 'Ordinul de aprobare a modificărilor postautorizare', statut: 'Generat' },
            { denumirea: 'Ordin de întrerupere a procedurii de aprobare a modificărilor postautorizare', statut: 'Generat' },
            { denumirea: 'Modificarea la Certificatul de autorizare a medicamentului', statut: 'Generat' },
            { denumirea: 'Raportul pentru Comisia Medicamentului', statut: 'Generat' },
            { denumirea: 'Funcția de raportare flexibilă', statut: 'Generat' },
        ];
        this.zForm = fb.group({
            'dataReg': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'numarCerere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'companiaSolicitant': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrRegMed': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireComerciala': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireInternationala': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'codulAtc': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'formaFarmaceutica': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'tipulModPost': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrOrdAprob': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'dataOrdAprob': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrOrdIntrerupere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'dataOrdIntrerupere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'motivulIntrerupere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireDetinCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'taraDetinCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'raionCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'localitateCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'stradaCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'blocCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'numarCert': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'taraProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'raionProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'localitateProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'stradaProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'blocProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'numarProdSubsActiv': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'taraProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'raionProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'localitateProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'stradaProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nrProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'blocProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'numarProdFinit': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
        this.dataForm = fb.group({
            'data': { disabled: true, value: null },
            'nrCererii': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
    }
    AprobModifyPostComponent.prototype.ngOnInit = function () {
    };
    AprobModifyPostComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-aprob-modify-post',
            template: __webpack_require__(/*! ./aprob-modify-post.component.html */ "./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.html"),
            styles: [__webpack_require__(/*! ./aprob-modify-post.component.css */ "./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], AprobModifyPostComponent);
    return AprobModifyPostComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-2/post-modify-routing.module.ts":
/*!********************************************************************!*\
  !*** ./src/app/all-modules/module-2/post-modify-routing.module.ts ***!
  \********************************************************************/
/*! exports provided: PostModifyRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostModifyRoutingModule", function() { return PostModifyRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _aprob_modify_post_aprob_modify_post_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./aprob-modify-post/aprob-modify-post.component */ "./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.ts");
/* harmony import */ var _reg_modify_cerere_reg_modify_cerere_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reg-modify-cerere/reg-modify-cerere.component */ "./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    { path: 'register', component: _reg_modify_cerere_reg_modify_cerere_component__WEBPACK_IMPORTED_MODULE_3__["RegModifyCerereComponent"] },
    { path: 'modify', component: _aprob_modify_post_aprob_modify_post_component__WEBPACK_IMPORTED_MODULE_2__["AprobModifyPostComponent"] },
];
var PostModifyRoutingModule = /** @class */ (function () {
    function PostModifyRoutingModule() {
    }
    PostModifyRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], PostModifyRoutingModule);
    return PostModifyRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-2/post-modify.module.ts":
/*!************************************************************!*\
  !*** ./src/app/all-modules/module-2/post-modify.module.ts ***!
  \************************************************************/
/*! exports provided: PostModifyModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostModifyModule", function() { return PostModifyModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _post_modify_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./post-modify-routing.module */ "./src/app/all-modules/module-2/post-modify-routing.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _aprob_modify_post_aprob_modify_post_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./aprob-modify-post/aprob-modify-post.component */ "./src/app/all-modules/module-2/aprob-modify-post/aprob-modify-post.component.ts");
/* harmony import */ var _reg_modify_cerere_reg_modify_cerere_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reg-modify-cerere/reg-modify-cerere.component */ "./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var PostModifyModule = /** @class */ (function () {
    function PostModifyModule() {
    }
    PostModifyModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _post_modify_routing_module__WEBPACK_IMPORTED_MODULE_2__["PostModifyRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_5__["MaterialSharedModule"].forRoot(),
            ],
            declarations: [_aprob_modify_post_aprob_modify_post_component__WEBPACK_IMPORTED_MODULE_6__["AprobModifyPostComponent"], _reg_modify_cerere_reg_modify_cerere_component__WEBPACK_IMPORTED_MODULE_7__["RegModifyCerereComponent"]]
        })
    ], PostModifyModule);
    return PostModifyModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.css":
/*!****************************************************************************************!*\
  !*** ./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.css ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-forms {\r\n    position: relative;\r\n    margin-top: 1.5rem;\r\n    margin-bottom: 1.5rem;\r\n}\r\n\r\nlabel.required:not(:empty):after,\r\n.field-header.required:after {\r\n    content: \" *\";\r\n    color: red;\r\n    position: absolute;\r\n    right: 0px;\r\n    top: -15px;\r\n}\r\n\r\n.mt-4s {\r\n    padding-top: 45px;\r\n}\r\n\r\n.md-form-modified {\r\n    position: relative;\r\n    margin-top: 10px;\r\n    margin-bottom: 1.5rem;\r\n  }"

/***/ }),

/***/ "./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Inregistrare cerere</h3>\n  <hr>\n    <form [formGroup]='dataForm'>\n      <div class=\"row\">\n        <div class=\"col-lg-5\">\n          <div class=\"md-form\">\n            <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"nrCererii\" [attr.disabled]=\"true\">\n            <label for=\"nrCererii\">Nr. cererii</label>\n          </div>\n        </div>\n\n        <div class=\"col-lg-5\">\n          <div class=\"md-form-modified\">\n            <mat-form-field class=\"w-100\">\n              <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" formControlName=\"data\">\n              <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n              <mat-datepicker touchUi #picker></mat-datepicker>\n            </mat-form-field>\n          </div>\n        </div>\n        <div class=\"col-lg-2 position-button mt-3\">\n          <label class=\"btn btn-indigo btn-sm\" for=\"incarcaraFisier\">\n            <input id=\"incarcaraFisier\" type=\"file\" style=\"display:none;\" (change)=\"onChange($event)\" onclick=\"this.value=null;\"> Incarca Cerere\n          </label>\n        </div>\n      </div>\n    </form>\n  <hr>\n  <table class=\"table table-widths text-center\">\n    <thead class=\"black white-text\">\n    <tr>\n      <th scope=\"col\">Denumire</th>\n      <th scope=\"col\">Format</th>\n      <th scope=\"col\">Data incarcarii</th>\n      <th scope=\"col\">Actiuni</th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let x of cereri; let i = index\">\n      <th scope=\"row\">{{ x.denumirea }}</th>\n      <td>{{ x.format }}</td>\n      <td>{{ x.dataIncarcarii }}</td>\n      <td>\n        <button class=\"btn btn-mdb-color btn-sm waves-light\" (click)=\"loadFile()\" mdbWavesEffect>Vizualizare</button>\n        <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" (click)=\"removeDocument(i)\" mdbWavesEffect>Stergere</button>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <hr>\n  <form [formGroup]='rForm'>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-label>Compania solicitant <span class=\"text-danger\">*</span></mat-label>\n            <input type=\"text\" aria-label=\"Number\" [formControl]=\"rForm.controls['compGet']\"\n                   matInput formControlName=\"compGet\" [matAutocomplete]=\"auto\" (ngModelChange)=\"checkCompanyValue()\">\n            <mat-autocomplete #auto=\"matAutocomplete\" [displayWith]=\"displayFn\">\n              <mat-option *ngFor=\"let x of filteredOptions | async\" [value]=\"x\">\n                {{x.name}}\n              </mat-option>\n            </mat-autocomplete>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"med\">\n          <label for=\"med\">Medicamentul\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"text-center w-100 mt-3\">\n        <div class=\"alert alert-primary\">\n          <span>Nr. de inregistrare a cererii: </span>\n          <strong>{{generatedDocNrSeq}}</strong>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"text-center\">\n      <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect (click)=\"nextStep()\">Urmatorul pas</button>\n    </div>\n  </form>\n</div>\n\n\n"

/***/ }),

/***/ "./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.ts ***!
  \***************************************************************************************/
/*! exports provided: RegModifyCerereComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegModifyCerereComponent", function() { return RegModifyCerereComponent; });
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








var RegModifyCerereComponent = /** @class */ (function () {
    function RegModifyCerereComponent(fb, dialog, router, administrationService) {
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
    RegModifyCerereComponent.prototype.ngOnInit = function () {
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
    RegModifyCerereComponent.prototype.displayFn = function (user) {
        return user ? user.name : undefined;
    };
    RegModifyCerereComponent.prototype.onChange = function (event) {
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
    RegModifyCerereComponent.prototype.removeDocument = function (index) {
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
    RegModifyCerereComponent.prototype.loadFile = function () {
        Object(file_saver__WEBPACK_IMPORTED_MODULE_7__["saveAs"])(this.file, this.file.name);
    };
    RegModifyCerereComponent.prototype.chekCompanyValue = function () {
        var _this = this;
        this.isWrongValueCompany = !this.companii.some(function (elem) {
            return _this.rForm.get('compGet').value == null ? true : elem.name === _this.rForm.get('compGet').value.name;
        });
    };
    RegModifyCerereComponent.prototype.nextStep = function () {
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
    RegModifyCerereComponent.prototype._filter = function (name) {
        var filterValue = name.toLowerCase();
        return this.companii.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    RegModifyCerereComponent.prototype.saveToFileSystem = function (response, docName) {
        var blob = new Blob([response]);
        Object(file_saver__WEBPACK_IMPORTED_MODULE_7__["saveAs"])(blob, docName);
    };
    RegModifyCerereComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-reg-modify-cerere',
            template: __webpack_require__(/*! ./reg-modify-cerere.component.html */ "./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.html"),
            styles: [__webpack_require__(/*! ./reg-modify-cerere.component.css */ "./src/app/all-modules/module-2/reg-modify-cerere/reg-modify-cerere.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _shared_service_administration_service__WEBPACK_IMPORTED_MODULE_4__["AdministrationService"]])
    ], RegModifyCerereComponent);
    return RegModifyCerereComponent;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-2-post-modify-module.js.map