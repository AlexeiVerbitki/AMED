package com.bass.amed.dto.clinicaltrial;

import com.bass.amed.entity.ClinicalTrialsEntity;
import com.bass.amed.entity.CtPaymentOrdersEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.RegistrationRequestMandatedContactEntity;
import lombok.Data;

@Data
public class ClinicalTrialPayNoteDTO {

    private Integer requestType;
    private Integer clinicalTrialId;
    private NmEconomicAgentsEntity economicAgent;
    private CtPaymentOrdersEntity payOrder;
    private String currency;
    private RegistrationRequestMandatedContactEntity mandatedContactEntity;
}
