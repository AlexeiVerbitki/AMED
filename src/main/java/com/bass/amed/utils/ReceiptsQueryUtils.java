package com.bass.amed.utils;

import com.bass.amed.dto.ReceiptFilterDTO;

import javax.persistence.Query;

public class ReceiptsQueryUtils
{
    public static StringBuilder createReceiptsByFilterQuery(ReceiptFilterDTO receiptFilter)
    {
        StringBuilder stringBuilder = new StringBuilder("SELECT r.id,r.number,r.payment_date,r.payment_order_number,r.amount,r.insert_date\n" +
                "FROM amed.receipts r where 1=1 " );

        if (receiptFilter.getNumber() != null && !receiptFilter.getNumber().isEmpty())
        {
            stringBuilder.append(" and r.number = :number");
        }

        if (receiptFilter.getPaymentOrderNumber() != null && !receiptFilter.getPaymentOrderNumber().isEmpty())
        {
            stringBuilder.append(" and r.payment_order_number = :payment_order_number");
        }

        if (receiptFilter.getReceiptDateFrom() != null
                && receiptFilter.getReceiptDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(payment_date, \"%Y-%m-%d\") between  DATE_FORMAT(:paymentDateFrom, \"%Y-%m-%d\") and  DATE_FORMAT" +
                    "(:paymentDateTo, " +
                    "\"%Y-%m-%d\")");
        }
        else if(receiptFilter.getReceiptDateFrom() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(payment_date, \"%Y-%m-%d\")  >= DATE_FORMAT(:paymentDateFrom, \"%Y-%m-%d\")");
        }
        else if(receiptFilter.getReceiptDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(payment_date, \"%Y-%m-%d\")  < DATE_FORMAT(:paymentDateTo, \"%Y-%m-%d\")");
        }

        if (receiptFilter.getInsertDateFrom() != null
                && receiptFilter.getInsertDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(insert_date, \"%Y-%m-%d\") between  DATE_FORMAT(:insertDateFrom, \"%Y-%m-%d\") and  DATE_FORMAT" +
                    "(:insertDateTo, " +
                    "\"%Y-%m-%d\")");
        }
        else if(receiptFilter.getInsertDateFrom() != null)
        {
            stringBuilder.append(" and DATE_FORMAT(insert_date, \"%Y-%m-%d\")  >= DATE_FORMAT(:insertDateFrom, \"%Y-%m-%d\")");
        }
        else if(receiptFilter.getInsertDateTo() != null )
        {
            stringBuilder.append(" and DATE_FORMAT(insert_date, \"%Y-%m-%d\")  < DATE_FORMAT(:insertDateTo, \"%Y-%m-%d\")");
        }

        if(stringBuilder.toString().endsWith("re 1=1 "))
        {
            stringBuilder.append(" order by r.id desc limit 500");
        }
        else
        {
            stringBuilder.append(" order by r.id desc");
        }

        return stringBuilder;
    }

    public static void fillReceiptQueryWithValues(ReceiptFilterDTO filter, Query query)
    {
        if (filter.getNumber() != null && !filter.getNumber().isEmpty())
        {
            query.setParameter("number", filter.getNumber());
        }

        if (filter.getPaymentOrderNumber() != null && !filter.getPaymentOrderNumber().isEmpty())
        {
            query.setParameter("payment_order_number", filter.getPaymentOrderNumber());
        }

        if (filter.getReceiptDateFrom() != null
                && filter.getReceiptDateTo() != null )
        {
            query.setParameter("paymentDateFrom", filter.getReceiptDateFrom());
            query.setParameter("paymentDateTo", filter.getReceiptDateTo());
        }
        else if(filter.getReceiptDateFrom() != null )
        {
            query.setParameter("paymentDateFrom", filter.getReceiptDateFrom());
        }
        else if(filter.getReceiptDateTo() != null )
        {
            query.setParameter("paymentDateTo", filter.getReceiptDateTo());
        }

        if (filter.getInsertDateFrom() != null
                && filter.getInsertDateTo() != null )
        {
            query.setParameter("insertDateFrom", filter.getInsertDateFrom());
            query.setParameter("insertDateTo", filter.getInsertDateTo());
        }
        else if(filter.getInsertDateFrom() != null)
        {
            query.setParameter("insertDateFrom", filter.getInsertDateFrom());
        }
        else if(filter.getInsertDateTo() != null )
        {
            query.setParameter("insertDateTo", filter.getInsertDateTo());
        }
    }
}
