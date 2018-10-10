(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-all-modules-module-6-nomenclature-module"],{

/***/ "./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.css":
/*!********************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.css ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".table-width {\r\n  width: 100%;\r\n  }\r\nth, td {\r\n  text-align: center !important;\r\n}\r\nmat-header-cell {\r\n  display:flex;\r\n  justify-content:flex-end;\r\n }\r\n::ng-deep .mat-sort-header-container {\r\n  display:flex;\r\n  justify-content:center;\r\n}\r\n.pr-search {\r\n  padding-right: 30px;\r\n}\r\n.modal-open .modal {\r\n  overflow-y: auto;\r\n}\r\n.example-container {\r\n  width: 100%;\r\n  overflow: auto;\r\n}\r\ntable {\r\n  width: 2800px;\r\n}\r\n.modal {\r\n  overflow-y:auto;\r\n}\r\n.darkBlue {\r\n  background: #122f3b;\r\n}\r\nnav {\r\nwidth: 650px;\r\nmargin: 0 auto;\r\nbackground: #122f3b;\r\nborder-radius: 5px;\r\n}\r\nul {\r\n  list-style: none;\r\n  padding: 0px;\r\n}\r\nul li {\r\n  font-size: 18px;\r\n  padding: 10px 0px 10px 15px;\r\n}\r\nul li:hover {\r\n  background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\nul li a {\r\n  color: #fff;\r\n}\r\nul li a:hover {\r\n  color: #fff;\r\n}\r\n.active {\r\n    background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\n"

/***/ }),

