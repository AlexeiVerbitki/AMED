export enum Casuality {
    'Causality as per reporter' = 0, 'Causality as per Mfr' = 1
}

export namespace Casuality {
    export function values() {
        return Object.keys(Casuality).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
