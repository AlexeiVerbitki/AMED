package com.bass.amed.dto;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Data
@Entity
public class PrevYearAvgPriceDTO implements Serializable
{
    @Id
    private Integer year;
    private Double avgPrice;
}