/***/ "./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid z-depth-2 sky\">\n\n  <nav>\n    <ul>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/price-catalog\">Nomenclatorul medicamentului</a></li>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-classifier\">Clasificatorul medicamentului</a></li>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/economic-agents-classifier\">Catalogul national de preturi de producator la medicamente</a></li>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-nomenclature\">Clasificatorul agentilor economici cu gen de activitate farmaceutica</a></li>\n    </ul>\n  </nav>\n\n  <div class=\"table-width\">\n    <div class=\"text-right\">\n      <mat-form-field class=\"w-50\">\n        <input matInput (keyup)=\"applyFilter($event.target.value)\" placeholder=\"Search\" class=\"w-50\">\n      </mat-form-field>\n    </div>\n    <hr>\n    <div class=\"example-container\">\n      <table mat-table [dataSource]=\"dataSource\" matSort>\n        <ng-container matColumnDef=\"id\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> ID </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.id}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codMedicament\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul medicamentului </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codMedicament}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codVamal\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul vamal </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codVamal}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"denumireComerciala\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Denumirea comerciala </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.denumireComerciala}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"formaFarmaceutica\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Forma farmaceutica </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.formaFarmaceutica}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"dozaConcentratia\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Doza, concentratia </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.dozaConcentratia}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"volum\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Volum </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.volum}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"divizarea\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Divizarea </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.divizarea}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"tara\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Tara </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.tara}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"firmaProducatoare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Firma producatoare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.firmaProducatoare}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"nrDeInregistrare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Nr. de inregistrare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.nrDeInregistrare}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"dataDeInregistrare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Data de inregistrare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.dataDeInregistrare | date: 'dd/MM/yyyy'}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codulATC\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul ATC </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codulATC}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"denumireaComunaInternationala\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Denumirea comuna\n            internationala </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.denumireaComunaInternationala}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"termenulDeValabilitate\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Termenul de valabilitate </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.termenulDeValabilitate}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codulDeBare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul de bare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codulDeBare}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"pretDeProducatorMDL\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Pret de producator (MDL) </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.pretDeProducatorMDL}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"pretDeProducatorValuta\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Pret de producator (Valuta)\n          </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.pretDeProducatorValuta}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"valuta\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Valuta </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.valuta}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"nrSiDataOrdinuluiDeAprobareAPretului\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Nr. si data ordinului de\n            aprobare a pretului </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.nrSiDataOrdinuluiDeAprobareAPretului}} </td>\n        </ng-container>\n\n        <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n        <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n      </table>\n    </div>\n\n    <mat-paginator [pageSizeOptions]=\"[5, 10, 25, 100]\"></mat-paginator>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: CatalogPriceDrugsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CatalogPriceDrugsComponent", function() { return CatalogPriceDrugsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ELEMENT_DATA = [
    { id: 1, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 2, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI2', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 3, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI3', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 4, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI4', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 5, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI5', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 6, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI6', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 7, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI7', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 8, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI8', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 9, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI9', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
    { id: 10, codMedicament: 'CM12345', codVamal: 'CV12345', denumireComerciala: 'DM12345', formaFarmaceutica: 'FM12345', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr12345', dataDeInregistrare: new Date(), codulATC: 'CATC12345', denumireaComunaInternationala: 'DCI10', termenulDeValabilitate: '24 luni', codulDeBare: 'CB12345', pretDeProducatorMDL: 123456, pretDeProducatorValuta: '255', valuta: 'Dolari', nrSiDataOrdinuluiDeAprobareAPretului: 'NDOApr12345' },
];
var CatalogPriceDrugsComponent = /** @class */ (function () {
    function CatalogPriceDrugsComponent() {
        this.displayedColumns = ['id', 'codMedicament', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'dozaConcentratia', 'volum', 'divizarea', 'tara', 'firmaProducatoare', 'nrDeInregistrare', 'dataDeInregistrare', 'codulATC', 'denumireaComunaInternationala', 'termenulDeValabilitate', 'codulDeBare', 'pretDeProducatorMDL', 'pretDeProducatorValuta', 'valuta', 'nrSiDataOrdinuluiDeAprobareAPretului'];
        this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatTableDataSource"](ELEMENT_DATA);
    }
    CatalogPriceDrugsComponent.prototype.ngOnInit = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    CatalogPriceDrugsComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"])
    ], CatalogPriceDrugsComponent.prototype, "paginator", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"])
    ], CatalogPriceDrugsComponent.prototype, "sort", void 0);
    CatalogPriceDrugsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-catalog-price-drugs',
            template: __webpack_require__(/*! ./catalog-price-drugs.component.html */ "./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.html"),
            styles: [__webpack_require__(/*! ./catalog-price-drugs.component.css */ "./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], CatalogPriceDrugsComponent);
    return CatalogPriceDrugsComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".table-width {\r\n  width: 100%;\r\n  }\r\nth, td {\r\n  text-align: center !important;\r\n}\r\nmat-header-cell {\r\n  display:flex;\r\n  justify-content:flex-end;\r\n }\r\n::ng-deep .mat-sort-header-container {\r\n  display:flex;\r\n  justify-content:center;\r\n}\r\n.pr-search {\r\n  padding-right: 30px;\r\n}\r\n.modal-open .modal {\r\n  overflow-y: auto;\r\n}\r\n.example-container {\r\n  width: 100%;\r\n  overflow: auto;\r\n}\r\ntable {\r\n  width: 2800px;\r\n}\r\n.modal {\r\n  overflow-y:auto;\r\n}\r\n.darkBlue {\r\n  background: #122f3b;\r\n}\r\nnav {\r\nwidth: 650px;\r\nmargin: 0 auto;\r\nbackground: #122f3b;\r\nborder-radius: 5px;\r\n}\r\nul {\r\n  list-style: none;\r\n  padding: 0px;\r\n}\r\nul li {\r\n  font-size: 18px;\r\n  padding: 10px 0px 10px 15px;\r\n}\r\nul li:hover {\r\n  background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\nul li a {\r\n  color: #fff;\r\n}\r\nul li a:hover {\r\n  color: #fff;\r\n}\r\n.active {\r\n    background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\n"

/***/ }),

/***/ "./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid z-depth-2 sky\">\n\n  <nav>\n    <ul>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/price-catalog\">Nomenclatorul medicamentului</a></li>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-classifier\">Clasificatorul medicamentului</a></li>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/economic-agents-classifier\">Catalogul national de preturi de producator la medicamente</a></li>\n      <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-nomenclature\">Clasificatorul agentilor economici cu gen de activitate farmaceutica</a></li>\n    </ul>\n  </nav>\n\n  <div class=\"table-width\">\n    <div class=\"text-right\">\n      <mat-form-field class=\"w-50\">\n        <input matInput (keyup)=\"applyFilter($event.target.value)\" placeholder=\"Search\" class=\"w-50\">\n      </mat-form-field>\n    </div>\n    <hr>\n    <div class=\"example-container\">\n      <table mat-table [dataSource]=\"dataSource\" matSort>\n        <ng-container matColumnDef=\"id\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> ID </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.id}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codMedicament\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul medicamentului </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codMedicament}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codVamal\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul vamal </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codVamal}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"denumireComerciala\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Denumirea comerciala </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.denumireComerciala}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"formaFarmaceutica\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Forma farmaceutica </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.formaFarmaceutica}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"dozaConcentratia\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Doza, concentratia </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.dozaConcentratia}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"volum\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Volum </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.volum}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"divizarea\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Divizarea </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.divizarea}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"tara\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Tara </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.tara}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"firmaProducatoare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Firma producatoare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.firmaProducatoare}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"nrDeInregistrare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Nr. de inregistrare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.nrDeInregistrare}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"dataDeInregistrare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Data de inregistrare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.dataDeInregistrare | date: 'dd/MM/yyyy'}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codulATC\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul ATC </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codulATC}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"denumireaComunaInternationala\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Denumirea comuna\n            internationala </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.denumireaComunaInternationala}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"termenulDeValabilitate\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Termenul de valabilitate </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.termenulDeValabilitate}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"codulDeBare\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Codul de bare </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.codulDeBare}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"pretDeProducatorMDL\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Pret de producator (MDL) </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.pretDeProducatorMDL}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"pretDeProducatorValuta\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Pret de producator (Valuta)\n          </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.pretDeProducatorValuta}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"valuta\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Valuta </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.valuta}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"nrSiDataOrdinuluiDeAprobareAPretului\">\n          <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Nr. si data ordinului de\n            aprobare a pretului </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.nrSiDataOrdinuluiDeAprobareAPretului}} </td>\n        </ng-container>\n\n        <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n        <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n      </table>\n    </div>\n\n    <mat-paginator [pageSizeOptions]=\"[5, 10, 25, 100]\"></mat-paginator>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.ts ***!
  \*******************************************************************************/
