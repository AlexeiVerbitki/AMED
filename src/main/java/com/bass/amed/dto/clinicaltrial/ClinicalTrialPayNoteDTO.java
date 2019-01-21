package com.bass.amed.dto.clinicaltrial;

import com.bass.amed.entity.ClinicalTrialsEntity;
import com.bass.amed.entity.CtPaymentOrdersEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import lombok.Data;

@Data
public class ClinicalTrialPayNoteDTO {

    private ClinicalTrialsEntity clinicalTrial;
    private NmEconomicAgentsEntity economicAgent;
    private CtPaymentOrdersEntity payOrder;
    private String currency;
}
