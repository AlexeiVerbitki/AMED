package com.bass.amed.dto.receiptmanagement;

public class ServiceDetailsDTO {
    private Integer id;
    private Boolean isSuplPayment;
    private Double summ;

    public ServiceDetailsDTO(Integer id, Boolean isSuplPayment, Double summ) {
        this.id=id;
        this.isSuplPayment=isSuplPayment;
        this.summ=summ;
    }

    public Integer getId() {
        return id;
    }

    public Boolean getSuplPayment() {
        return isSuplPayment;
    }

    public Double getSumm() {
        return summ;
    }
}
