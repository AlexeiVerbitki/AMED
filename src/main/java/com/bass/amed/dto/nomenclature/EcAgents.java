package com.bass.amed.dto.nomenclature;

import com.bass.amed.entity.NmEconomicAgentsEntity;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class EcAgents implements Serializable
{
    private List<NmEconomicAgentsEntity> nmEconomicAgents;
}
