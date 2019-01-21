package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "expert_list", schema = "amed")
public class ExpertListEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "intern")
    private Boolean intern;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "expert_id" )
    private NmEmployeesEntity expert;
    @Basic@Column(name = "expert_name")
    private String expertName;
    @Basic@Column(name = "date")
    private Timestamp date;
    @Basic@Column(name = "number")
    private String number;
    @Basic@Column(name = "decision")
    private String decision;
    @Basic@Column(name = "request_additional_data_number")
    private String requestAdditionalDataNumber;
}
