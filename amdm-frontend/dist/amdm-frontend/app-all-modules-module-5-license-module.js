(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-5-license-module"],{

/***/ "./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.css":
/*!********************************************************************************************!*\
  !*** ./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.css ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n    <h3 class=\"text-center my-3 font-weight-bold\">Evaluarea cererii de licentiere</h3>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Scopul cererii</h5>\n    <hr>\n    <mat-radio-group [(ngModel)]=\"model\">\n        <div class=\"text-center\">\n            <div class=\"row\">\n                <div class=\"col-md-4\">\n                    <mat-radio-button name=\"prop1\" value=\"A\">Eliberarea licentei</mat-radio-button>\n                </div>\n                <div class=\"col-md-4\">\n                    <mat-radio-button name=\"prop2\" value=\"B\">Modificarea licentei</mat-radio-button>\n                </div>\n                <div class=\"col-md-4\">\n                    <mat-radio-button name=\"prop3\" value=\"C\">Eliberarea duplicatului</mat-radio-button>\n                </div>\n            </div>\n        </div>\n    </mat-radio-group>\n    <hr>\n    <table class=\"table table-widths text-center\">\n        <thead class=\"black white-text\">\n            <tr>\n                <th scope=\"col\">Denumire</th>\n                <th scope=\"col\">Format</th>\n                <th scope=\"col\">Data incarcarii</th>\n                <th scope=\"col\">Actiuni</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr *ngFor=\"let x of cerere\">\n                <th scope=\"row\">{{ x.denumirea }}</th>\n                <td>{{ x.format }}</td>\n                <td>{{ x.dataIncarcarii }}</td>\n                <td>\n                    <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n                    <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <section *ngIf=\"model === 'A'\">\n        <hr>\n        <h5 class=\"text-center font-weight-bold\">Eliberarea licentei</h5>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"adresaObcLicen\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"adresaObcLicen\">Adresa obiectului licenţierii</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"farmDir\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"farmDir\">Farmacist diriginte (cu istoria)</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"decizieLuata\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"decizieLuata\">Decizia luată</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data deciziei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker2></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"argumentDec\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"argumentDec\">Argumentarea deciziei</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <mat-checkbox [(ngModel)]=\"taxa\">Taxa</mat-checkbox>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"seriaLic\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"seriaLic\">Seria licenţei</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"nrLicent\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrLicent\">Nr. licenţei</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data eliberării licenţei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker3></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker5\" placeholder=\"Data sistării activităţii farmaceutice\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker5\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker5></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"motivulSistarii\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"motivulSistarii\">Motivul sistării</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker7\" placeholder=\"Data anunţării CPCD\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker7\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker7></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Metoda anunţării CPCD\" [(ngModel)]=\"selectCpCD\">\n                            <mat-option *ngFor=\"let x of cpcd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectCpCD === 'eMail'\">\n                <div class=\"md-form\">\n                    <input id=\"email1\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"email1\">Email</label>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectCpCD === 'phone'\">\n                <div class=\"md-form\">\n                    <input id=\"telefon1\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"telefon1\">Telefon</label>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker6\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker6\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker6></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Metoda anunţării ASP\" [(ngModel)]=\"selectAsp\">\n                            <mat-option *ngFor=\"let x of cpcd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectAsp === 'phone'\">\n                <div class=\"md-form\">\n                    <input id=\"email\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"email\">Email</label>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectAsp === 'eMail'\">\n                <div class=\"md-form\">\n                    <input id=\"telefon\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"telefon\">Telefon</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"mnrIntrareCPCD\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"mnrIntrareCPCD\">MNr. de intrare a răspunsului CPCD</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker9\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker9\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker9></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"nrRasASP\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrRasASP\">Nr. de intrare a răspunsului ASP</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker8\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker8\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker8></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <hr>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"persLic\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"persLic\">Persoana căruia sa eliberat licenţa </label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker10\" placeholder=\"Data eliberării licenţei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker10\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker10></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"nrProcurii\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrProcurii\">Nr. procurii</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker11\" placeholder=\"Data eliberării procurii\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker11\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker11></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n    </section>\n    <section *ngIf=\"model === 'B'\">\n        <hr>\n        <h5 class=\"text-center font-weight-bold\">Modificarea licentei</h5>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"adresaObcLicen2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"adresaObcLicen2\">Adresa obiectului licenţierii</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"farmDir2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"farmDir2\">Farmacist diriginte (cu istoria)</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"decizieLuata2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"decizieLuata2\">Decizia luată</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data deciziei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker2></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"argumentDec2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"argumentDec2\">Argumentarea deciziei</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <mat-checkbox [(ngModel)]=\"taxa\">Taxa</mat-checkbox>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"seriaLic2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"seriaLic2\">Seria licenţei</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"nrLicent2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrLicent2\">Nr. licenţei</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data eliberării licenţei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker3></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker5\" placeholder=\"Data sistării activităţii farmaceutice\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker5\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker5></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"motivulSistarii2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"motivulSistarii2\">Motivul sistării</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker7\" placeholder=\"Data anunţării CPCD\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker7\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker7></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Metoda anunţării CPCD\" [(ngModel)]=\"selectCpCD\">\n                            <mat-option *ngFor=\"let x of cpcd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectCpCD === 'eMail'\">\n                <div class=\"md-form\">\n                    <input id=\"email2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"email2\">Email</label>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectCpCD === 'phone'\">\n                <div class=\"md-form\">\n                    <input id=\"telefon2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"telefon2\">Telefon</label>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker6\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker6\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker6></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Metoda anunţării ASP\" [(ngModel)]=\"selectAsp\">\n                            <mat-option *ngFor=\"let x of cpcd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectAsp === 'eMail'\">\n                <div class=\"md-form\">\n                    <input id=\"email3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"email3\">Email</label>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectAsp === 'phone'\">\n                <div class=\"md-form\">\n                    <input id=\"telefon3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"telefon3\">Telefon</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"mnrIntrareCPCD2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"mnrIntrareCPCD2\">MNr. de intrare a răspunsului CPCD</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker9\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker9\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker9></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"nrRasASP2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrRasASP2\">Nr. de intrare a răspunsului ASP</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker8\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker8\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker8></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"persLic2\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"persLic2\">Persoana căruia sa eliberat licenţa </label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker10\" placeholder=\"Data eliberării licenţei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker10\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker10></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"nrLicent3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrLicent3\">Nr. procurii</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker11\" placeholder=\"Data eliberării procurii\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker11\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker11></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n    </section>\n    <section *ngIf=\"model === 'C'\">\n        <hr>\n        <h5 class=\"text-center font-weight-bold\">Eliberarea duplicatului</h5>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"adresaObcLicen3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"adresaObcLicen3\">Adresa obiectului licenţierii</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"farmDir3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"farmDir3\">Farmacist diriginte (cu istoria)</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"decizieLuata3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"decizieLuata3\">Decizia luată</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data deciziei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker2></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"argumentDec3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"argumentDec3\">Argumentarea deciziei</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <mat-checkbox [(ngModel)]=\"taxa\">Taxa</mat-checkbox>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"seriaLic3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"seriaLic3\">Seria licenţei</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form\">\n                    <input id=\"nrLicent4\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrLicent4\">Nr. licenţei</label>\n                </div>\n            </div>\n            <div class=\"col-md-4\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data eliberării licenţei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker3></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker5\" placeholder=\"Data sistării activităţii farmaceutice\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker5\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker5></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"motivulSistarii3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"motivulSistarii3\">Motivul sistării</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker7\" placeholder=\"Data anunţării CPCD\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker7\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker7></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Metoda anunţării CPCD\" [(ngModel)]=\"selectCpCD\">\n                            <mat-option *ngFor=\"let x of cpcd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectCpCD === 'eMail'\">\n                <div class=\"md-form\">\n                    <input id=\"email4\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"email4\">Email</label>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectCpCD === 'phone'\">\n                <div class=\"md-form\">\n                    <input id=\"telefon4\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"telefon4\">Telefon</label>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker6\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker6\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker6></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"md-form\">\n                    <mat-form-field class=\"w-100\">\n                        <mat-select placeholder=\"Metoda anunţării ASP\" [(ngModel)]=\"selectAsp\">\n                            <mat-option *ngFor=\"let x of cpcd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n                        </mat-select>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectAsp === 'eMail'\">\n                <div class=\"md-form\">\n                    <input id=\"email5\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"email5\">Email</label>\n                </div>\n            </div>\n            <div class=\"col-md-12\" *ngIf=\"selectAsp === 'phone'\">\n                <div class=\"md-form\">\n                    <input id=\"telefon5\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"telefon5\">Telefon</label>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"mnrIntrareCPCD3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"mnrIntrareCPCD3\">MNr. de intrare a răspunsului CPCD</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker9\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker9\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker9></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"nrRasASP3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrRasASP3\">Nr. de intrare a răspunsului ASP</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker8\" placeholder=\"Data anunţării ASP\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker8\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker8></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n        <hr>\n        <div class=\"row\">\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"persLic3\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"persLic3\">Persoana căruia sa eliberat licenţa </label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker10\" placeholder=\"Data eliberării licenţei\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker10\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker10></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form\">\n                    <input id=\"nrLicent5\" mdbInputDirective type=\"text\" class=\"form-control\">\n                    <label for=\"nrLicent5\">Nr. procurii</label>\n                </div>\n            </div>\n            <div class=\"col-md-3\">\n                <div class=\"md-form-modified\">\n                    <mat-form-field class=\"w-100\">\n                        <input matInput [matDatepicker]=\"picker11\" placeholder=\"Data eliberării procurii\">\n                        <mat-datepicker-toggle matSuffix [for]=\"picker11\"></mat-datepicker-toggle>\n                        <mat-datepicker touchUi #picker11></mat-datepicker>\n                    </mat-form-field>\n                </div>\n            </div>\n        </div>\n    </section>\n    <div class=\"text-center\">\n        <button type=\"submit\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Confirmare\n        </button>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: EvaluareCerereLicComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EvaluareCerereLicComponent", function() { return EvaluareCerereLicComponent; });
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

var EvaluareCerereLicComponent = /** @class */ (function () {
    function EvaluareCerereLicComponent() {
        this.cerere = [
            { denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.cpcd = [
            { value: 'none', viewValue: 'None' },
            { value: 'eMail', viewValue: 'Email' },
            { value: 'phone', viewValue: 'Phone' },
        ];
    }
    EvaluareCerereLicComponent.prototype.ngOnInit = function () {
        this.model = 'A';
    };
    EvaluareCerereLicComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-evaluare-cerere-lic',
            template: __webpack_require__(/*! ./evaluare-cerere-lic.component.html */ "./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.html"),
            styles: [__webpack_require__(/*! ./evaluare-cerere-lic.component.css */ "./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], EvaluareCerereLicComponent);
    return EvaluareCerereLicComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-5/license-routing.module.ts":
/*!****************************************************************!*\
  !*** ./src/app/all-modules/module-5/license-routing.module.ts ***!
  \****************************************************************/
/*! exports provided: LicenseRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LicenseRoutingModule", function() { return LicenseRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _reg_med_cerere_lic_reg_med_cerere_lic_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reg-med-cerere-lic/reg-med-cerere-lic.component */ "./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.ts");
/* harmony import */ var _evaluare_cerere_lic_evaluare_cerere_lic_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./evaluare-cerere-lic/evaluare-cerere-lic.component */ "./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    { path: 'register', component: _reg_med_cerere_lic_reg_med_cerere_lic_component__WEBPACK_IMPORTED_MODULE_2__["RegMedCerereLicComponent"] },
    { path: 'evaluate', component: _evaluare_cerere_lic_evaluare_cerere_lic_component__WEBPACK_IMPORTED_MODULE_3__["EvaluareCerereLicComponent"] },
];
var LicenseRoutingModule = /** @class */ (function () {
    function LicenseRoutingModule() {
    }
    LicenseRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], LicenseRoutingModule);
    return LicenseRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-5/license.module.ts":
/*!********************************************************!*\
  !*** ./src/app/all-modules/module-5/license.module.ts ***!
  \********************************************************/
/*! exports provided: LicenseModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LicenseModule", function() { return LicenseModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _license_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./license-routing.module */ "./src/app/all-modules/module-5/license-routing.module.ts");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _reg_med_cerere_lic_reg_med_cerere_lic_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reg-med-cerere-lic/reg-med-cerere-lic.component */ "./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.ts");
/* harmony import */ var _evaluare_cerere_lic_evaluare_cerere_lic_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./evaluare-cerere-lic/evaluare-cerere-lic.component */ "./src/app/all-modules/module-5/evaluare-cerere-lic/evaluare-cerere-lic.component.ts");
/* harmony import */ var _document_document_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../document/document.component */ "./src/app/document/document.component.ts");
/* harmony import */ var _shared_service_upload_upload_file_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/service/upload/upload-file.service */ "./src/app/shared/service/upload/upload-file.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var LicenseModule = /** @class */ (function () {
    function LicenseModule() {
    }
    LicenseModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _license_routing_module__WEBPACK_IMPORTED_MODULE_2__["LicenseRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_3__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_5__["MaterialSharedModule"].forRoot(),
            ],
            schemas: [],
            declarations: [_reg_med_cerere_lic_reg_med_cerere_lic_component__WEBPACK_IMPORTED_MODULE_6__["RegMedCerereLicComponent"],
                _evaluare_cerere_lic_evaluare_cerere_lic_component__WEBPACK_IMPORTED_MODULE_7__["EvaluareCerereLicComponent"],
                _document_document_component__WEBPACK_IMPORTED_MODULE_8__["DocumentComponent"]
            ],
            providers: [_shared_service_upload_upload_file_service__WEBPACK_IMPORTED_MODULE_9__["UploadFileService"]
            ],
        })
    ], LicenseModule);
    return LicenseModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.css":
