package com.bass.amed.dto;

import com.bass.amed.entity.PaymentOrdersEntity;
import lombok.Data;

import java.util.List;

@Data
public class BonDePlataDTO
{
    private String currency;
    private String companyName;
    private String companyCountry;
    private List<PaymentOrdersEntity> paymentOrders;
    private String address;
    private Integer requestId;
    List<BonDePlataMedicamentDTO> medicamentDetails;
}
