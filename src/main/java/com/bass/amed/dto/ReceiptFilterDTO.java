package com.bass.amed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
public class ReceiptFilterDTO implements Serializable
{
    private String number;
    private String paymentOrderNumber;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date receiptDateFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date receiptDateTo;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date insertDateFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date insertDateTo;

    public ReceiptFilterDTO()
    {

    }

}
