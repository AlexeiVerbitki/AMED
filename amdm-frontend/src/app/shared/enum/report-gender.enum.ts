export enum ReportGender {
    Male = 0, Female = 1
}

export namespace ReportGender {
    export function values() {
        return Object.keys(ReportGender).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