/*! exports provided: ClasifyDrugsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClasifyDrugsComponent", function() { return ClasifyDrugsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ELEMENT_DATA = [
    { id: 1, codMedicament: 'CM112345', codVamal: 'CV112345', denumireComerciala: 'DM112345', formaFarmaceutica: 'FM123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr112345', dataDeInregistrare: new Date(), codulATC: 'CATC112345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB112345' },
    { id: 2, codMedicament: 'CM212345', codVamal: 'CV212345', denumireComerciala: 'DM212345', formaFarmaceutica: 'FM2123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr212345', dataDeInregistrare: new Date(), codulATC: 'CATC212345', denumireaComunaInternationala: 'DCI2', termenulDeValabilitate: '24 luni', codulDeBare: 'CB212345' },
    { id: 1, codMedicament: 'CM312345', codVamal: 'CV312345', denumireComerciala: 'DM312345', formaFarmaceutica: 'FM3123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr312345', dataDeInregistrare: new Date(), codulATC: 'CATC312345', denumireaComunaInternationala: 'DCI3', termenulDeValabilitate: '24 luni', codulDeBare: 'CB312345' },
    { id: 1, codMedicament: 'CM412345', codVamal: 'CV412345', denumireComerciala: 'DM412345', formaFarmaceutica: 'FM4123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr412345', dataDeInregistrare: new Date(), codulATC: 'CATC412345', denumireaComunaInternationala: 'DCI4', termenulDeValabilitate: '24 luni', codulDeBare: 'CB412345' },
    { id: 1, codMedicament: 'CM512345', codVamal: 'CV512345', denumireComerciala: 'DM512345', formaFarmaceutica: 'FM5123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr512345', dataDeInregistrare: new Date(), codulATC: 'CATC512345', denumireaComunaInternationala: 'DCI5', termenulDeValabilitate: '24 luni', codulDeBare: 'CB512345' },
    { id: 1, codMedicament: 'CM612345', codVamal: 'CV612345', denumireComerciala: 'DM612345', formaFarmaceutica: 'FM6123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr612345', dataDeInregistrare: new Date(), codulATC: 'CATC612345', denumireaComunaInternationala: 'DCI6', termenulDeValabilitate: '24 luni', codulDeBare: 'CB612345' },
    { id: 1, codMedicament: 'CM712345', codVamal: 'CV712345', denumireComerciala: 'DM712345', formaFarmaceutica: 'FM7123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr712345', dataDeInregistrare: new Date(), codulATC: 'CATC712345', denumireaComunaInternationala: 'DCI7', termenulDeValabilitate: '24 luni', codulDeBare: 'CB712345' },
    { id: 1, codMedicament: 'CM812345', codVamal: 'CV812345', denumireComerciala: 'DM812345', formaFarmaceutica: 'FM8123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr812345', dataDeInregistrare: new Date(), codulATC: 'CATC812345', denumireaComunaInternationala: 'DCI8', termenulDeValabilitate: '24 luni', codulDeBare: 'CB812345' },
    { id: 1, codMedicament: 'CM912345', codVamal: 'CV912345', denumireComerciala: 'DM912345', formaFarmaceutica: 'FM9123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr912345', dataDeInregistrare: new Date(), codulATC: 'CATC912345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB912345' },
    { id: 1, codMedicament: 'CM1012345', codVamal: 'CV12345', denumireComerciala: 'DM1012345', formaFarmaceutica: 'FM10123445', dozaConcentratia: '100ml', volum: '5g', divizarea: 'Divizare', tara: 'Moldova', firmaProducatoare: 'Zaporojie pikinez', nrDeInregistrare: 'Nr1012345', dataDeInregistrare: new Date(), codulATC: 'CATC1012345', denumireaComunaInternationala: 'DCI1', termenulDeValabilitate: '24 luni', codulDeBare: 'CB1012345' },
];
var ClasifyDrugsComponent = /** @class */ (function () {
    function ClasifyDrugsComponent() {
        this.displayedColumns = ['id', 'codMedicament', 'codVamal', 'denumireComerciala', 'formaFarmaceutica', 'dozaConcentratia', 'volum', 'divizarea', 'tara', 'firmaProducatoare', 'nrDeInregistrare', 'dataDeInregistrare', 'codulATC', 'denumireaComunaInternationala', 'termenulDeValabilitate', 'codulDeBare'];
        this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatTableDataSource"](ELEMENT_DATA);
    }
    ClasifyDrugsComponent.prototype.ngOnInit = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    ClasifyDrugsComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"])
    ], ClasifyDrugsComponent.prototype, "paginator", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"])
    ], ClasifyDrugsComponent.prototype, "sort", void 0);
    ClasifyDrugsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-clasify-drugs',
            template: __webpack_require__(/*! ./clasify-drugs.component.html */ "./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.html"),
            styles: [__webpack_require__(/*! ./clasify-drugs.component.css */ "./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ClasifyDrugsComponent);
    return ClasifyDrugsComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.css":
/*!******************************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.css ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".darkBlue {\r\n  background: #122f3b;\r\n}\r\n\r\nnav {\r\nwidth: 650px;\r\nmargin: 0 auto;\r\nbackground: #122f3b;\r\nborder-radius: 5px;\r\n}\r\n\r\nul {\r\n  list-style: none;\r\n  padding: 0px;\r\n}\r\n\r\nul li {\r\n  font-size: 18px;\r\n  padding: 10px 0px 10px 15px;\r\n}\r\n\r\nul li:hover {\r\n  background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\n\r\nul li a {\r\n  color: #fff;\r\n}\r\n\r\nul li a:hover {\r\n  color: #fff;\r\n}\r\n\r\n.active {\r\n    background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\n\r\nth, td {\r\n  text-align: center !important;\r\n}\r\n\r\nmat-header-cell {\r\n  display:flex;\r\n  justify-content:flex-end;\r\n }\r\n\r\n::ng-deep .mat-sort-header-container {\r\n  display:flex;\r\n  justify-content:center;\r\n}"

/***/ }),

