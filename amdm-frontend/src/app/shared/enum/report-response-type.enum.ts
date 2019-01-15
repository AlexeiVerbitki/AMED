export enum ReportResponseType {
    NA = 0, YES = 1, NO = 2
}

export namespace ReportResponseType {
    export function values() {
        return Object.keys(ReportResponseType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
