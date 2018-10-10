(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-4-import-authorization-module"],{

/***/ "./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.css":
/*!****************************************************************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.css ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.html ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Autorizarea importului medicamentului</h3>\n  <hr>\n  <table class=\"table table-widths text-center\">\n    <thead class=\"black white-text\">\n      <tr>\n        <th scope=\"col\">Denumire</th>\n        <th scope=\"col\">Format</th>\n        <th scope=\"col\">Data incarcarii</th>\n        <th scope=\"col\">Actiuni</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let x of cerere\">\n        <th scope=\"row\">{{ x.denumirea }}</th>\n        <td>{{ x.format }}</td>\n        <td>{{ x.dataIncarcarii }}</td>\n        <td>\n          <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n          <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <div class=\"col position-button\">\n    <label for=\"incarcaFisier\" class=\"btn btn-indigo btn-sm\">\n      <input id=\"incarcaFisier\" type=\"file\" style=\"display:none;\"> Incarca Fisier\n    </label>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Pagina de inregistrare</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <mat-checkbox [(ngModel)]=\"medReg\">Medicament inregistrat</mat-checkbox>\n    </div>\n    <div class=\"col-md-6\">\n      <mat-checkbox [(ngModel)]=\"medUnreg\">Medicamentul neinregistrat</mat-checkbox>\n    </div>\n    <div class=\"col-md-6\">\n      <mat-checkbox [(ngModel)]=\"MatPrima\">Materia primă</mat-checkbox>\n    </div>\n    <div class=\"col-md-6\">\n      <mat-checkbox [(ngModel)]=\"AmbalajProd\">Ambalajul pentru producerea medicamentelor</mat-checkbox>\n    </div>\n    <div class=\"col-md-6\">\n      <mat-checkbox [(ngModel)]=\"Prelevare\">Prelevarea a probei medii și controlului de stat </mat-checkbox>\n    </div>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"nrRegCererii\" mdbInputDirective type=\"text\" class=\"form-control\" disabled value=\"CI251020\">\n        <label for=\"nrRegCererii\">Nr. de înregistrare a cererii\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker\" placeholder=\"Data depunerii cererii\" disabled [formControl]=\"date\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Compania solicitant\">\n            <mat-option *ngFor=\"let x of compSolicitant\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Materia prima</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"denumirea\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"denumirea\">Denumirea\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"prod\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"prod\">Producătorul\n        </label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Tara\">\n            <mat-option *ngFor=\"let x of taraProd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"adresa\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"adresa\">Adresa\n        </label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Vînzătorului</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Tara\">\n            <mat-option *ngFor=\"let x of taraVinz\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"adresa\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"adresa\">Adresa\n        </label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Importator</h5>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Tara\">\n            <mat-option *ngFor=\"let x of taraVinz\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"adresa2\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"adresa2\">Adresa\n        </label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"codulVamal\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"codulVamal\">Codul vamal</label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"temAutImport\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"temAutImport\">Temeiul pentru autorizație de import (Contract)</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"quantity\" mdbInputDirective type=\"number\" class=\"form-control\">\n        <label for=\"quantity\">Cantitatea</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"pret\" mdbInputDirective type=\"number\" class=\"form-control\">\n        <label for=\"pret\">Prețul (lei)</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"Valuta\">\n            <mat-option *ngFor=\"let x of valuta\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"condPrec\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"condPrec\">Condiții și precizări</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <input id=\"nrDeclVamal\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nrDeclVamal\">Nr. declaraţiei vamale</label>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker1\" placeholder=\"Data declaraţiei vamale\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker1></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"nrAutImportRM\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"nrAutImportRM\">Nr. autorizaţiei de import în RM</label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <mat-form-field class=\"w-100\">\n          <input matInput [matDatepicker]=\"picker2\" placeholder=\"Termen de valabilitate\">\n          <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n          <mat-datepicker touchUi #picker2></mat-datepicker>\n        </mat-form-field>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"cantPrelevanta\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"cantPrelevanta\">Cantitatea prelevată</label>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"md-form\">\n        <input id=\"cantRet\" mdbInputDirective type=\"text\" class=\"form-control\">\n        <label for=\"cantRet\">Cantitatea returnată</label>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <section *ngIf=\"medReg\">\n    <h5 class=\"text-center font-weight-bold\">Informația despre medicamentul înregistrat</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"codMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codMed\">Codul medicamentului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"codVamal\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codVamal\">Codul vamal</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"denumireaComercMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"denumireaComercMed\">Denumirea comercială a medicamentului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Forma medicamentoasă\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <input id=\"doza\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"doza\">Doza</label>\n        </div>\n      </div>\n      <div class=\"col-md-2\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Volum\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <input id=\"denumireaComInt\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"denumireaComInt\">Denumirea comună internaționala</label>\n        </div>\n      </div>\n    </div>\n    <div class=\"position-button\">\n      <button type=\"submit\" class=\"btn btn-indigo waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adauga</button>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"divMasura\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"divMasura\">Divizare (Unitatea de măsură)</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Volum\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"n\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"n\">N</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"quantity2\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"quantity2\">Cantitatea</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"pret\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"pret\">Prețul</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Țara producătoare\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"firmProd\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"firmProd\">Firma producătoare</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"nrRegRM\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrRegRM\">Nr. de înregistrare în RM</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data înregistrare în RM\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker3></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"codATC\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codATC\">Cod ATC</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n  </section>\n  <section *ngIf=\"medUnreg\">\n    <h5 class=\"text-center font-weight-bold\">Informația despre medicamentul neînregistrat</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"codVamal\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"CodVamal\">Codul vamal</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"denComercMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"denComercMed\">Denumirea comercială a medicamentului</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Forma medicamentoasă\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <input id=\"doza2\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"doza2\">Doza</label>\n        </div>\n      </div>\n      <div class=\"col-md-2\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Volum\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <input id=\"denumireaComInt2\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"denumireaComInt2\">Denumirea comună internaționala</label>\n        </div>\n      </div>\n    </div>\n    <div class=\"position-button\">\n      <button type=\"submit\" class=\"btn btn-indigo waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adauga</button>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"divMasura2\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"divMasura2\">Divizare (Unitatea de măsură)</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Volum\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"n2\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"n2\">N</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"quantity2\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"quantity2\">Cantitatea</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"pretul2\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"pretul2\">Prețul</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Țara producătoare\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"firmProd2\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"firmProd2\">Firma producătoare</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"nrRegRM2\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrRegRM2\">Nr. de înregistrare în RM</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker4\" placeholder=\"Data înregistrare în RM\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker4\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker4></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"codATC2\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codATC2\">Cod ATC</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n  </section>\n  <section *ngIf=\"MatPrima\">\n    <h5 class=\"text-center font-weight-bold\">Informația despre materia primă</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"codVamal\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codVamal\">Codul vamal</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"denMatPrimeDCI\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"denMatPrimeDCI\">Denumirea materiei prime (DCI)</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"quantity3\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"quantity3\">Cantitatea</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"pret3\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"pret3\">Prețul</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Țara producătoare\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"firmProd\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"firmProd\">Firma producătoare</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"codATC3\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codATC3\">Cod ATC</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n  </section>\n  <section *ngIf=\"AmbalajProd\">\n    <section *ngIf=\"Prelevare\">\n      <h5 class=\"text-center font-weight-bold\">Informația despre ambalajul</h5>\n      <hr>\n      <div class=\"row\">\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <input id=\"codVamal2\" mdbInputDirective type=\"text\" class=\"form-control\">\n            <label for=\"codVamal2\">Codul vamal</label>\n          </div>\n        </div>\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <input id=\"denAmbalaj\" mdbInputDirective type=\"text\" class=\"form-control\">\n            <label for=\"denAmbalaj\">Denumirea ambalajului</label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"quantity4\" mdbInputDirective type=\"number\" class=\"form-control\">\n            <label for=\"quantity4\">Cantitatea</label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <input id=\"pret\" mdbInputDirective type=\"number\" class=\"form-control\">\n            <label for=\"pret\">Prețul</label>\n          </div>\n        </div>\n        <div class=\"col-md-4\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"Valuta\">\n                <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <mat-select placeholder=\"Țara producătoare\">\n                <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n              </mat-select>\n            </mat-form-field>\n          </div>\n        </div>\n        <div class=\"col-md-6\">\n          <div class=\"md-form\">\n            <input id=\"firmProd3\" mdbInputDirective type=\"text\" class=\"form-control\">\n            <label for=\"firmProd3\">Firma producătoare</label>\n          </div>\n        </div>\n      </div>\n      <hr>\n    </section>\n    <h5 class=\"text-center font-weight-bold\">Actul de prelevare a probei medii şi controlului de stat</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"codMed\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codMed\">Codul medicamentului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"codVamal4\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"codVamal4\">Codul vamal</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"denComercMed2\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"denComercMed2\">Denumirea comercială a medicamentului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Forma medicamentoasă\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <input id=\"doza3\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"doza3\">Doza</label>\n        </div>\n      </div>\n      <div class=\"col-md-2\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Volum\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <input id=\"denumireaComInt2\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"denumireaComInt2\">Denumirea comună internaționala</label>\n        </div>\n      </div>\n    </div>\n    <div class=\"position-button\">\n      <button type=\"submit\" class=\"btn btn-indigo waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adauga</button>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"divMasura3\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"divMasura3\">Divizare (Unitatea de măsură)</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Volum\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"n3\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"n3\">N</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"quantity5\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"quantity5\">Cantitatea</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"pret\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"pret\">Prețul</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Valuta\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"suma\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"suma\">Suma</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Țara producătoare\">\n              <mat-option *ngFor=\"let x of unitateDeMasura\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"firmProd4\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"firmProd4\">Firma producătoare</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"nrAutImportRM2\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrAutImportRM2\">Nr. autorizaţiei de import în RM</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"nrDeclVam\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrDeclVam\">Nr. declaraţiei vamale</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker6\" placeholder=\"Data declaraţiei vamale\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker6\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker6></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker7\" placeholder=\"Termen de valabilitate\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker7\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker7></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"cantPre\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"cantPre\">Cantitatea prelevată</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"cantRet\" mdbInputDirective type=\"number\" class=\"form-control\">\n          <label for=\"cantRet\">Cantitatea returnată</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n  </section>\n  <div class=\"text-center\">\n    <button type=\"submit\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Adaugare</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.ts":
/*!***************************************************************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.ts ***!
  \***************************************************************************************************************/
/*! exports provided: ImportAuthorizationEvaluateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportAuthorizationEvaluateComponent", function() { return ImportAuthorizationEvaluateComponent; });
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


var ImportAuthorizationEvaluateComponent = /** @class */ (function () {
    function ImportAuthorizationEvaluateComponent() {
        this.date = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]({ value: new Date(), disabled: true });
        this.cerere = [
            { denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.compSolicitant = [
            { value: 'comp-1', viewValue: 'Comp 1' },
            { value: 'comp-2', viewValue: 'Comp 2' },
            { value: 'comp-3', viewValue: 'Comp 3' },
            { value: 'comp-4', viewValue: 'Comp 4' },
        ];
        this.taraProd = [
            { value: 'tara-1', viewValue: 'Tara 1' },
            { value: 'tara-2', viewValue: 'Tara 2' },
            { value: 'tara-3', viewValue: 'Tara 3' },
            { value: 'tara-4', viewValue: 'Tara 4' },
        ];
        this.taraVinz = [
            { value: 'tara-1', viewValue: 'Tara 1' },
            { value: 'tara-2', viewValue: 'Tara 2' },
            { value: 'tara-3', viewValue: 'Tara 3' },
            { value: 'tara-4', viewValue: 'Tara 4' },
        ];
        this.valuta = [
            { value: 'eur', viewValue: 'EUR: Euro' },
            { value: 'usd', viewValue: 'USD: Dolar American' },
            { value: 'RUR', viewValue: 'RUR: Rubla Ruseasca' },
        ];
        this.medReg = false;
        this.medUnreg = false;
        this.MatPrima = false;
        this.AmbalajProd = false;
        this.Prelevare = false;
    }
    ImportAuthorizationEvaluateComponent.prototype.ngOnInit = function () {
    };
    ImportAuthorizationEvaluateComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-import-authorization-evaluate',
            template: __webpack_require__(/*! ./import-authorization-evaluate.component.html */ "./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.html"),
            styles: [__webpack_require__(/*! ./import-authorization-evaluate.component.css */ "./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ImportAuthorizationEvaluateComponent);
    return ImportAuthorizationEvaluateComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.css":
/*!**************************************************************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.css ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-forms {\r\n    position: relative;\r\n    margin-top: 1.5rem;\r\n    margin-bottom: 1.5rem;\r\n}\r\n\r\nlabel.required:not(:empty):after,\r\n.field-header.required:after {\r\n    content: \" *\";\r\n    color: red;\r\n    position: absolute;\r\n    right: 0px;\r\n    top: -15px;\r\n}\r\n\r\n.mt-4s {\r\n    padding-top: 45px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.html":
/*!***************************************************************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.html ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Inregistrare cerere</h3>\n  <hr>\n  <div class=\"container\">\n    <form [formGroup]='dataForm'>\n      <div class=\"row\">\n        <div class=\"col-lg-5\">\n          <div class=\"md-form\">\n            <input id=\"nrCererii\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"nrCererii\" [attr.disabled]=\"true\">\n            <label for=\"nrCererii\">Nr. cererii</label>\n          </div>\n        </div>\n\n        <div class=\"col-lg-4\">\n          <div class=\"md-form\">\n            <mat-form-field class=\"w-100\">\n              <input matInput [matDatepicker]=\"picker\" placeholder=\"Data\" formControlName=\"data\">\n              <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n              <mat-datepicker touchUi #picker></mat-datepicker>\n            </mat-form-field>\n          </div>\n        </div>\n        <div class=\"col-lg-3 position-button mt-4s\">\n          <label class=\"btn btn-indigo btn-sm\" for=\"incarcaraFisier\">\n            <input id=\"incarcaraFisier\" type=\"file\" style=\"display:none;\" (change)=\"onChange($event)\" onclick=\"this.value=null;\"> Incarca Cerere\n          </label>\n        </div>\n      </div>\n    </form>\n  </div>\n  <hr>\n  <table class=\"table table-widths text-center\">\n    <thead class=\"black white-text\">\n    <tr>\n      <th scope=\"col\">Denumire</th>\n      <th scope=\"col\">Format</th>\n      <th scope=\"col\">Data incarcarii</th>\n      <th scope=\"col\">Actiuni</th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let x of cereri; let i = index\">\n      <th scope=\"row\">{{ x.denumirea }}</th>\n      <td>{{ x.format }}</td>\n      <td>{{ x.dataIncarcarii }}</td>\n      <td>\n        <button class=\"btn btn-mdb-color btn-sm waves-light\" (click)=\"loadFile()\" mdbWavesEffect>Vizualizare</button>\n        <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" (click)=\"removeDocument(i)\" mdbWavesEffect>Stergere</button>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <hr>\n  <form [formGroup]='rForm'>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-forms\">\n          <mat-form-field class=\"w-100\">\n            <mat-label>Compania solicitant <span class=\"text-danger\">*</span></mat-label>\n            <input type=\"text\" aria-label=\"Number\" [formControl]=\"rForm.controls['compGet']\"\n                   matInput formControlName=\"compGet\" [matAutocomplete]=\"auto\" (ngModelChange)=\"checkCompanyValue()\">\n            <mat-autocomplete #auto=\"matAutocomplete\" [displayWith]=\"displayFn\">\n              <mat-option *ngFor=\"let x of filteredOptions | async\" [value]=\"x\">\n                {{x.name}}\n              </mat-option>\n            </mat-autocomplete>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"med\" mdbInputDirective type=\"text\" class=\"form-control\" formControlName=\"med\">\n          <label for=\"med\">Medicamentul\n            <span class=\"text-danger\">*</span>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"text-center w-100 mt-3\">\n        <div class=\"alert alert-primary\">\n          <span>Nr. de inregistrare a cererii: </span>\n          <strong>{{generatedDocNrSeq}}</strong>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"text-center\">\n      <button class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect (click)=\"nextStep()\">Urmatorul pas</button>\n    </div>\n  </form>\n</div>\n\n\n"

/***/ }),

/***/ "./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.ts":
/*!*************************************************************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.ts ***!
  \*************************************************************************************************************/
/*! exports provided: ImportAuthorizationRequestComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportAuthorizationRequestComponent", function() { return ImportAuthorizationRequestComponent; });
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








var ImportAuthorizationRequestComponent = /** @class */ (function () {
    function ImportAuthorizationRequestComponent(fb, dialog, router, administrationService) {
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
    ImportAuthorizationRequestComponent.prototype.ngOnInit = function () {
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
    ImportAuthorizationRequestComponent.prototype.displayFn = function (user) {
        return user ? user.name : undefined;
    };
    ImportAuthorizationRequestComponent.prototype.onChange = function (event) {
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
    ImportAuthorizationRequestComponent.prototype.removeDocument = function (index) {
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
    ImportAuthorizationRequestComponent.prototype.loadFile = function () {
        Object(file_saver__WEBPACK_IMPORTED_MODULE_7__["saveAs"])(this.file, this.file.name);
    };
    ImportAuthorizationRequestComponent.prototype.chekCompanyValue = function () {
        var _this = this;
        this.isWrongValueCompany = !this.companii.some(function (elem) {
            return _this.rForm.get('compGet').value == null ? true : elem.name === _this.rForm.get('compGet').value.name;
        });
    };
    ImportAuthorizationRequestComponent.prototype.nextStep = function () {
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
    ImportAuthorizationRequestComponent.prototype._filter = function (name) {
        var filterValue = name.toLowerCase();
        return this.companii.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    ImportAuthorizationRequestComponent.prototype.saveToFileSystem = function (response, docName) {
        var blob = new Blob([response]);
        Object(file_saver__WEBPACK_IMPORTED_MODULE_7__["saveAs"])(blob, docName);
    };
    ImportAuthorizationRequestComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-import-authorization-request',
            template: __webpack_require__(/*! ./import-authorization-request.component.html */ "./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.html"),
            styles: [__webpack_require__(/*! ./import-authorization-request.component.css */ "./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _shared_service_administration_service__WEBPACK_IMPORTED_MODULE_4__["AdministrationService"]])
    ], ImportAuthorizationRequestComponent);
    return ImportAuthorizationRequestComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-4/import-authorization-routing.module.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization-routing.module.ts ***!
  \*****************************************************************************/
/*! exports provided: ImportAuthorizationRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportAuthorizationRoutingModule", function() { return ImportAuthorizationRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _import_authorization_request_import_authorization_request_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./import-authorization-request/import-authorization-request.component */ "./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.ts");
/* harmony import */ var _import_authorization_evaluate_import_authorization_evaluate_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./import-authorization-evaluate/import-authorization-evaluate.component */ "./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    { path: 'register', component: _import_authorization_request_import_authorization_request_component__WEBPACK_IMPORTED_MODULE_1__["ImportAuthorizationRequestComponent"] },
    { path: 'evaluate', component: _import_authorization_evaluate_import_authorization_evaluate_component__WEBPACK_IMPORTED_MODULE_2__["ImportAuthorizationEvaluateComponent"] },
];
var ImportAuthorizationRoutingModule = /** @class */ (function () {
    function ImportAuthorizationRoutingModule() {
    }
    ImportAuthorizationRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
        })
    ], ImportAuthorizationRoutingModule);
    return ImportAuthorizationRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-4/import-authorization.module.ts":
/*!*********************************************************************!*\
  !*** ./src/app/all-modules/module-4/import-authorization.module.ts ***!
  \*********************************************************************/
/*! exports provided: ImportAuthorizationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportAuthorizationModule", function() { return ImportAuthorizationModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _import_authorization_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./import-authorization-routing.module */ "./src/app/all-modules/module-4/import-authorization-routing.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _import_authorization_evaluate_import_authorization_evaluate_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./import-authorization-evaluate/import-authorization-evaluate.component */ "./src/app/all-modules/module-4/import-authorization-evaluate/import-authorization-evaluate.component.ts");
/* harmony import */ var _import_authorization_request_import_authorization_request_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./import-authorization-request/import-authorization-request.component */ "./src/app/all-modules/module-4/import-authorization-request/import-authorization-request.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var ImportAuthorizationModule = /** @class */ (function () {
    function ImportAuthorizationModule() {
    }
    ImportAuthorizationModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _import_authorization_routing_module__WEBPACK_IMPORTED_MODULE_2__["ImportAuthorizationRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_5__["MaterialSharedModule"].forRoot(),
            ],
            declarations: [_import_authorization_evaluate_import_authorization_evaluate_component__WEBPACK_IMPORTED_MODULE_6__["ImportAuthorizationEvaluateComponent"], _import_authorization_request_import_authorization_request_component__WEBPACK_IMPORTED_MODULE_7__["ImportAuthorizationRequestComponent"]]
        })
    ], ImportAuthorizationModule);
    return ImportAuthorizationModule;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-4-import-authorization-module.js.map