/***/ "./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.html":
/*!*******************************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.html ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid z-depth-2 sky\">\n\n    <nav>\n        <ul>\n          <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/price-catalog\">Nomenclatorul medicamentului</a></li>\n          <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-classifier\">Clasificatorul medicamentului</a></li>\n          <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/economic-agents-classifier\">Catalogul national de preturi de producator la medicamente</a></li>\n          <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-nomenclature\">Clasificatorul agentilor economici cu gen de activitate farmaceutica</a></li>\n        </ul>\n      </nav>\n\n  <div class=\"table-width\">\n    <div class=\"text-right\">\n      <mat-form-field class=\"w-50\">\n        <input matInput (keyup)=\"applyFilter($event.target.value)\" placeholder=\"Search\" class=\"w-50\">\n      </mat-form-field>\n    </div>\n    <hr>\n    <table mat-table [dataSource]=\"dataSource\" class=\"w-100\" matSort>\n      <ng-container matColumnDef=\"id\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text text-left\"> ID </th>\n        <td mat-cell *matCellDef=\"let element\"> {{element.id}} </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"denumire\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text text-left\"> Denumire </th>\n        <td mat-cell *matCellDef=\"let element\"> {{element.denumire}} </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"adresa\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text text-left\"> Adresa </th>\n        <td mat-cell *matCellDef=\"let element\"> {{element.adresa}} </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"seria\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text text-left\"> Seria </th>\n        <td mat-cell *matCellDef=\"let element\"> {{element.seria}} </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"idno\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text text-left\"> IDNO </th>\n        <td mat-cell *matCellDef=\"let element\"> {{element.idno}} </td>\n      </ng-container>\n\n      <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n      <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n    </table>\n\n    <mat-paginator [pageSizeOptions]=\"[5, 10, 25, 100]\"></mat-paginator>\n  </div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.ts ***!
  \*****************************************************************************************************/
/*! exports provided: ClasifyEconomicsAgencyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClasifyEconomicsAgencyComponent", function() { return ClasifyEconomicsAgencyComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ELEMENT_DATA = [
    { id: 1, denumire: 'DM112345', adresa: 'Podvalul lui Jora 2/6', seria: 'A', idno: '123456789' },
    { id: 2, denumire: 'DM212345', adresa: 'Mazagul lui Guguta 2', seria: 'A', idno: '123456789' },
    { id: 3, denumire: 'DM312345', adresa: 'Pestera Galinei 29', seria: 'A', idno: '123456789' },
    { id: 4, denumire: 'DM412345', adresa: 'Vanea Djedai 3', seria: 'A', idno: '123456789' },
    { id: 5, denumire: 'DM512345', adresa: 'Vlad cel tihii 11', seria: 'A', idno: '123456789' },
    { id: 6, denumire: 'DM612345', adresa: 'Vladika 1', seria: 'A', idno: '123456789' },
    { id: 7, denumire: 'DM712345', adresa: 'Don Carleone 5', seria: 'A', idno: '123456789' },
    { id: 8, denumire: 'DM812345', adresa: 'Podvalul lui Jora 2/5', seria: 'A', idno: '123456789' },
    { id: 9, denumire: 'DM912345', adresa: 'Podvalul lui Jora 2/4', seria: 'A', idno: '123456789' },
    { id: 10, denumire: 'DM1012345', adresa: 'Podvalul lui Jora 2/3', seria: 'A', idno: '123456789' },
];
var ClasifyEconomicsAgencyComponent = /** @class */ (function () {
    function ClasifyEconomicsAgencyComponent() {
        this.displayedColumns = ['id', 'denumire', 'adresa', 'seria', 'idno'];
        this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatTableDataSource"](ELEMENT_DATA);
    }
    ClasifyEconomicsAgencyComponent.prototype.ngOnInit = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    ClasifyEconomicsAgencyComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"])
    ], ClasifyEconomicsAgencyComponent.prototype, "paginator", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"])
    ], ClasifyEconomicsAgencyComponent.prototype, "sort", void 0);
    ClasifyEconomicsAgencyComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-clasify-economics-agency',
            template: __webpack_require__(/*! ./clasify-economics-agency.component.html */ "./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.html"),
            styles: [__webpack_require__(/*! ./clasify-economics-agency.component.css */ "./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ClasifyEconomicsAgencyComponent);
    return ClasifyEconomicsAgencyComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.css":
/*!****************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.css ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".table-width {\r\n  width: 100%;\r\n  }\r\nth, td {\r\n  text-align: center !important;\r\n}\r\nmat-header-cell {\r\n  display:flex;\r\n  justify-content:flex-end;\r\n }\r\n::ng-deep .mat-sort-header-container {\r\n  display:flex;\r\n  justify-content:center;\r\n}\r\n.pr-search {\r\n  padding-right: 30px;\r\n}\r\n.modal-open .modal {\r\n  overflow-y: auto;\r\n}\r\n.example-container {\r\n  width: 100%;\r\n  overflow: auto;\r\n}\r\ntable {\r\n  width: 2800px;\r\n}\r\n.modal {\r\n  overflow-y:auto;\r\n}\r\n.darkBlue {\r\n  background: #122f3b;\r\n}\r\nnav {\r\nwidth: 650px;\r\nmargin: 0 auto;\r\nbackground: #122f3b;\r\nborder-radius: 5px;\r\n}\r\nul {\r\n  list-style: none;\r\n  padding: 0px;\r\n}\r\nul li {\r\n  font-size: 18px;\r\n  padding: 10px 0px 10px 15px;\r\n}\r\nul li:hover {\r\n  background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\nul li a {\r\n  color: #fff;\r\n}\r\nul li a:hover {\r\n  color: #fff;\r\n}\r\n.active {\r\n    background: linear-gradient(40deg, #207be0, #05b361)!important;\r\n}\r\n"

/***/ }),

