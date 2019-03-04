package com.bass.amed.utils;

import com.bass.amed.dto.gmp.GMPFilterDTO;

import javax.persistence.Query;

public class GMPQueryUtils
{
    public static StringBuilder createQuery(GMPFilterDTO gmpFilters)
    {
        StringBuilder stringBuilder = new StringBuilder("SELECT g.id,e.name company,g.authorization_number authorizationNumber,g.authorization_start_date authorizationStartDate,g.authorization_end_date authorizationEndDate,\n" +
                "       g.certificate_number certificateNumber,g.certificate_start_date certificateStartDate,g.certificate_end_date certificateEndDate, d.path authorizationPath, d1.path certificatePath,\n" +
                "       g.status,g.from_date fromDate,g.to_Date toDate,g.cause \n" +
                "FROM gmp_authorizations g,nm_economic_agents e,documents d,documents d1,registration_Requests r\n" +
                "where g.company_id = e.id and d.id=g.authorization_id and d1.id=g.certificate_id \n" +
                "and r.id=g.release_request_id");

        if (gmpFilters.getRequestNumber() != null && !gmpFilters.getRequestNumber().isEmpty())
        {
            stringBuilder.append(" and r.request_number = :requestNumber");
        }

        if (gmpFilters.getCompany() != null && gmpFilters.getCompany().getId() != null)
        {
            stringBuilder.append(" and g.company_id = :companyId");
        }

        if (gmpFilters.getAuthorizationNumber() != null && !gmpFilters.getAuthorizationNumber().isEmpty())
        {
            stringBuilder.append(" and g.authorization_number = :authorizationNumber");
        }

        if (gmpFilters.getAuthorizationStartDateFrom() != null
                && gmpFilters.getAuthorizationStartDateTo() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(authorization_start_date, \"%Y-%m-%d\") between  DATE_FORMAT(:authorizationStartDateFrom, \"%Y-%m-%d\") and  DATE_FORMAT" +
                    "(:authorizationStartDateTo, " +
                    "\"%Y-%m-%d\")");
        }
        else if (gmpFilters.getAuthorizationStartDateFrom() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(authorization_start_date, \"%Y-%m-%d\")  >= DATE_FORMAT(:authorizationStartDateFrom, \"%Y-%m-%d\")");
        }
        else if (gmpFilters.getAuthorizationStartDateTo() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(authorization_start_date, \"%Y-%m-%d\")  < DATE_FORMAT(:authorizationStartDateTo, \"%Y-%m-%d\")");
        }

        if (gmpFilters.getCertificateNumber() != null && !gmpFilters.getCertificateNumber().isEmpty())
        {
            stringBuilder.append(" and g.certificate_number = :certificateNumber");
        }

        if (gmpFilters.getCertificateStartDateFrom() != null
                && gmpFilters.getCertificateEndDateTo() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(certificate_start_date, \"%Y-%m-%d\") between  DATE_FORMAT(:certificateStartDateFrom, \"%Y-%m-%d\") and  DATE_FORMAT" +
                    "(:certificateStartDateTo, " +
                    "\"%Y-%m-%d\")");
        }
        else if (gmpFilters.getCertificateStartDateFrom() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(certificate_start_date, \"%Y-%m-%d\")  >= DATE_FORMAT(:certificateStartDateFrom, \"%Y-%m-%d\")");
        }
        else if (gmpFilters.getCertificateEndDateTo() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(certificate_start_date, \"%Y-%m-%d\")  < DATE_FORMAT(:certificateStartDateTo, \"%Y-%m-%d\")");
        }

        return stringBuilder;
    }

    public static void updateQueryWithValues(GMPFilterDTO gmpFilters, Query query)
    {
        if (gmpFilters.getRequestNumber() != null && !gmpFilters.getRequestNumber().isEmpty())
        {
            query.setParameter("requestNumber", gmpFilters.getRequestNumber());
        }

        if (gmpFilters.getCompany() != null && gmpFilters.getCompany().getId() != null)
        {
            query.setParameter("companyId", gmpFilters.getCompany());
        }

        if (gmpFilters.getAuthorizationNumber() != null && !gmpFilters.getAuthorizationNumber().isEmpty())
        {
            query.setParameter("authorizationNumber", gmpFilters.getAuthorizationNumber());
        }

        if (gmpFilters.getAuthorizationStartDateFrom() != null
                && gmpFilters.getAuthorizationStartDateTo() != null)
        {
            query.setParameter("authorizationStartDateFrom", gmpFilters.getAuthorizationStartDateFrom());
            query.setParameter("authorizationStartDateTo", gmpFilters.getAuthorizationStartDateTo());
        }
        else if (gmpFilters.getAuthorizationStartDateFrom() != null)
        {
            query.setParameter("authorizationStartDateFrom", gmpFilters.getAuthorizationStartDateFrom());
        }
        else if (gmpFilters.getAuthorizationStartDateTo() != null)
        {
            query.setParameter("authorizationStartDateTo", gmpFilters.getAuthorizationStartDateTo());
        }

        if (gmpFilters.getCertificateNumber() != null && !gmpFilters.getCertificateNumber().isEmpty())
        {
            query.setParameter("certificateNumber", gmpFilters.getCertificateNumber());
        }

        if (gmpFilters.getCertificateStartDateFrom() != null
                && gmpFilters.getCertificateEndDateTo() != null)
        {
            query.setParameter("certificateStartDateFrom", gmpFilters.getCertificateStartDateFrom());
            query.setParameter("certificateStartDateTo", gmpFilters.getCertificateEndDateTo());
        }
        else if (gmpFilters.getCertificateStartDateFrom() != null)
        {
            query.setParameter("certificateStartDateFrom", gmpFilters.getCertificateStartDateFrom());
        }
        else if (gmpFilters.getCertificateEndDateTo() != null)
        {
            query.setParameter("certificateStartDateTo", gmpFilters.getCertificateEndDateTo());
        }
    }
}
