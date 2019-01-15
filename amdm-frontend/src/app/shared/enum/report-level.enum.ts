export enum ReportLevel {
    International = 0, National = 1
}

export namespace ReportLevel {
    export function values() {
        return Object.keys(ReportLevel).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
