export enum ReportSource {
    STUDY = 0,
    LITERATURE = 1,
    AUTHORITY = 2,
    HEALTH_PROFESSIONAL = 3,
    OTHER = 4
}

export namespace ReportSource {
    export function values() {
        return Object.keys(ReportSource).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
