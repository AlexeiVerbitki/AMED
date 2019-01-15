export enum ReportType {
    INITIAL = 0, FOLLOW_UP = 1, FINAL = 2
}

export namespace ReportType {
    export function values() {
        return Object.keys(ReportType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