/***/ "./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid z-depth-2 sky\">\n\n    <nav>\n      <ul>\n        <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/price-catalog\">Nomenclatorul medicamentului</a></li>\n        <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-classifier\">Clasificatorul medicamentului</a></li>\n        <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/economic-agents-classifier\">Catalogul national de preturi de producator la medicamente</a></li>\n        <li [routerLinkActive]=\"['active']\"><a routerLink=\"/dashboard/module/nomenclature/medicament-nomenclature\">Clasificatorul agentilor economici cu gen de activitate farmaceutica</a></li>\n      </ul>\n    </nav>\n  \n    <div class=\"table-width\">\n      <div class=\"text-right\">\n        <mat-form-field class=\"w-50\">\n          <input matInput (keyup)=\"applyFilter($event.target.value)\" placeholder=\"Search\" class=\"w-50\">\n        </mat-form-field>\n      </div>\n      <hr>\n      <div class=\"example-container\">\n        <table mat-table [dataSource]=\"dataSource\" matSort>\n          <ng-container matColumnDef=\"id\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> ID </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.id}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"denumireComerciala\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Denumirea comerciala </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.denumireComerciala}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"formaFarmaceutica\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Forma farmaceutica </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.formaFarmaceutica}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"doza\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Doza</th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.doza}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"volum\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Volum </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.volum}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"divizarea\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Divizarea </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.divizarea}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"dci\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> DCI </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.dci}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"atc\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> ATC </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.atc}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"termenDeValabilitate\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Termen de Valabilitate </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.termenDeValabilitate}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"nrDeInregistrare\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Nr. de inregistrare </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.nrDeInregistrare}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"dataInregistrarii\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\">Data de inregistrare  </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.dataInregistrarii | date: 'dd/MM/yyyy'}} </td>\n          </ng-container>\n            \n          <ng-container matColumnDef=\"detinatorulCertificatuluiDeIntreg\">\n              <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Detinatorul certificatului de intreg </th>\n              <td mat-cell *matCellDef=\"let element\"> {{element.detinatorulCertificatuluiDeIntreg}} </td>\n            </ng-container>\n  \n          <ng-container matColumnDef=\"taraDetinatorului\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Tara detinatorului </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.taraDetinatorului}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"statutDeEliberare\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Statut de eliberare </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.statutDeEliberare}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"original\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Original </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.original}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"informatiaDespreProducator\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Informatia despre producator </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.informatiaDespreProducator}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"instructiunea\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Instructiunea </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.instructiunea}} </td>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"machetaAmbalajului\">\n            <th mat-header-cell *matHeaderCellDef mat-sort-header class=\"black white-text\"> Macheta ambalajului </th>\n            <td mat-cell *matCellDef=\"let element\"> {{element.machetaAmbalajului}} </td>\n          </ng-container>\n  \n          <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n          <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n        </table>\n      </div>\n  \n      <mat-paginator [pageSizeOptions]=\"[5, 10, 25, 100]\"></mat-paginator>\n    </div>\n  </div>"

