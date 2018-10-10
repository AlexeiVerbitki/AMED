(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-8-medicament-destruction-module"],{

/***/ "./src/app/all-modules/module-8/add-member/add-member.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/all-modules/module-8/add-member/add-member.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/add-member/add-member.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/all-modules/module-8/add-member/add-member.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Adaugarea membrului in lista comisiei pentru nimicirea medicamentelor</h3>\n  <hr>\n  <form [formGroup]='zForm'>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Institutia\" formControlName=\"institutia\">\n              <mat-option *ngFor=\"let x of institut\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input mdbInputDirective ttype=\"text\" id=\"nume\" class=\"form-control\" formControlName=\"nume\">\n          <label for=\"\">Nume</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input mdbInputDirective ttype=\"text\" id=\"prenume\" class=\"form-control\" formControlName=\"prenume\">\n          <label for=\"\">Prenume</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Functia\" formControlName=\"functia\">\n              <mat-option *ngFor=\"let y of functia\" [value]=\"y.value\">{{ y.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"text-center\">\n      <button type=\"submit\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect [disabled]=\"!zForm.valid\"\n        (click)=\"addForm()\">Adaugare</button>\n      <button type=\"button\" class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect (click)=\"cancel()\">Anulare</button>\n    </div>\n  </form>\n</div>\n\n\n<div class=\"alerts-position\">\n  <div *ngIf=\"zForm.controls['institutia'].touched && !zForm.controls['institutia'].valid\">\n    <div *ngIf=\"!zForm.controls['institutia'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n      role=\"alert\">\n      In campul\n      <strong>Institutia</strong> este necesar de accesat date\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n  </div>\n  <div *ngIf=\"zForm.controls['nume'].touched && !zForm.controls['nume'].valid\">\n    <div *ngIf=\"!zForm.controls['nume'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n      role=\"alert\">\n      In campul\n      <strong>Nume</strong> este necesar de introdus date\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n  </div>\n  <div *ngIf=\"zForm.controls['prenume'].touched && !zForm.controls['prenume'].valid\">\n    <div *ngIf=\"!zForm.controls['prenume'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n      role=\"alert\">\n      In campul\n      <strong>Prenume</strong> este necesar de introdus date\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n  </div>\n  <div *ngIf=\"zForm.controls['functia'].touched && !zForm.controls['functia'].valid\">\n    <div *ngIf=\"!zForm.controls['functia'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n      role=\"alert\">\n      In campul\n      <strong>Functia</strong> este necesar de accesat date\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/add-member/add-member.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/all-modules/module-8/add-member/add-member.component.ts ***!
  \*************************************************************************/
/*! exports provided: AddMemberComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddMemberComponent", function() { return AddMemberComponent; });
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


var AddMemberComponent = /** @class */ (function () {
    function AddMemberComponent(fb) {
        this.fb = fb;
        this.institut = [
            { value: 'none-0', viewValue: '(None)' },
            { value: 'agentia-1', viewValue: 'Agentia Municipala Ecologica' },
            { value: 'centrul-2', viewValue: 'Centrul National Stiintifico-Practic de Medicina Preventiva' }
        ];
        this.functia = [
            { value: 'none-0', viewValue: '(None)' },
            { value: 'doctor-1', viewValue: 'Doctor' },
            { value: 'prof-univ-2', viewValue: 'Prof. Univ.' },
            { value: 'conferentiar-2', viewValue: 'Conferentiar' }
        ];
        this.zForm = fb.group({
            'institutia': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'nume': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'prenume': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'functia': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
    }
    AddMemberComponent.prototype.ngOnInit = function () {
    };
    AddMemberComponent.prototype.addForm = function () {
        console.log(this.zForm.value);
        this.zForm.reset();
    };
    AddMemberComponent.prototype.cancel = function () {
        this.zForm.reset();
    };
    AddMemberComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-member',
            template: __webpack_require__(/*! ./add-member.component.html */ "./src/app/all-modules/module-8/add-member/add-member.component.html"),
            styles: [__webpack_require__(/*! ./add-member.component.css */ "./src/app/all-modules/module-8/add-member/add-member.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], AddMemberComponent);
    return AddMemberComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.css":
/*!**********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-form {\r\n  margin-top: 20px;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Adaugare cauza inutilitate pentru medicamente</h3>\n  <hr>\n  <form [formGroup]='aForm'>\n<div class=\"mb-5\">\n    <div class=\"md-form\">\n        <input id=\"cod\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"cod\">\n        <label for=\"cod\">Cod\n          <strong class=\"text-danger\">*</strong>\n        </label>\n      </div>\n</div>\n<div class=\"mb-5\">\n    <div class=\"md-form\">\n        <input id=\"denumireaCauzei\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"denumireaCauzei\">\n        <label for=\"denumireaCauzei\">Denumirea cauzei\n          <strong class=\"text-danger\">*</strong>\n        </label>\n      </div>\n</div>\n<div class=\"mb-5\">\n    <div class=\"md-form\">\n        <input id=\"descriere\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"descriere\">\n        <label for=\"descriere\">Descriere\n          <strong class=\"text-danger\">*</strong>\n        </label>\n      </div>\n</div>\n  </form>\n  <div class=\"text-center\">\n    <button type=\"submit\" [disabled]=\"!aForm.valid\" (click)=\"addForm()\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adaugare</button>\n    <button type=\"button\" class=\"btn btn-danger btn-sm waves-light\" mdbWavesEffect (click)=\"cancel()\">Anulare</button>\n  </div>\n</div>\n\n\n<div class=\"alerts-position\">\n  <div *ngIf=\"aForm.controls['cod'].touched && !aForm.controls['cod'].valid\">\n    <div *ngIf=\"!aForm.controls['cod'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\" role=\"alert\">\n      In campul\n      <strong>cod</strong> este necesar de introdus date\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n  </div>\n  <div *ngIf=\"aForm.controls['denumireaCauzei'].touched && !aForm.controls['denumireaCauzei'].valid\">\n    <div *ngIf=\"!aForm.controls['denumireaCauzei'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n      role=\"alert\">\n      In campul\n      <strong>Denumirea cauzei</strong> este necesar de introdus date\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n  </div>\n  <div *ngIf=\"aForm.controls['descriere'].touched && !aForm.controls['descriere'].valid\">\n    <div *ngIf=\"!aForm.controls['descriere'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n      role=\"alert\">\n      In campul\n      <strong>descriere</strong> este necesar de introdus date\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: DrugsCauseFutilityComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsCauseFutilityComponent", function() { return DrugsCauseFutilityComponent; });
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


var DrugsCauseFutilityComponent = /** @class */ (function () {
    function DrugsCauseFutilityComponent(fb) {
        this.fb = fb;
        this.aForm = fb.group({
            'cod': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireaCauzei': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'descriere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    DrugsCauseFutilityComponent.prototype.addForm = function () {
        console.log(this.aForm.value);
        this.aForm.reset();
    };
    DrugsCauseFutilityComponent.prototype.cancel = function () {
        this.aForm.reset();
    };
    DrugsCauseFutilityComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-cause-futility',
            template: __webpack_require__(/*! ./drugs-cause-futility.component.html */ "./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.html"),
            styles: [__webpack_require__(/*! ./drugs-cause-futility.component.css */ "./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], DrugsCauseFutilityComponent);
    return DrugsCauseFutilityComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.css":
/*!************************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.css ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.html":
/*!*************************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.html ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Confirmarea procesului de nimicire a medicamentelor</h3>\n  <hr>\n  <!-- Begin table -->\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"nrReg\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nrReg\">Nr. de înregistrare a cererii\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker\" placeholder=\"Data depunerii cererii\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"compSolicitant\">Compania solicitant\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"nameMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nameMed\">Denumirea medicamentului\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Forma farmaceutică\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <div class=\"row\">\n          <div class=\"col-4\">\n            <div class=\"md-form\">\n              <mat-form-field class=\"w-100\">\n                <mat-select placeholder=\"Doza\">\n                  <mat-option *ngFor=\"let x of doza\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                </mat-select>\n              </mat-form-field>\n            </div>\n          </div>\n          <div class=\"col-8\">\n            <div class=\"md-form\">\n              <input id=\"quantity\" mdbInputDirective type=\"text\" class=\"form-control\">\n              <label for=\"quantity\">Cantitatea\n                <span class=\"text-danger\">*</span>\n              </label>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <div class=\"row\">\n          <div class=\"col-12\">\n            <div class=\"md-form\">\n              <input id=\"ambalajPrimar\" mdbInputDirective type=\"text\" class=\"form-control\">\n              <label for=\"ambalajPrimar\">Ambalaj primar\n                <span class=\"text-danger\">*</span>\n              </label>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"seria\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"seria\">Seria\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"quantity2\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"quantity2\">Cantitatea\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"cauzaInutilitatii\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"cauzaInutilitatii\">Cauza inutilității\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"metodaNimicire\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"metodaNimicire\">Metoda de nimicire\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Bonul de plată</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"nr2\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nr2\">Nr.\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker1\" placeholder=\"Data\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker1></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"sumaAchitarii\" mdbInputDirective type=\"number\" class=\"form-control\">\n        <label for=\"sumaAchitarii\">Suma pentru achitare (lei)\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"sumaAchitata\" mdbInputDirective type=\"number\" class=\"form-control\">\n        <label for=\"sumaAchitata\">Suma achitată (lei)\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data achitării\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker2></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"md-form\">\n        <textarea id=\"nota\" type=\"text\" class=\"md-textarea form-control\" mdbInputDirective></textarea>\n        <label for=\"nota\">Nota</label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Comisia de nimicire inofensiva a medicamentelor</h5>\n  <hr>\n  <table class=\"table table-widths-lg\">\n    <thead class=\"black white-text\">\n      <tr class=\"text-center\">\n        <th scope=\"col\">Institutia</th>\n        <th scope=\"col\">Nume, prenume</th>\n        <th scope=\"col\">Functie</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of comisiaNimicire\">\n        <th scope=\"row\">{{ x.institut }}</th>\n        <td class=\"text-center\">{{ x.numePrenume }}</td>\n        <td class=\"text-right\">{{ x.functie }}</td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Documente</h5>\n  <hr>\n  <table class=\"table table-widths-lg\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of document\">\n        <th scope=\"row\">{{ x.denumire }}</th>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>Vizualizare</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"col-md-12\">\n    <div class=\"md-form\">\n      <textarea id=\"nota2\" type=\"text\" class=\"md-textarea form-control\" mdbInputDirective></textarea>\n      <label for=\"nota2\">Nota</label>\n    </div>\n  </div>\n  <div class=\"text-center\">\n    <button type=\"button\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Confirmare sfirsit proces</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.ts":
/*!***********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.ts ***!
  \***********************************************************************************************/
/*! exports provided: DrugsConfirmDestroyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsConfirmDestroyComponent", function() { return DrugsConfirmDestroyComponent; });
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

var DrugsConfirmDestroyComponent = /** @class */ (function () {
    function DrugsConfirmDestroyComponent() {
        this.cerere = [
            { denumirea: 'Cerere de nimicire a medicamentelor 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.comisiaNimicire = [
            { institut: 'Agentia Municipala Ecologica', numePrenume: 'User 1', functie: 'Doctor in Chimie' },
            { institut: 'Centrul National Stiintifico-Practic de Medicina Preventiva', numePrenume: 'User 2', functie: 'Doctor' },
        ];
        this.document = [
            { denumire: 'Bon de plata' },
            { denumire: 'Act de receptie a medicamentelor' },
            { denumire: 'Scrisoare de solicitare Agentia Municipala Ecologica' },
            { denumire: 'Scrisoare de solicitare catre Centrul National Stiintifico-Practic de Medicina Preventiva' },
            { denumire: 'Proces-verbal privind nimicirea inofensiva a medicamentelor' },
        ];
        this.forma = [
            { value: 'forma-1', viewValue: 'Forma 1' },
            { value: 'forma-2', viewValue: 'Forma 2' },
            { value: 'forma-3', viewValue: 'Forma 3' },
            { value: 'forma-4', viewValue: 'Forma 4' },
            { value: 'forma-5', viewValue: 'Forma 5' }
        ];
    }
    DrugsConfirmDestroyComponent.prototype.ngOnInit = function () {
        this.model3 = 'B2';
    };
    DrugsConfirmDestroyComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-confirm-destroy',
            template: __webpack_require__(/*! ./drugs-confirm-destroy.component.html */ "./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.html"),
            styles: [__webpack_require__(/*! ./drugs-confirm-destroy.component.css */ "./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DrugsConfirmDestroyComponent);
    return DrugsConfirmDestroyComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.css":
/*!**********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Evaluarea cererii de nimicire a medicamentelor</h3>\n  <hr>\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"nrCerere\" mdbInputDirective type=\"text\" class=\"form-control\" disabled value=\"Nr12345\">\n        <label for=\"nrCerere\">Nr. cererii\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"compSolicitant\">Compania solicitant\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"med\">Medicamentul\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"offset-md-1 col-md-5\">\n      <div class=\"md-form\">\n        <mat-radio-group [(ngModel)]=\"model3\">\n          <div class=\"row\">\n            <div class=\"col\">\n              <mat-radio-button name=\"prop1\" value=\"A2\" disabled>Primară</mat-radio-button>\n            </div>\n            <div class=\"col\">\n              <mat-radio-button name=\"prop2\" value=\"B2\" disabled>Repetată</mat-radio-button>\n            </div>\n          </div>\n        </mat-radio-group>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Medicamentele de nimicit</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"denumire\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"denumire\">Denumirea\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Forma farmaceutică\" disabled>\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row\">\n        <div class=\"col-7\">\n          <div class=\"md-form\">\n            <input id=\"doza\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n            <label for=\"doza\">Doza\n            </label>\n          </div>\n        </div>\n        <div class=\"col-5\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"mg\" disabled>\n                <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Ambalaj primar\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"seria\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"seria\">Seria\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row\">\n        <div class=\"col-7\">\n          <div class=\"md-form\">\n            <input id=\"cantitatea\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n            <label for=\"cantitatea\">Cantitatea\n            </label>\n          </div>\n        </div>\n        <div class=\"col-5\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"grame\" disabled>\n                <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Cauza inutilitatii\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Metoda de nimicire\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"suma\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"suma\">Suma (lei MD)\n        </label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Intocmirea bonului de plata</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"nrBon\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nrBon\">Nr. bon de plata\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data intocmirii\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker2></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-12\">\n      <div class=\"md-form\">\n        <div class=\"row\">\n          <div class=\"col-7\">\n            <div class=\"md-form\">\n              <input id=\"nrBon2\" mdbInputDirective type=\"text\" class=\"form-control\">\n              <label for=\"nrBon2\">Nr. bon de plata\n                <span class=\"text-danger\">*</span>\n              </label>\n            </div>\n          </div>\n          <div class=\"col-5 mb\">\n            <button class=\"mt-2 btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>Calculeaza suma spre achitare</button>\n          </div>\n        </div>\n        <hr>\n        <div class=\"position-button\">\n          <button class=\"btn btn-indigo btn-sm waves-light\" mdbWavesEffect>Vizualizare</button>\n          <button class=\"btn btn-dark-green btn-sm waves-light\" mdbWavesEffect>Expediere la solicitant</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Achitarea bonului de plata</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data achitarii\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker3></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <div class=\"alert alert-info\">\n          Suma achitata: 123445 lei\n        </div>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Receptia medicamentelor</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker4\" placeholder=\"Data receptiei medicamentelor\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker4\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker4></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker5\" placeholder=\"Data stabilita pentru nimicire\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker5\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker5></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <table class=\"table table-widths-lg\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of document\">\n        <th scope=\"row\">{{ x.denumire }}</th>\n        <td>\n          <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Generare</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Vizualizare</button>\n          <button class=\"btn btn-violet-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Semnare</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Solicitare de participare in comisie</h5>\n  <hr>\n  <table class=\"table table-widths-lg\">\n    <thead class=\"black white-text\">\n      <tr class=\"text-center\">\n        <th scope=\"col\">Institutia</th>\n        <th scope=\"col\">Nume, prenume</th>\n        <th scope=\"col\">Functie</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of comisiaNimicire\">\n        <th scope=\"row\">{{ x.institut }}</th>\n        <td class=\"text-center\">{{ x.numePrenume }}</td>\n        <td class=\"text-right\">{{ x.functie }}</td>\n        <td>\n          <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Vizualizare scrisoare</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>VizualiSterge din listazare</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <div class=\"text-center\">\n    <button class=\"btn btn-mdb-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adaugati membru in comisie</button>\n    <button class=\"btn btn-indigo waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Expediere solicitari</button>\n  </div>\n  <div class=\"col-md-12\">\n    <div class=\"md-form\">\n      <textarea type=\"text\" class=\"md-textarea form-control\" mdbInputDirective></textarea>\n      <label for=\"\">Nota</label>\n    </div>\n  </div>\n  <div class=\"text-center\">\n    <button type=\"button\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>\n      <i class=\"fa fa-angle-double-left\" aria-hidden=\"true\"></i> Pasul precedent</button>\n    <button type=\"button\" class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Pasul urmator\n      <i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: DrugsDestroyDemandComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsDestroyDemandComponent", function() { return DrugsDestroyDemandComponent; });
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

var DrugsDestroyDemandComponent = /** @class */ (function () {
    function DrugsDestroyDemandComponent() {
        this.cerere = [
            { denumirea: 'Cerere de nimicire a medicamentelor 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.comisiaNimicire = [
            { institut: 'Agentia Municipala Ecologica', numePrenume: 'User 1', functie: 'Doctor in Chimie' },
            { institut: 'Centrul National Stiintifico-Practic de Medicina Preventiva', numePrenume: 'User 2', functie: 'Doctor' },
        ];
        this.document = [
            { denumire: 'Bon de plata' },
            { denumire: 'Act de receptie a medicamentelor' },
            { denumire: 'Scrisoare de solicitare Agentia Municipala Ecologica' },
            { denumire: 'Scrisoare de solicitare catre Centrul National Stiintifico-Practic de Medicina Preventiva' },
            { denumire: 'Proces-verbal privind nimicirea inofensiva a medicamentelor' },
        ];
    }
    DrugsDestroyDemandComponent.prototype.ngOnInit = function () {
        this.model3 = 'B2';
    };
    DrugsDestroyDemandComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-destroy-demand',
            template: __webpack_require__(/*! ./drugs-destroy-demand.component.html */ "./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.html"),
            styles: [__webpack_require__(/*! ./drugs-destroy-demand.component.css */ "./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DrugsDestroyDemandComponent);
    return DrugsDestroyDemandComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.css":
/*!**************************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.css ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.html":
/*!***************************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.html ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Inregistrarea cererii de nimicire a medicamentelor</h3>\n  <hr>\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Stergere</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"nrCerere\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nrCerere\">Nr. cererii\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"compSolicitant\">Compania solicitant\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"med\">Medicamentul\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"offset-md-1 col-md-5\">\n      <div class=\"md-form\">\n        <mat-radio-group [(ngModel)]=\"model3\">\n          <div class=\"row\">\n            <div class=\"col\">\n              <mat-radio-button name=\"prop1\" value=\"A2\">Primară</mat-radio-button>\n            </div>\n            <div class=\"col\">\n              <mat-radio-button name=\"prop2\" value=\"B2\">Repetată</mat-radio-button>\n            </div>\n          </div>\n        </mat-radio-group>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Medicamentele de nimicit</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"denumire\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"denumire\">Denumirea\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Forma farmaceutică\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row\">\n        <div class=\"col-7\">\n          <div class=\"md-form\">\n            <input id=\"doza\" mdbInputDirective type=\"text\" class=\"form-control\">\n            <label for=\"doza\">Doza\n            </label>\n          </div>\n        </div>\n        <div class=\"col-5\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"mg\">\n                <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Ambalaj primar\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"seria\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"seria\">Seria\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row\">\n        <div class=\"col-7\">\n          <div class=\"md-form\">\n            <input id=\"quantity\" mdbInputDirective type=\"text\" class=\"form-control\">\n            <label for=\"quantity\">Cantitatea\n            </label>\n          </div>\n        </div>\n        <div class=\"col-5\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"grame\">\n                <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-5\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Cauza inutilitatii\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-5\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Metoda de nimicire\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-2\">\n      <div class=\"md-form\">\n        <button class=\"mt-3 btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Sterge din lista</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"position-button\">\n    <button class=\"mt-3 btn btn-mdb-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adauga medicament nou</button>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"md-form\">\n        <textarea id=\"nota\" type=\"text\" class=\"md-textarea form-control\" mdbInputDirective></textarea>\n        <label for=\"nota\">Nota</label>\n      </div>\n    </div>\n  </div>\n  <div class=\"text-center\">\n    <button type=\"button\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Confirmare cerere</button>\n    <button type=\"button\" class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Anulare</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.ts":
/*!*************************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.ts ***!
  \*************************************************************************************************/
/*! exports provided: DrugsDestroyRegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsDestroyRegisterComponent", function() { return DrugsDestroyRegisterComponent; });
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

var DrugsDestroyRegisterComponent = /** @class */ (function () {
    function DrugsDestroyRegisterComponent() {
        this.cerere = [
            { denumirea: 'Cerere de nimicire a medicamentelor 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
    }
    DrugsDestroyRegisterComponent.prototype.ngOnInit = function () {
        this.model3 = 'B2';
    };
    DrugsDestroyRegisterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-destroy-register',
            template: __webpack_require__(/*! ./drugs-destroy-register.component.html */ "./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.html"),
            styles: [__webpack_require__(/*! ./drugs-destroy-register.component.css */ "./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DrugsDestroyRegisterComponent);
    return DrugsDestroyRegisterComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Adaugare metoda de nimicire a medicamentelor</h3>\n    <hr>\n    <form [formGroup]='qForm'>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"cod\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"cod\">\n          <label for=\"cod\">Cod\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"denumireaMetodei\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"denumireaMetodei\">\n          <label for=\"denumireaMetodei\">Denumirea metodei\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"descriere\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"descriere\">\n          <label for=\"descriere\">Descriere\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n    </form>\n    <div class=\"text-center\">\n      <button type=\"submit\" [disabled]=\"!qForm.valid\" (click)=\"addForm()\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adaugare</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm waves-light\" mdbWavesEffect (click)=\"cancel()\">Anulare</button>\n    </div>\n  </div>\n  \n  \n  <div class=\"alerts-position\">\n    <div *ngIf=\"qForm.controls['cod'].touched && !qForm.controls['cod'].valid\">\n      <div *ngIf=\"!qForm.controls['cod'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\" role=\"alert\">\n        In campul\n        <strong>cod</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['denumireaMetodei'].touched && !qForm.controls['denumireaMetodei'].valid\">\n      <div *ngIf=\"!qForm.controls['denumireaMetodei'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>Denumirea metodei</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['descriere'].touched && !qForm.controls['descriere'].valid\">\n      <div *ngIf=\"!qForm.controls['descriere'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>descriere</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n  </div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.ts ***!
  \*******************************************************************************/
/*! exports provided: DrugsDestroyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsDestroyComponent", function() { return DrugsDestroyComponent; });
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


var DrugsDestroyComponent = /** @class */ (function () {
    function DrugsDestroyComponent(fb) {
        this.fb = fb;
        this.qForm = fb.group({
            'cod': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireaMetodei': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'descriere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    DrugsDestroyComponent.prototype.addForm = function () {
        console.log(this.qForm.value);
        this.qForm.reset();
    };
    DrugsDestroyComponent.prototype.cancel = function () {
        this.qForm.reset();
    };
    DrugsDestroyComponent.prototype.ngOnInit = function () {
    };
    DrugsDestroyComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-destroy',
            template: __webpack_require__(/*! ./drugs-destroy.component.html */ "./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.html"),
            styles: [__webpack_require__(/*! ./drugs-destroy.component.css */ "./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], DrugsDestroyComponent);
    return DrugsDestroyComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.css":
/*!********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.css ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Efectuarea procesului de nimicire a medicamentelor</h3>\n  <hr>\n  <table class=\"table table-widths-lg text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\" disabled value=\"Nr12345\">\n        <label for=\"nrCererii\">Nr. cererii\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"compSolicitant\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"compSolicitant\">Compania solicitant\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"med\">Medicamentul\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"offset-md-1 col-md-5\">\n      <div class=\"md-form\">\n        <mat-radio-group [(ngModel)]=\"model3\">\n          <div class=\"row\">\n            <div class=\"col\">\n              <mat-radio-button name=\"prop1\" value=\"A2\" disabled>Primară</mat-radio-button>\n            </div>\n            <div class=\"col\">\n              <mat-radio-button name=\"prop2\" value=\"B2\" disabled>Repetată</mat-radio-button>\n            </div>\n          </div>\n        </mat-radio-group>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Medicamentele de nimicit</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"denumire\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"denumire\">Denumirea\n          <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Forma farmaceutică\" disabled>\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row\">\n        <div class=\"col-7\">\n          <div class=\"md-form\">\n            <input id=\"doza\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n            <label for=\"doza\">Doza\n            </label>\n          </div>\n        </div>\n        <div class=\"col-5\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"mg\" disabled>\n                <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Ambalaj primar\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"seria\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"seria\">Seria\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"row\">\n        <div class=\"col-7\">\n          <div class=\"md-form\">\n            <input id=\"quantity\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n            <label for=\"quantity\">Cantitatea\n            </label>\n          </div>\n        </div>\n        <div class=\"col-5\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"grame\" disabled>\n                <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Cauza inutilitatii\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Metoda de nimicire\">\n            <mat-option *ngFor=\"let x of forma\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"constulNimicirii\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"constulNimicirii\">Costul nimicirii (lei MD)\n        </label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Bon de plata</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"nrBon\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"nrBon\">Nr. bon de plata\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data intocmirii\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker2></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"suma\" mdbInputDirective type=\"text\" class=\"form-control\" disabled>\n        <label for=\"suma\">Suma spre achitare\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data achitarii\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker3></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-12\">\n      <div class=\"md-form\">\n        <div class=\"alert alert-info\">\n          Suma achitata: <strong>12345 lei</strong>\n        </div>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Receptia medicamentelor</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker4\" placeholder=\"Data receptiei\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker4\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker4></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-checkbox [(ngModel)]=\"receptia\">Confirmati receptionarea medicamentelor</mat-checkbox>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker5\" placeholder=\"Data nimicirii medicamentelor\" disabled>\n          <mat-datepicker-toggle matSuffix [for]=\"picker5\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker5></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-checkbox [(ngModel)]=\"metode\">Confirmati metodele de nimicire a medicamentelor\n          </mat-checkbox>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Comisia de nimicire inofensiva a medicamentelor</h5>\n  <hr>\n  <table class=\"table table-widths-lg\">\n    <thead class=\"black white-text\">\n      <tr class=\"text-center\">\n        <th scope=\"col\">Institutia</th>\n        <th scope=\"col\">Nume, prenume</th>\n        <th scope=\"col\">Functie</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of comisiaNimicire\">\n        <th scope=\"row\">{{ x.institut }}</th>\n        <td class=\"text-center\">{{ x.numePrenume }}</td>\n        <td class=\"text-right\">{{ x.functie }}</td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Documente</h5>\n  <hr>\n  <table class=\"table table-widths-lg\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of document\">\n        <th scope=\"row\">{{ x.denumire }}</th>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>Vizualizare</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <hr>\n  <div class=\"col-md-12\">\n    <div class=\"md-form\">\n      <textarea id=\"nota\" type=\"text\" class=\"md-textarea form-control\" mdbInputDirective></textarea>\n      <label for=\"nota\">Nota</label>\n    </div>\n  </div>\n  <div class=\"text-center\">\n    <button type=\"button\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect><i class=\"fa fa-angle-double-left\" aria-hidden=\"true\"></i> Pasul precedent</button>\n    <button type=\"button\" class=\"btn btn-dark-red-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Pasul urmator <i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i></button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: DrugsFinalDestroyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsFinalDestroyComponent", function() { return DrugsFinalDestroyComponent; });
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

var DrugsFinalDestroyComponent = /** @class */ (function () {
    function DrugsFinalDestroyComponent() {
        this.cerere = [
            { denumirea: 'Cerere de nimicire a medicamentelor 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Cerere de nimicire a medicamentelor 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.comisiaNimicire = [
            { institut: 'Agentia Municipala Ecologica', numePrenume: 'User 1', functie: 'Doctor in Chimie' },
            { institut: 'Centrul National Stiintifico-Practic de Medicina Preventiva', numePrenume: 'User 2', functie: 'Doctor' },
        ];
        this.document = [
            { denumire: 'Bon de plata' },
            { denumire: 'Act de receptie a medicamentelor' },
            { denumire: 'Scrisoare de solicitare Agentia Municipala Ecologica' },
            { denumire: 'Scrisoare de solicitare catre Centrul National Stiintifico-Practic de Medicina Preventiva' },
            { denumire: 'Proces-verbal privind nimicirea inofensiva a medicamentelor' },
        ];
    }
    DrugsFinalDestroyComponent.prototype.ngOnInit = function () {
        this.model3 = 'B2';
    };
    DrugsFinalDestroyComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-final-destroy',
            template: __webpack_require__(/*! ./drugs-final-destroy.component.html */ "./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.html"),
            styles: [__webpack_require__(/*! ./drugs-final-destroy.component.css */ "./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DrugsFinalDestroyComponent);
    return DrugsFinalDestroyComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-form/drugs-form.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-form/drugs-form.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-form/drugs-form.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-form/drugs-form.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Adaugare tip nou de forma pentru medicamente</h3>\n    <hr>\n    <form [formGroup]='qForm'>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"cod\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"cod\">\n          <label for=\"cod\">Cod\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"denumireaForma\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"denumireaForma\">\n          <label for=\"denumireaForma\">Denumirea formei\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"descriere\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"descriere\">\n          <label for=\"descriere\">Descriere\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n    </form>\n    <div class=\"text-center\">\n      <button type=\"submit\" [disabled]=\"!qForm.valid\" (click)=\"addForm()\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adaugare</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm waves-light\" mdbWavesEffect (click)=\"cancel()\">Anulare</button>\n    </div>\n  </div>\n  \n  \n  <div class=\"alerts-position\">\n    <div *ngIf=\"qForm.controls['cod'].touched && !qForm.controls['cod'].valid\">\n      <div *ngIf=\"!qForm.controls['cod'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\" role=\"alert\">\n        In campul\n        <strong>Cod</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['denumireaForma'].touched && !qForm.controls['denumireaForma'].valid\">\n      <div *ngIf=\"!qForm.controls['denumireaForma'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>Denumirea formei</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['descriere'].touched && !qForm.controls['descriere'].valid\">\n      <div *ngIf=\"!qForm.controls['descriere'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>Descriere</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n  </div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-form/drugs-form.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-form/drugs-form.component.ts ***!
  \*************************************************************************/
/*! exports provided: DrugsFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsFormComponent", function() { return DrugsFormComponent; });
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


var DrugsFormComponent = /** @class */ (function () {
    function DrugsFormComponent(fb) {
        this.fb = fb;
        this.qForm = fb.group({
            'cod': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumireaForma': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'descriere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    DrugsFormComponent.prototype.addForm = function () {
        console.log(this.qForm.value);
        this.qForm.reset();
    };
    DrugsFormComponent.prototype.cancel = function () {
        this.qForm.reset();
    };
    DrugsFormComponent.prototype.ngOnInit = function () {
    };
    DrugsFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-form',
            template: __webpack_require__(/*! ./drugs-form.component.html */ "./src/app/all-modules/module-8/drugs-form/drugs-form.component.html"),
            styles: [__webpack_require__(/*! ./drugs-form.component.css */ "./src/app/all-modules/module-8/drugs-form/drugs-form.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], DrugsFormComponent);
    return DrugsFormComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Adaugare unitate de masura pentru medicamente</h3>\n    <hr>\n    <form [formGroup]='qForm'>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"cod\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"cod\">\n          <label for=\"cod\">Cod\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"denumirea\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"denumirea\">\n          <label for=\"denumirea\">Denumirea\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"descriere\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"descriere\">\n          <label for=\"descriere\">Descriere\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n    </form>\n    <div class=\"text-center\">\n      <button type=\"submit\" [disabled]=\"!qForm.valid\" (click)=\"addForm()\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adaugare</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm waves-light\" mdbWavesEffect (click)=\"cancel()\">Anulare</button>\n    </div>\n  </div>\n  \n  \n  <div class=\"alerts-position\">\n    <div *ngIf=\"qForm.controls['cod'].touched && !qForm.controls['cod'].valid\">\n      <div *ngIf=\"!qForm.controls['cod'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\" role=\"alert\">\n        In campul\n        <strong>Cod</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['denumirea'].touched && !qForm.controls['denumirea'].valid\">\n      <div *ngIf=\"!qForm.controls['denumirea'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>Denumirea</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['descriere'].touched && !qForm.controls['descriere'].valid\">\n      <div *ngIf=\"!qForm.controls['descriere'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>Descriere</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n  </div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.ts ***!
  \*******************************************************************************/
/*! exports provided: DrugsMeasureComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsMeasureComponent", function() { return DrugsMeasureComponent; });
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


var DrugsMeasureComponent = /** @class */ (function () {
    function DrugsMeasureComponent(fb) {
        this.fb = fb;
        this.qForm = fb.group({
            'cod': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumirea': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'descriere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    DrugsMeasureComponent.prototype.addForm = function () {
        console.log(this.qForm.value);
        this.qForm.reset();
    };
    DrugsMeasureComponent.prototype.cancel = function () {
        this.qForm.reset();
    };
    DrugsMeasureComponent.prototype.ngOnInit = function () {
    };
    DrugsMeasureComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-measure',
            template: __webpack_require__(/*! ./drugs-measure.component.html */ "./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.html"),
            styles: [__webpack_require__(/*! ./drugs-measure.component.css */ "./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], DrugsMeasureComponent);
    return DrugsMeasureComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Adaugare tip de ambalaj pentru medicamente</h3>\n    <hr>\n    <form [formGroup]='qForm'>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"cod\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"cod\">\n          <label for=\"cod\">Cod\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"denumirea\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"denumirea\">\n          <label for=\"denumirea\">Denumirea\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n  <div class=\"mb-5\">\n      <div class=\"md-form\">\n          <input id=\"descriere\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"descriere\">\n          <label for=\"descriere\">Descriere\n            <strong class=\"text-danger\">*</strong>\n          </label>\n        </div>\n  </div>\n    </form>\n    <div class=\"text-center\">\n      <button type=\"submit\" [disabled]=\"!qForm.valid\" (click)=\"addForm()\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adaugare</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm waves-light\" mdbWavesEffect (click)=\"cancel()\">Anulare</button>\n    </div>\n  </div>\n  \n  \n  <div class=\"alerts-position\">\n    <div *ngIf=\"qForm.controls['cod'].touched && !qForm.controls['cod'].valid\">\n      <div *ngIf=\"!qForm.controls['cod'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\" role=\"alert\">\n        In campul\n        <strong>Cod</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['denumirea'].touched && !qForm.controls['denumirea'].valid\">\n      <div *ngIf=\"!qForm.controls['denumirea'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>Denumirea metodei</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"qForm.controls['descriere'].touched && !qForm.controls['descriere'].valid\">\n      <div *ngIf=\"!qForm.controls['descriere'].errors.valid\" class=\"alert alert-danger alert-dismissible fade show animated fadeIn\"\n        role=\"alert\">\n        In campul\n        <strong>Descriere</strong> este necesar de introdus date\n        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n    </div>\n  </div>"

/***/ }),

/***/ "./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.ts ***!
  \*************************************************************************/
/*! exports provided: DrugsPackComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugsPackComponent", function() { return DrugsPackComponent; });
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


var DrugsPackComponent = /** @class */ (function () {
    function DrugsPackComponent(fb) {
        this.fb = fb;
        this.qForm = fb.group({
            'cod': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'denumirea': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            'descriere': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
    }
    DrugsPackComponent.prototype.addForm = function () {
        console.log(this.qForm.value);
        this.qForm.reset();
    };
    DrugsPackComponent.prototype.cancel = function () {
        this.qForm.reset();
    };
    DrugsPackComponent.prototype.ngOnInit = function () {
    };
    DrugsPackComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugs-pack',
            template: __webpack_require__(/*! ./drugs-pack.component.html */ "./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.html"),
            styles: [__webpack_require__(/*! ./drugs-pack.component.css */ "./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], DrugsPackComponent);
    return DrugsPackComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/medicament-destruction-routing.module.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/all-modules/module-8/medicament-destruction-routing.module.ts ***!
  \*******************************************************************************/
/*! exports provided: MedicamentDestructionRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MedicamentDestructionRoutingModule", function() { return MedicamentDestructionRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var routes = [];
var MedicamentDestructionRoutingModule = /** @class */ (function () {
    function MedicamentDestructionRoutingModule() {
    }
    MedicamentDestructionRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], MedicamentDestructionRoutingModule);
    return MedicamentDestructionRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-8/medicament-destruction.module.ts":
/*!***********************************************************************!*\
  !*** ./src/app/all-modules/module-8/medicament-destruction.module.ts ***!
  \***********************************************************************/
/*! exports provided: MedicamentDestructionModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MedicamentDestructionModule", function() { return MedicamentDestructionModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _medicament_destruction_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./medicament-destruction-routing.module */ "./src/app/all-modules/module-8/medicament-destruction-routing.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _add_member_add_member_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./add-member/add-member.component */ "./src/app/all-modules/module-8/add-member/add-member.component.ts");
/* harmony import */ var _drugs_cause_futility_drugs_cause_futility_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./drugs-cause-futility/drugs-cause-futility.component */ "./src/app/all-modules/module-8/drugs-cause-futility/drugs-cause-futility.component.ts");
/* harmony import */ var _drugs_confirm_destroy_drugs_confirm_destroy_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./drugs-confirm-destroy/drugs-confirm-destroy.component */ "./src/app/all-modules/module-8/drugs-confirm-destroy/drugs-confirm-destroy.component.ts");
/* harmony import */ var _drugs_destroy_drugs_destroy_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./drugs-destroy/drugs-destroy.component */ "./src/app/all-modules/module-8/drugs-destroy/drugs-destroy.component.ts");
/* harmony import */ var _drugs_destroy_demand_drugs_destroy_demand_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./drugs-destroy-demand/drugs-destroy-demand.component */ "./src/app/all-modules/module-8/drugs-destroy-demand/drugs-destroy-demand.component.ts");
/* harmony import */ var _drugs_destroy_register_drugs_destroy_register_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./drugs-destroy-register/drugs-destroy-register.component */ "./src/app/all-modules/module-8/drugs-destroy-register/drugs-destroy-register.component.ts");
/* harmony import */ var _drugs_final_destroy_drugs_final_destroy_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./drugs-final-destroy/drugs-final-destroy.component */ "./src/app/all-modules/module-8/drugs-final-destroy/drugs-final-destroy.component.ts");
/* harmony import */ var _drugs_pack_drugs_pack_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./drugs-pack/drugs-pack.component */ "./src/app/all-modules/module-8/drugs-pack/drugs-pack.component.ts");
/* harmony import */ var _drugs_measure_drugs_measure_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./drugs-measure/drugs-measure.component */ "./src/app/all-modules/module-8/drugs-measure/drugs-measure.component.ts");
/* harmony import */ var _drugs_form_drugs_form_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./drugs-form/drugs-form.component */ "./src/app/all-modules/module-8/drugs-form/drugs-form.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
















var MedicamentDestructionModule = /** @class */ (function () {
    function MedicamentDestructionModule() {
    }
    MedicamentDestructionModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _medicament_destruction_routing_module__WEBPACK_IMPORTED_MODULE_2__["MedicamentDestructionRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_5__["MaterialSharedModule"].forRoot(),
            ],
            declarations: [_add_member_add_member_component__WEBPACK_IMPORTED_MODULE_6__["AddMemberComponent"], _drugs_cause_futility_drugs_cause_futility_component__WEBPACK_IMPORTED_MODULE_7__["DrugsCauseFutilityComponent"], _drugs_confirm_destroy_drugs_confirm_destroy_component__WEBPACK_IMPORTED_MODULE_8__["DrugsConfirmDestroyComponent"], _drugs_destroy_drugs_destroy_component__WEBPACK_IMPORTED_MODULE_9__["DrugsDestroyComponent"],
                _drugs_destroy_demand_drugs_destroy_demand_component__WEBPACK_IMPORTED_MODULE_10__["DrugsDestroyDemandComponent"], _drugs_destroy_register_drugs_destroy_register_component__WEBPACK_IMPORTED_MODULE_11__["DrugsDestroyRegisterComponent"], _drugs_final_destroy_drugs_final_destroy_component__WEBPACK_IMPORTED_MODULE_12__["DrugsFinalDestroyComponent"], _drugs_form_drugs_form_component__WEBPACK_IMPORTED_MODULE_15__["DrugsFormComponent"],
                _drugs_measure_drugs_measure_component__WEBPACK_IMPORTED_MODULE_14__["DrugsMeasureComponent"], _drugs_pack_drugs_pack_component__WEBPACK_IMPORTED_MODULE_13__["DrugsPackComponent"]]
        })
    ], MedicamentDestructionModule);
    return MedicamentDestructionModule;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-8-medicament-destruction-module.js.map