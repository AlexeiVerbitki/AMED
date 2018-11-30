package com.bass.amed.utils;

import com.bass.amed.dto.MedicamentFilterDTO;
import javax.persistence.Query;
import java.util.List;
import java.util.stream.Collectors;

public class MedicamentQueryUtils
{
    public static StringBuilder createMedicamentByFilterQuery(MedicamentFilterDTO medicamentFilters)
    {
        StringBuilder stringBuilder = new StringBuilder("select m.id,m.code,m.name,m.division,DATE_FORMAT(expiration_date,'%d/%m/%Y') expirationDate,m.atc_code atcCode,ma" +
                ".description " +
                "authorizationHolderDescription, m.registration_number registerNumber,DATE_FORMAT(registration_date,'%d/%m/%Y') registrationDate " +
                " from medicament m,nm_pharmaceutical_forms ph,registration_requests r,medicament_manufactures mm, nm_manufactures ma " +
                " where status = 'F' and  m.authorization_holder_id=ma.id  and m.pharmaceutical_form_id = ph.id and m.request_id=r.id and m.id = mm.medicament_id and mm.producator_produs_finit = 1 " );

        if (!Boolean.TRUE.equals(medicamentFilters.getExpiratedMedicaments()))
        {
            stringBuilder.append(" and expiration_date > now()");
        }

        if (medicamentFilters.getCode() != null && !medicamentFilters.getCode().isEmpty())
        {
            stringBuilder.append(" and m.code = :code");
        }

        if (medicamentFilters.getName() != null && !medicamentFilters.getName().isEmpty())
        {
            stringBuilder.append(" and upper(m.name) like upper(:name)");
        }

        if (medicamentFilters.getAtcCode() != null && !medicamentFilters.getAtcCode().isEmpty())
        {
            stringBuilder.append(" and upper(m.atc_code) = upper(:atcCode)");
        }

        if (medicamentFilters.getRegisterNumber() != null && !medicamentFilters.getRegisterNumber().isEmpty())
        {
            stringBuilder.append(" and m.registration_number = :registerNumber");
        }

        if (medicamentFilters.getRegistrationDateFrom() != null
                && medicamentFilters.getRegistrationDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(registration_date, \"%Y-%m-%d\") between  DATE_FORMAT(:registrationDateFrom, \"%Y-%m-%d\") and  DATE_FORMAT" +
                    "(:registrationDateTo, " +
                    "\"%Y-%m-%d\")");
        }
        else if(medicamentFilters.getRegistrationDateFrom() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(registration_date, \"%Y-%m-%d\")  >= DATE_FORMAT(:registrationDateFrom, \"%Y-%m-%d\")");
        }
        else if(medicamentFilters.getRegistrationDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(registration_date, \"%Y-%m-%d\")  < DATE_FORMAT(:registrationDateTo, \"%Y-%m-%d\")");
        }

        if (medicamentFilters.getInternationalName() != null && medicamentFilters.getInternationalName().getId()!=null)
        {
            stringBuilder.append(" and international_name_id = :internationalName");
        }

        if (medicamentFilters.getPharmaceuticalFormType() != null && medicamentFilters.getPharmaceuticalFormType().getId()!=null)
        {
            stringBuilder.append(" and ph.type_id = :pharmaceuticalFormType");
        }

        if (medicamentFilters.getPharmaceuticalForm() != null && medicamentFilters.getPharmaceuticalForm().getId()!=null)
        {
            stringBuilder.append(" and pharmaceutical_form_id = :pharmaceuticalForm");
        }

        if (medicamentFilters.getAuthorizationHolder() != null && medicamentFilters.getAuthorizationHolder().getId()!=null)
        {
            stringBuilder.append(" and authorization_holder_id = :authorizationHolder");
        }

        if (medicamentFilters.getExpirationDateFrom() != null
                && medicamentFilters.getExpirationDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(expiration_date, \"%Y-%m-%d\") between  DATE_FORMAT(:expirationDateFrom, \"%Y-%m-%d\") and  DATE_FORMAT" +
                    "(:expirationDateTo, " +
                    "\"%Y-%m-%d\")");
        }
        else if(medicamentFilters.getExpirationDateFrom() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(expiration_date, \"%Y-%m-%d\")  >= DATE_FORMAT(:expirationDateFrom, \"%Y-%m-%d\")");
        }
        else if(medicamentFilters.getExpirationDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(expiration_date, \"%Y-%m-%d\")  < DATE_FORMAT(:expirationDateTo, \"%Y-%m-%d\")");
        }

        if (medicamentFilters.getType() != null && medicamentFilters.getType().getId()!=null)
        {
            stringBuilder.append(" and m.type_id = :type");
        }

        if (medicamentFilters.getGroup() != null && medicamentFilters.getGroup().getId()!=null)
        {
            stringBuilder.append(" and group_id = :group");
        }

        if (medicamentFilters.getPrescription() != null)
        {
            stringBuilder.append(" and prescription = :prescription");
        }

        if (medicamentFilters.getTerms() != null)
        {
            stringBuilder.append(" and terms_of_validity = :terms");
        }

        if (medicamentFilters.getRequestNumber() != null && !medicamentFilters.getRequestNumber().isEmpty())
        {
            stringBuilder.append(" and r.request_number = :requestNumber");
        }

        if (medicamentFilters.getDivision() != null && !medicamentFilters.getDivision().isEmpty())
        {
            stringBuilder.append(" and upper(division) = upper(:division)");
        }

        if (medicamentFilters.getManufacture() != null && medicamentFilters.getManufacture().getId()!=null)
        {
            stringBuilder.append(" and mm.manufacture_id = :manufacture");
        }

        if(stringBuilder.toString().endsWith("produs_finit = 1 "))
        {
            stringBuilder.append(" order by m.id desc limit 500");
        }
        else
        {
            stringBuilder.append(" order by m.id desc");
        }

        return stringBuilder;
    }

