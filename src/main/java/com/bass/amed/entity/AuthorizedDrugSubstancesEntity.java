package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "authorized_drug_substances")
public class AuthorizedDrugSubstancesEntity {

    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "substance_code")
    private String substanceCode;

    @Basic
    @Column(name = "substance_name")
    private String substanceName;

    @Basic
    @Column(name = "medicament_active_substances_id")
    private Integer medicamentActiveSubstancesId;

    @Basic
    @Column(name = "substance_type")
    private String substanceType;

    @Basic
    @Column(name = "authorization_type")
    private String authorizationType;

    @Basic
    @Column(name = "drug_substance_types_id")
    private Integer drugSubstanceTypesId;

    @Basic
    @Column(name = "from_date")
    private Timestamp fromDate;

    @Basic
    @Column(name = "to_date")
    private Timestamp toDate;

    @Basic
    @Column(name = "quantity")
    private Double quantity;
}