/*!******************************************************************************************!*\
  !*** ./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.css ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".md-form-modified {\r\n  position: relative;\r\n  margin-top: 10px;\r\n  margin-bottom: 1.5rem;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid sky z-depth-2\">\n  <h3 class=\"text-center my-3 font-weight-bold\">Inregistrarea cererii de licentiere</h3>\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Scopul cererii</h5>\n  <hr>\n  <mat-radio-group [(ngModel)]=\"model\">\n    <div class=\"text-center\">\n      <div class=\"container\">\n        <div class=\"row\">\n          <div class=\"col-md-4\">\n            <mat-radio-button name=\"prop1\" value=\"A\">Eliberarea licentei</mat-radio-button>\n          </div>\n          <div class=\"col-md-4\">\n            <mat-radio-button name=\"prop2\" value=\"B\">Modificarea licentei</mat-radio-button>\n          </div>\n          <div class=\"col-md-4\">\n            <mat-radio-button name=\"prop3\" value=\"C\">Eliberarea duplicatului</mat-radio-button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </mat-radio-group>\n  <hr>\n    <table class=\"table table-widths text-center\">\n      <thead class=\"black white-text\">\n        <tr>\n          <th scope=\"col\">Denumire</th>\n          <th scope=\"col\">Format</th>\n          <th scope=\"col\">Data incarcarii</th>\n          <th scope=\"col\">Actiuni</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr *ngFor=\"let x of cerere\">\n          <th scope=\"row\">{{ x.denumirea }}</th>\n          <td>{{ x.format }}</td>\n          <td>{{ x.dataIncarcarii }}</td>\n          <td>\n            <button class=\"btn btn-mdb-color btn-sm waves-light\" mdbWavesEffect>View</button>\n            <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" mdbWavesEffect>Delete</button>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  <section *ngIf=\"model === 'A'\">\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Eliberarea licentei</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput placeholder=\"Nr.Cererii\" value=\"C12345\" [disabled]=\"true\">\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data eliberarii\" [formControl]=\"date\" [disabled]=\"true\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker2></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Compania solicitant\">\n              <mat-option *ngFor=\"let x of compania\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"adresa\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"adresa\">Adresa</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"idno\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"idno\">IDNO</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"telefonContact\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"telefonContact\">Telefon de contact</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"emailContact\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"emailContact\">Email de contact</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"persResDepCererii\" mdbInputDirective type=\"email\" class=\"form-control\">\n          <label for=\"persResDepCererii\">Persoana responsabilă de depunere a cererii</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"nrProcurii1\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrProcurii1\">Nr. procurii</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data eliberării procurii\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker3></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Tipul cererii\">\n              <mat-option *ngFor=\"let x of tipCerere\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n  </section>\n  <section *ngIf=\"model === 'B'\">\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Modificarea licentei</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"adresaobcLic\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"adresaobcLic\">Adresa obiectului licenţierii</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"farmDir\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"farmDir\">Farmacist diriginte</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"decLuata\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"decLuata\">Decizia luată</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker2\" placeholder=\"Data deciziei\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker2></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Argumentarea deciziei\">\n              <mat-option *ngFor=\"let x of compania\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <mat-checkbox [(ngModel)]=\"taxa\" class=\"mt-3\">Taxa</mat-checkbox>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">Licenţa</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"seria\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"seria\">Seria</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form\">\n          <input id=\"nr\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nr\">Nr.</label>\n        </div>\n      </div>\n      <div class=\"col-md-4\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker3\" placeholder=\"Data eliberării licenţei\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker3\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker3></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker4\" placeholder=\"Data sistării activităţii farmaceutice\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker4\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker4></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"motSistarii\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"motSistarii\">Motivul sistării</label>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">CPCD</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker5\" placeholder=\"Data anunţării\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker5\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker5></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Metoda anunţării\" [(ngModel)]=\"selectCPCD\">\n              <mat-option *ngFor=\"let x of cpcd\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-12\" *ngIf=\"selectCPCD === 'Email'\">\n        <div class=\"md-form\">\n          <input id=\"email1\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"email1\">Email</label>\n        </div>\n      </div>\n      <div class=\"col-md-12\" *ngIf=\"selectCPCD === 'phone'\">\n        <div class=\"md-form\">\n          <input id=\"telefon1\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"telefon1\">Telefon</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"nrIntrareRas1\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrIntrareRas1\">Nr. de intrare a răspunsului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker7\" placeholder=\"Data de intrare a răspunsului\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker7\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker7></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <h5 class=\"text-center font-weight-bold\">ASP</h5>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker6\" placeholder=\"Data anunţării\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker6\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker6></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <mat-form-field class=\"w-100\">\n            <mat-select placeholder=\"Metoda anunţării\" [(ngModel)]=\"selectASP\">\n              <mat-option *ngFor=\"let x of asp\" [value]=\"x.value\">{{ x.viewValue }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-12\" *ngIf=\"selectASP === 'Email'\">\n        <div class=\"md-form\">\n          <input id=\"email\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"email\">Email</label>\n        </div>\n      </div>\n      <div class=\"col-md-12\" *ngIf=\"selectASP === 'phone'\">\n        <div class=\"md-form\">\n          <input id=\"telefon\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"telefon\">Telefon</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form\">\n          <input id=\"nrIntrareRas\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrIntrareRas\">Nr. de intrare a răspunsului</label>\n        </div>\n      </div>\n      <div class=\"col-md-6\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker8\" placeholder=\"Data de intrare a răspunsului\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker8\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker8></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n</section>\n<section *ngIf=\"model === 'C'\">\n  <hr>\n  <h5 class=\"text-center font-weight-bold\">Eliberarea duplicatului</h5>\n  <hr>\n    <div class=\"row\">\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"persElibLic\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"persElibLic\">Persoana căruia sa eliberat licenţa</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker9\" placeholder=\"Data eliberării licenţei\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker9\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker9></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form\">\n          <input id=\"nrProcurii\" mdbInputDirective type=\"text\" class=\"form-control\">\n          <label for=\"nrProcurii\">Nr. procurii</label>\n        </div>\n      </div>\n      <div class=\"col-md-3\">\n        <div class=\"md-form-modified\">\n          <mat-form-field class=\"w-100\">\n            <input matInput [matDatepicker]=\"picker10\" placeholder=\"Data eliberării procurii\">\n            <mat-datepicker-toggle matSuffix [for]=\"picker10\"></mat-datepicker-toggle>\n            <mat-datepicker touchUi #picker10></mat-datepicker>\n          </mat-form-field>\n        </div>\n      </div>\n    </div>\n    <hr>\n  </section>\n  <div class=\"text-center\">\n    <button type=\"submit\" class=\"btn btn-dark-green-color waves-light btn-sm btn-sm-bl\" mdbWavesEffect>Confirmare</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: RegMedCerereLicComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegMedCerereLicComponent", function() { return RegMedCerereLicComponent; });
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


var RegMedCerereLicComponent = /** @class */ (function () {
    function RegMedCerereLicComponent() {
        this.date = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]({ value: new Date(), disabled: true });
        this.cerere = [
            { denumirea: 'Test 1', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '04.05.2018' },
            { denumirea: 'Test 2', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '05.05.2018' },
            { denumirea: 'Test 3', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '06.05.2018' },
            { denumirea: 'Test 4', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '07.05.2018' },
            { denumirea: 'Test 5', format: '*.pdf, *.doc, *.docx', dataIncarcarii: '08.05.2018' }
        ];
        this.compania = [
            { value: '1', viewValue: 'A SRL' },
            { value: '2', viewValue: 'B SRL' },
            { value: '3', viewValue: 'C SRL' },
        ];
        this.tipCerere = [
            { value: '1', viewValue: 'Tip 1' },
            { value: '2', viewValue: 'Tip 2' },
            { value: '3', viewValue: 'Tip 3' },
        ];
        this.cpcd = [
            { value: 'none', viewValue: 'None' },
            { value: 'Email', viewValue: 'Email' },
            { value: 'phone', viewValue: 'Phone' },
        ];
        this.asp = [
            { value: 'none', viewValue: 'None' },
            { value: 'Email', viewValue: 'Email' },
            { value: 'phone', viewValue: 'Phone' },
        ];
    }
    RegMedCerereLicComponent.prototype.ngOnInit = function () {
        this.model = 'A';
    };
    RegMedCerereLicComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-reg-med-cerere-lic',
            template: __webpack_require__(/*! ./reg-med-cerere-lic.component.html */ "./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.html"),
            styles: [__webpack_require__(/*! ./reg-med-cerere-lic.component.css */ "./src/app/all-modules/module-5/reg-med-cerere-lic/reg-med-cerere-lic.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], RegMedCerereLicComponent);
    return RegMedCerereLicComponent;
}());



/***/ }),