    public static StringBuilder createMedicamentSALeastOneQuery(MedicamentFilterDTO medicamentFilters)
    {
        StringBuilder stringBuilder = new StringBuilder("select m.id,m.code,m.name,m.division,DATE_FORMAT(expiration_date,'%d/%m/%Y') expirationDate,m.atc_code atcCode,man" +
                ".description " +
                "authorizationHolderDescription, m.registration_number registerNumber,DATE_FORMAT(registration_date,'%d/%m/%Y') registrationDate " +
                "from medicament m,medicament_active_substances ma,nm_manufactures man\n" +
                "where m.status = 'F' and  m.authorization_holder_id=man.id and m.id=ma.medicament_id and ma.active_substance_id in (");
        String s = medicamentFilters.getActiveSubstances().stream().map(sa->String.valueOf(sa.getId())).collect(Collectors.joining(", "));
        return stringBuilder.append(s+")");
    }

    public static StringBuilder createMedicamentSAAllQuery(MedicamentFilterDTO medicamentFilters)
    {
        StringBuilder stringBuilder = new StringBuilder("select m.id,m.code,m.name,m.division,DATE_FORMAT(expiration_date,'%d/%m/%Y') expirationDate,m.atc_code atcCode,man" +
                ".description " +
                "authorizationHolderDescription, m.registration_number registerNumber,DATE_FORMAT(registration_date,'%d/%m/%Y') registrationDate " +
                "from\n" +
                "(select m.id,count(ma.active_substance_id) cnt from medicament m,medicament_active_substances ma\n" +
                "where m.status = 'F' and m.id=ma.medicament_id and ma.active_substance_id in (");
        String s =   medicamentFilters.getActiveSubstances().stream().map(sa->String.valueOf(sa.getId())).collect(Collectors.joining(", "));
        return stringBuilder.append(s+")\n" +
                "                group by ma.medicament_Id) s1,medicament m,nm_manufactures man\n" +
                "                where m.id=s1.id and  m.authorization_holder_id=man.id and cnt="+medicamentFilters.getActiveSubstances().size());
    }

    public static StringBuilder createMedicamentDetailsQuery(List<Integer> ids)
    {
        StringBuilder stringBuilder = new StringBuilder("select m.id,m.code,name,atc_code atcCode,registration_number registerNumber,DATE_FORMAT(registration_date,'%d/%m/%Y') registrationDate," +
                "division,ma" +
                ".description authorizationHolderDescription,DATE_FORMAT(expiration_date,'%d/%m/%Y') expirationDate from medicament m,nm_manufactures ma\n" +
                "where m.authorization_holder_id=ma.id and m.id in (");
        String s = ids.stream().map(id->String.valueOf(id)).collect(Collectors.joining(", "));
        return stringBuilder.append(s+")");
    }

