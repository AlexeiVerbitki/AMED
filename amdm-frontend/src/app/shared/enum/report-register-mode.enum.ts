export enum ReportRegisterMode {
    OneWindow = 3, eMail = 2, Curier = 1
}

export namespace ReportRegisterMode {
    export function values() {
        return Object.keys(ReportRegisterMode).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
