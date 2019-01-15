export enum ReportTypeSaesusar {
    'PATIENT DIED' = 0,
    'LIFE THREATENING' = 1,
    'INVOLVED OR PROLONGED INPATIENT HOSPITALIZATION' = 2,
    'INVOLVED PERSISTENT OR SIGNIFICANT DISABILITY OR INCAPACITY' = 3,
    'CONGENITAL ANOMALY' = 4,
    'OTHER MEDICALLY SIGNIFICANT CONDITION' = 5
}

export namespace ReportTypeSaesusar {
    export function values() {
        return Object.keys(ReportTypeSaesusar).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