/***/ }),

/***/ "./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.ts ***!
  \***************************************************************************************/
/*! exports provided: NomenclatorDrugsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NomenclatorDrugsComponent", function() { return NomenclatorDrugsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ELEMENT_DATA = [
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
    { id: 1, denumireComerciala: 'DC12345', formaFarmaceutica: 'FM12345', doza: '100g', volum: '5ml', divizarea: 'D12321', dci: 'DCI12345', atc: 'ATC21321', termenDeValabilitate: '24 luni', nrDeInregistrare: 'NrReg123445', dataInregistrarii: new Date(), detinatorulCertificatuluiDeIntreg: 'DCReg12344', taraDetinatorului: 'Jora de Jos', statutDeEliberare: 'Activ', original: 'Shor Prime Entertaiment', informatiaDespreProducator: 'Li4no Shor o facut', instructiunea: 'A se utiliza cind trebuie otmaza', machetaAmbalajului: 'Shor Product' },
];
var NomenclatorDrugsComponent = /** @class */ (function () {
    function NomenclatorDrugsComponent() {
        this.displayedColumns = ['id', 'denumireComerciala', 'formaFarmaceutica', 'doza', 'volum', 'divizarea', 'dci', 'atc', 'termenDeValabilitate', 'nrDeInregistrare', 'dataInregistrarii', 'detinatorulCertificatuluiDeIntreg', 'taraDetinatorului', 'statutDeEliberare', 'original', 'informatiaDespreProducator', 'instructiunea', 'machetaAmbalajului'];
        this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatTableDataSource"](ELEMENT_DATA);
    }
    NomenclatorDrugsComponent.prototype.ngOnInit = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    NomenclatorDrugsComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginator"])
    ], NomenclatorDrugsComponent.prototype, "paginator", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSort"])
    ], NomenclatorDrugsComponent.prototype, "sort", void 0);
    NomenclatorDrugsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-nomenclator-drugs',
            template: __webpack_require__(/*! ./nomenclator-drugs.component.html */ "./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.html"),
            styles: [__webpack_require__(/*! ./nomenclator-drugs.component.css */ "./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], NomenclatorDrugsComponent);
    return NomenclatorDrugsComponent;
}());



/***/ }),

/***/ "./src/app/all-modules/module-6/nomenclature-routing.module.ts":
/*!*********************************************************************!*\
  !*** ./src/app/all-modules/module-6/nomenclature-routing.module.ts ***!
  \*********************************************************************/
