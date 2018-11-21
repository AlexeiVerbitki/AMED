package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name = "samsa", schema = "amed", catalog = "")
public class SamsaEntity
{
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "medicament_id")
    private Integer medicamentId;
    @Basic
    @Column(name = "distribution_mandate_nr")
    private Integer distributionMandateNr;
    @Basic
    @Column(name = "distribution_mandate_date")
    private Date distributionMandateDate;

}