/***/ "./src/app/document/document.component.css":
/*!*************************************************!*\
  !*** ./src/app/document/document.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/document/document.component.html":
/*!**************************************************!*\
  !*** ./src/app/document/document.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<table class=\"table table-widths text-center\">\n  <thead class=\"black white-text\">\n  <tr>\n    <th scope=\"col\">Denumire</th>\n    <th scope=\"col\">Format</th>\n    <th scope=\"col\">Data incarcarii</th>\n    <th scope=\"col\">Actiuni</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr *ngFor=\"let doc of documents;let i = index\">\n    <th scope=\"row\">{{ doc.name }}</th>\n    <td>{{ doc.format }}</td>\n    <td>{{ doc.uploadDate | date: 'dd/MM/yyyy HH:mm:ss' }}</td>\n    <td>\n      <button class=\"btn btn-mdb-color btn-sm waves-light\" (click)=\"loadFile(doc.path)\" mdbWavesEffect >View</button>\n      <button class=\"btn btn-dark-red-color waves-light btn-sm waves-light\" (click)=\"removeDocument(i)\" mdbWavesEffect>Delete</button>\n    </td>\n  </tr>\n  </tbody>\n</table>\n<div class=\"col position-button\">\n  <label for=\"incarcaFisier\" class=\"btn btn-indigo btn-sm\">\n   <!-- <app-file-upload  (notify)=\"onNotify($event)\"></app-file-upload>-->\n    <input id=\"incarcaFisier\" type=\"file\" style=\"display:none;\" (click)=\"this.value=null;\" (change)=\"addDocument($event)\"> Incarcă Document\n  </label>\n</div>\n"

/***/ }),

