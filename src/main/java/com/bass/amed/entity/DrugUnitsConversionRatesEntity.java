package com.bass.amed.entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "drug_units_conversion_rates")
public class DrugUnitsConversionRatesEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private long id;

  @Basic
  @Column(name = "unit_code")
  private String unitCode;

  @Basic
  @Column(name = "ref_unit_code")
  private String refUnitCode;

  @Basic
  @Column(name = "unit_code_rate")
  private double unitCodeRate;

  @Basic
  @Column(name = "ref_unit_code_rate")
  private double refUnitCodeRate;

  @Basic
  @Column(name = "unit_code_description")
  private String unitCodeDescription;
}
