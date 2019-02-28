package com.bass.amed.dto.receiptmanagement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RequestDetailDTO {

    private Integer reqId;
    private String reqNumber;
    private String economicAgent;
    private Map<String, PayOrderDTO> payOrdersMap;

    public RequestDetailDTO(Integer reqId, String reqNumber, String economicAgent, PayOrderDTO payOrderDetails) {
        payOrdersMap = new HashMap<>();
        this.reqId = reqId;
        this.reqNumber = reqNumber;
        this.economicAgent = economicAgent;
        addPayOrder(payOrderDetails);
    }

    public void addPayOrder(PayOrderDTO payOrder) {
        this.payOrdersMap.put(payOrder.getPayOrderNr(), payOrder);
    }

    public Integer getReqId() {
        return reqId;
    }

    public String getReqNumber() {
        return reqNumber;
    }

    public String getEconomicAgent() {
        return economicAgent;
    }

    public List<PayOrderDTO> getPayOrdersMap() {
        return new ArrayList<>(payOrdersMap.values());
    }

    public Map<String, PayOrderDTO> getPayOrdersMapForCheck() {
        return payOrdersMap;
    }

    public Double getCalculatedDepth() {
        Double requestPayOrdersTotal = payOrdersMap.values().stream().mapToDouble(value ->
                value.getServiceDetailsMap().stream().mapToDouble(service -> !service.getSuplPayment() ? service.getSumm() : 0).sum()).sum();
        Double requestReceiptsTotal = payOrdersMap.values().stream().mapToDouble(value ->
                value.getReceipDetailsMap().stream().mapToDouble(receipt-> receipt.getPayedAmmount()).sum()).sum();
        return requestPayOrdersTotal - requestReceiptsTotal;
    }
}
