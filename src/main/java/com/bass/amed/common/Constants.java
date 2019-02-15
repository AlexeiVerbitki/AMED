package com.bass.amed.common;

import java.util.Arrays;
import java.util.List;

public interface Constants
{
    public interface DEFAULT_VALUES
    {
        String STR_EMPTY = "";
    }

    interface Layouts
    {
        String DATE_FORMAT       = "dd/MM/yyyy";
        String POINT_DATE_FORMAT = "dd.MM.yyyy";
        String DATE_TIME_FORMAT  = "dd.MM.yyyy HH:mm:ss";
    }

    interface StepLink
    {
        String MODULE  = "/dashboard/module/";
        String LICENSE = "license/";
    }

    interface SysParams
    {
        String DIRECTOR_GENERAL             = "FN_DIR_GEN";
        String ACCOUNTANT                   = "ACCOUNTANT";
        String NIMICIRE_DIRECTOR_SERVICE    = "NIM_DIR_SERVICE";
        String BENEFICIARY_BANK             = "BENEFICIARY_BANK";
        String BENEFICIARY_ADDRESS          = "BENEFICIARY_ADDRESS";
        String BENEFICIARY_BANK_CODE        = "BENEFICIARY_BANK_CODE";
        String BENEFICIARY_BANK_ACCOUNT     = "BENEFICIARY_BANK_ACCOUNT";
        String BENEFICIARY_IBAN             = "BENEFICIARY_IBAN";
        String VAT_CODE                     = "VAT_CODE";
        String BENEFICIARY                  = "BENEFICIARY";
        String PRESEDINTE_CPCD              = "PR_CPCD";
        String FARMACIST_CPCD               = "FR_CPCD";
        String IMPORT_REPREZENTANT          = "IMPORT_REPREZENTANT";
        String IMPORT_SEF_SECTIE            = "IMPORT_SEF_SECTIE";
        String BENEFICIARY_ITERMEDIARY_BANK = "BENEFICIARY_ITERMEDIARY_BANK";
        String BENEFICIARY_SWIFT_CODE       = "BENEFICIARY_SWIFT_CODE";
        String STUD_CLIN_SERVICE            = "STUD_CLIN_SERVICE";
        String INFORM_TEHNOLOGY_SERVICE     = "INFORM_TEHNOLOGY_SERVICE";
    }

    enum AUDIT_ACTIONS
    {
        ADD, MODIFY, DELETE, INTERRUPT
    }

    enum AUDIT_CATEGORIES
    {
        MODULE, ADMINISTRATION
    }

    enum AUDIT_SUBCATEGORIES
    {
        MODULE_1, MODULE_2, MODULE_3, MODULE_4, MODULE_5, MODULE_6, MODULE_7, MODULE_8, MODULE_9, MODULE_10,
        MODULE_11, MODULE_12
    }

    interface ClinicTrailStep
    {
        String REGISTER = "R";
        String EVALUATE = "E";
        String ANALIZE  = "A";
        String APPROVE  = "AP";
        String FINISH   = "F";
        String CANCEL   = "C";
    }

    enum LDAP_ENABLED_ACCOUNT_STATUS
    {
        NORMAL_ACCOUNT(512), ENABLED_PNR(544), ENABLED_NE(66048), ENABLED_C(262656);

        private int statusCode;

        LDAP_ENABLED_ACCOUNT_STATUS(Integer statusCode)
        {
            this.statusCode = statusCode;
        }

        public Integer getStatusCode()
        {
            return statusCode;
        }

        public List<Integer> getListOfEnabledStatus()
        {
            return Arrays.asList(512, 544, 66048, 262656);
        }
    }

}

