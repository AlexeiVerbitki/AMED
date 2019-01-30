package com.bass.amed.dto;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity
public class EconomicAgentsNomenclator {
    @Id
    private Integer id;
    private String nr;
    private String name;
    private String address;
    private String serialNr;
    private String idno;
}
