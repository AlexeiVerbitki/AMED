package com.bass.amed.common;

public interface Constants
{
    interface Layouts{
        String DATE_FORMAT = "dd/MM/yyyy";
        String POINT_DATE_FORMAT = "dd.MM.yyyy";
    }

    interface StepLink
    {
        String MODULE = "/dashboard/module/";
        String LICENSE = "license/";
    }

    interface SysParams{
        String DIRECTOR_GENERAL = "FN_DIR_GEN";
        String ACCOUNTANT = "ACCOUNTANT";
        String NIMICIRE_DIRECTOR_SERVICE = "NIM_DIR_SERVICE";
        String BENEFICIARY_BANK = "BENEFICIARY_BANK";
        String BENEFICIARY_ADDRESS = "BENEFICIARY_ADDRESS";
        String BENEFICIARY_BANK_CODE = "BENEFICIARY_BANK_CODE";
        String BENEFICIARY_BANK_ACCOUNT = "BENEFICIARY_BANK_ACCOUNT";
        String BENEFICIARY_IBAN = "BENEFICIARY_IBAN";
        String VAT_CODE = "VAT_CODE";
        String BENEFICIARY = "BENEFICIARY";
        String PRESEDINTE_CPCD = "PR_CPCD";
        String FARMACIST_CPCD = "FR_CPCD";
        String IMPORT_REPREZENTANT = "IMPORT_REPREZENTANT";
        String IMPORT_SEF_SECTIE = "IMPORT_SEF_SECTIE";
    }
}

