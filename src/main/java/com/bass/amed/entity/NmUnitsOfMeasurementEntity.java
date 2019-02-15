package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "nm_units_of_measurement", schema = "amed", catalog = "")
public class NmUnitsOfMeasurementEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "code")
    private String code;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "category")
    private String category;

}