/*! exports provided: NomenclatureRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NomenclatureRoutingModule", function() { return NomenclatureRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _catalog_price_drugs_catalog_price_drugs_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./catalog-price-drugs/catalog-price-drugs.component */ "./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.ts");
/* harmony import */ var _clasify_drugs_clasify_drugs_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./clasify-drugs/clasify-drugs.component */ "./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.ts");
/* harmony import */ var _clasify_economics_agency_clasify_economics_agency_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./clasify-economics-agency/clasify-economics-agency.component */ "./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.ts");
/* harmony import */ var _nomenclator_drugs_nomenclator_drugs_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nomenclator-drugs/nomenclator-drugs.component */ "./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [
    { path: 'price-catalog', component: _catalog_price_drugs_catalog_price_drugs_component__WEBPACK_IMPORTED_MODULE_2__["CatalogPriceDrugsComponent"] },
    { path: 'medicament-classifier', component: _clasify_drugs_clasify_drugs_component__WEBPACK_IMPORTED_MODULE_3__["ClasifyDrugsComponent"] },
    { path: 'economic-agents-classifier', component: _clasify_economics_agency_clasify_economics_agency_component__WEBPACK_IMPORTED_MODULE_4__["ClasifyEconomicsAgencyComponent"] },
    { path: 'medicament-nomenclature', component: _nomenclator_drugs_nomenclator_drugs_component__WEBPACK_IMPORTED_MODULE_5__["NomenclatorDrugsComponent"] },
];
var NomenclatureRoutingModule = /** @class */ (function () {
    function NomenclatureRoutingModule() {
    }
    NomenclatureRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], NomenclatureRoutingModule);
    return NomenclatureRoutingModule;
}());



/***/ }),

/***/ "./src/app/all-modules/module-6/nomenclature.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/all-modules/module-6/nomenclature.module.ts ***!
  \*************************************************************/
/*! exports provided: NomenclatureModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NomenclatureModule", function() { return NomenclatureModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _nomenclature_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nomenclature-routing.module */ "./src/app/all-modules/module-6/nomenclature-routing.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/esm5/angular-bootstrap-md.es5.js");
/* harmony import */ var _material_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../material-shared.module */ "./src/app/material-shared.module.ts");
/* harmony import */ var _catalog_price_drugs_catalog_price_drugs_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./catalog-price-drugs/catalog-price-drugs.component */ "./src/app/all-modules/module-6/catalog-price-drugs/catalog-price-drugs.component.ts");
/* harmony import */ var _clasify_drugs_clasify_drugs_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./clasify-drugs/clasify-drugs.component */ "./src/app/all-modules/module-6/clasify-drugs/clasify-drugs.component.ts");
/* harmony import */ var _clasify_economics_agency_clasify_economics_agency_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./clasify-economics-agency/clasify-economics-agency.component */ "./src/app/all-modules/module-6/clasify-economics-agency/clasify-economics-agency.component.ts");
/* harmony import */ var _nomenclator_drugs_nomenclator_drugs_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./nomenclator-drugs/nomenclator-drugs.component */ "./src/app/all-modules/module-6/nomenclator-drugs/nomenclator-drugs.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var NomenclatureModule = /** @class */ (function () {
    function NomenclatureModule() {
    }
    NomenclatureModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _nomenclature_routing_module__WEBPACK_IMPORTED_MODULE_2__["NomenclatureRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_4__["MDBBootstrapModule"].forRoot(),
                _material_shared_module__WEBPACK_IMPORTED_MODULE_5__["MaterialSharedModule"].forRoot(),
            ],
            declarations: [_catalog_price_drugs_catalog_price_drugs_component__WEBPACK_IMPORTED_MODULE_6__["CatalogPriceDrugsComponent"], _clasify_drugs_clasify_drugs_component__WEBPACK_IMPORTED_MODULE_7__["ClasifyDrugsComponent"], _clasify_economics_agency_clasify_economics_agency_component__WEBPACK_IMPORTED_MODULE_8__["ClasifyEconomicsAgencyComponent"], _nomenclator_drugs_nomenclator_drugs_component__WEBPACK_IMPORTED_MODULE_9__["NomenclatorDrugsComponent"]]
        })
    ], NomenclatureModule);
    return NomenclatureModule;
}());



/***/ })

}]);
//# sourceMappingURL=app-all-modules-module-6-nomenclature-module.js.map