/***/ "./src/app/document/document.component.ts":
/*!************************************************!*\
  !*** ./src/app/document/document.component.ts ***!
  \************************************************/
/*! exports provided: DocumentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentComponent", function() { return DocumentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../confirmation-dialog/confirmation-dialog.component */ "./src/app/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _shared_service_upload_upload_file_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/service/upload/upload-file.service */ "./src/app/shared/service/upload/upload-file.service.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_5__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DocumentComponent = /** @class */ (function () {
    function DocumentComponent(dialog, uploadService) {
        this.dialog = dialog;
        this.uploadService = uploadService;
        this.subscriptions = [];
    }
    DocumentComponent.prototype.ngOnInit = function () {
    };
    DocumentComponent.prototype.removeDocument = function (index) {
        var _this = this;
        var dialogRef = this.dialog.open(_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_1__["ConfirmationDialogComponent"], {
            data: { message: 'Sunteti sigur ca doriti sa stergeti acest document?', confirm: false }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.subscriptions.push(_this.uploadService.removeFileFromStorage(_this.documents[index].path).subscribe(function (data) {
                    _this.documents.splice(index, 1);
                }, function (error) {
                    console.log(error);
                }));
            }
        });
    };
    DocumentComponent.prototype.loadFile = function (path) {
        var _this = this;
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(function (data) {
            // alert('ghfj', data, path);
            _this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
        }, function (error) {
            console.log(error);
        }));
    };
    DocumentComponent.prototype.saveToFileSystem = function (response, docName) {
        var blob = new Blob([response]);
        Object(file_saver__WEBPACK_IMPORTED_MODULE_5__["saveAs"])(blob, docName);
    };
    DocumentComponent.prototype.addDocument = function (event) {
        var _this = this;
        console.log('enter');
        this.subscriptions.push(this.uploadService.pushFileToStorage(event.srcElement.files[0]).subscribe(function (event) {
            if (event instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpResponse"]) {
                _this.result = event.body;
                var indexForName = _this.result.path.lastIndexOf('/');
                var indexForFormat = _this.result.path.lastIndexOf('.');
                var fileName = _this.result.path.substring(indexForName + 1);
                var fileFormat = '';
                if (indexForFormat !== -1) {
                    fileFormat = '*.' + _this.result.path.substring(indexForFormat + 1);
                }
                _this.documents.push({ name: fileName,
                    format: fileFormat,
                    uploadDate: new Date(),
                    path: _this.result.path,
                    isOld: false });
            }
        }, function (error) {
            console.log(error);
        }));
    };
    DocumentComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], DocumentComponent.prototype, "documents", void 0);
    DocumentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-document',
            template: __webpack_require__(/*! ./document.component.html */ "./src/app/document/document.component.html"),
            styles: [__webpack_require__(/*! ./document.component.css */ "./src/app/document/document.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"], _shared_service_upload_upload_file_service__WEBPACK_IMPORTED_MODULE_4__["UploadFileService"]])
    ], DocumentComponent);
    return DocumentComponent;
}());



/***/ }),

/***/ "./src/app/shared/service/upload/upload-file.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/shared/service/upload/upload-file.service.ts ***!
  \**************************************************************/
/*! exports provided: UploadFileService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UploadFileService", function() { return UploadFileService; });
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


var UploadFileService = /** @class */ (function () {
    function UploadFileService(http) {
        this.http = http;
    }
    UploadFileService.prototype.pushFileToStorage = function (file) {
        var formdata = new FormData();
        formdata.append('file', file);
        var req = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpRequest"]('POST', '/api/documents/pushTmpFile', formdata, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);
    };
    UploadFileService.prototype.removeFileFromStorage = function (relativeFolder) {
        return this.http.get('/api/documents/removeTmpFile', { params: { relativeFolder: relativeFolder }, observe: 'response' });
    };
    UploadFileService.prototype.loadFile = function (relativePath) {
        return this.http.get('/api/documents/view-document', { params: { relativePath: relativePath }, responseType: 'blob' });
    };
    UploadFileService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], UploadFileService);
    return UploadFileService;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-5-license-module.js.map