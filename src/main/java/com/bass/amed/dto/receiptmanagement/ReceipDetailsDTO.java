package com.bass.amed.dto.receiptmanagement;

import java.util.Date;

public class ReceipDetailsDTO {
    private Integer payedId;
    private String receiptNumber;
    private Date payedDate;
    private Double payedAmmount;

    public ReceipDetailsDTO(Integer payedId, String receiptNumber, Date payedDate, Double payedAmmount){
        this.payedId = payedId;
        this.receiptNumber = receiptNumber;
        this.payedDate = payedDate;
        this.payedAmmount = payedAmmount;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public Date getPayedDate() {
        return payedDate;
    }

    public Double getPayedAmmount() {
        return payedAmmount;
    }

    public Integer getPayedId() {
        return payedId;
    }
}
