package com.bass.amed.dto.receiptmanagement;

import java.util.*;
import java.util.stream.Collectors;

public class PayOrderDTO {
    private String payOrderNr;
    private Date emissionDate;
    private Map<Integer, ServiceDetailsDTO> serviceDetailsMap;
    private Map<Integer, ReceipDetailsDTO> receipDetailsMap;

    public PayOrderDTO(String payOrderNr, Date emissionDate, ServiceDetailsDTO serviceDetail, ReceipDetailsDTO receipDetail) {
        this.serviceDetailsMap = new HashMap<>();
        this.receipDetailsMap = new HashMap<>();
        this.payOrderNr = payOrderNr;
        this.emissionDate = emissionDate;
        addserviceDetails(serviceDetail);
        if (receipDetail != null) {
            addReceipDetails(receipDetail);
        }
    }

    public void addReceipDetails(ReceipDetailsDTO receipDetail) {
        this.receipDetailsMap.put(receipDetail.getPayedId(), receipDetail);
    }

    public void addserviceDetails(ServiceDetailsDTO serviceDetail) {
        this.serviceDetailsMap.put(serviceDetail.getId(), serviceDetail);
    }

    public String getPayOrderNr() {
        return payOrderNr;
    }

    public Date getEmissionDate() {
        return emissionDate;
    }

    public List<ServiceDetailsDTO> getServiceDetailsMap() {
        return new ArrayList<>(serviceDetailsMap.values());
    }

    public Map<Integer, ServiceDetailsDTO> getServiceDetailsMapForCheck() {
        return serviceDetailsMap;
    }

    public List<ReceipDetailsDTO> getReceipDetailsMap() {
        return new ArrayList<>(receipDetailsMap.values());
    }

    public Map<Integer, ReceipDetailsDTO> getReceipDetailsMapForCheck() {
        return receipDetailsMap;
    }

    public Double getServiceTotal() {
        Double serviceTotal = serviceDetailsMap.values().stream().mapToDouble(value -> value.getSumm()).sum();
        return serviceTotal;
    }

    public Boolean isSuplPayment(){
        return !serviceDetailsMap.values().stream().filter(value -> value.getSuplPayment()).collect(Collectors.toList()).isEmpty();
    }

}