    public static void updateMedicamentByFilerQueryWithValues(MedicamentFilterDTO medicamentFilters, Query query)
    {
        if (medicamentFilters.getCode() != null && !medicamentFilters.getCode().isEmpty())
        {
            query.setParameter("code", medicamentFilters.getCode());
        }

        if (medicamentFilters.getName() != null && !medicamentFilters.getName().isEmpty())
        {
            query.setParameter("name","%" +  medicamentFilters.getName()+ "%");
        }

        if (medicamentFilters.getAtcCode() != null && !medicamentFilters.getAtcCode().isEmpty())
        {
            query.setParameter("atcCode", medicamentFilters.getAtcCode());
        }

        if (medicamentFilters.getRegisterNumber() != null && !medicamentFilters.getRegisterNumber().isEmpty())
        {
            query.setParameter("registerNumber", medicamentFilters.getRegisterNumber());
        }

        if (medicamentFilters.getRegistrationDateFrom() != null
                && medicamentFilters.getRegistrationDateTo() != null)
        {
            query.setParameter("registrationDateFrom", medicamentFilters.getRegistrationDateFrom());
            query.setParameter("registrationDateTo", medicamentFilters.getRegistrationDateTo());
        }
        else if(medicamentFilters.getRegistrationDateFrom() != null)
        {
            query.setParameter("registrationDateFrom", medicamentFilters.getRegistrationDateFrom());
        }
        else if(medicamentFilters.getRegistrationDateTo() != null )
        {
            query.setParameter("registrationDateTo", medicamentFilters.getRegistrationDateTo());
        }

        if (medicamentFilters.getInternationalName() != null && medicamentFilters.getInternationalName().getId()!=null)
        {
            query.setParameter("internationalName", medicamentFilters.getInternationalName());
        }

        if (medicamentFilters.getPharmaceuticalFormType() != null && medicamentFilters.getPharmaceuticalFormType().getId()!=null)
        {
            query.setParameter("pharmaceuticalFormType", medicamentFilters.getPharmaceuticalFormType());
        }

        if (medicamentFilters.getPharmaceuticalForm() != null && medicamentFilters.getPharmaceuticalForm().getId()!=null)
        {
            query.setParameter("pharmaceuticalForm", medicamentFilters.getPharmaceuticalForm());
        }

        if (medicamentFilters.getAuthorizationHolder() != null && medicamentFilters.getAuthorizationHolder().getId()!=null)
        {
            query.setParameter("authorizationHolder", medicamentFilters.getAuthorizationHolder());
        }

        if (medicamentFilters.getExpirationDateFrom() != null
                && medicamentFilters.getExpirationDateTo() != null )
        {
            query.setParameter("expirationDateFrom", medicamentFilters.getExpirationDateFrom());
            query.setParameter("expirationDateTo", medicamentFilters.getExpirationDateTo());
        }
        else if(medicamentFilters.getExpirationDateFrom() != null)
        {
            query.setParameter("expirationDateFrom", medicamentFilters.getExpirationDateFrom());
        }
        else if(medicamentFilters.getExpirationDateTo() != null )
        {
            query.setParameter("expirationDateTo", medicamentFilters.getExpirationDateTo());
        }

        if (medicamentFilters.getType() != null && medicamentFilters.getType().getId()!=null)
        {
            query.setParameter("type", medicamentFilters.getType());
        }

        if (medicamentFilters.getGroup() != null && medicamentFilters.getGroup().getId()!=null)
        {
            query.setParameter("group", medicamentFilters.getGroup());
        }

        if (medicamentFilters.getPrescription() != null)
        {
            query.setParameter("prescription", medicamentFilters.getPrescription());
        }

        if (medicamentFilters.getTerms() != null)
        {
            query.setParameter("terms", medicamentFilters.getTerms());
        }

        if (medicamentFilters.getRequestNumber() != null && !medicamentFilters.getRequestNumber().isEmpty())
        {
            query.setParameter("requestNumber", medicamentFilters.getRequestNumber());
        }

        if (medicamentFilters.getDivision() != null && !medicamentFilters.getDivision().isEmpty())
        {
            query.setParameter("division", medicamentFilters.getDivision());
        }

        if (medicamentFilters.getManufacture() != null && medicamentFilters.getManufacture().getId()!=null)
        {
            query.setParameter("manufacture", medicamentFilters.getManufacture());
        }
    }
}
