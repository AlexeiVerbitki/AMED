import {Document} from '../../models/document';

export class LicenseModel {
    step: string;
    number?: string;
    requestStartDate?: any;
    company?: any;
    solicitant?: any;
    tipCerere?: string;
    licenseRequestType: any;
    documents?: Document[];
}
