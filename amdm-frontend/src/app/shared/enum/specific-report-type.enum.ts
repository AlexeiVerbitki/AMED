export enum SpecificReportType {
    SAE=0, SUSAR=1
}

export namespace SpecificReportType {
    export function values() {
        return Object.keys(SpecificReportType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
