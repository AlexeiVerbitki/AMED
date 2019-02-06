package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity
@Table(name = "gdp_inspection", schema = "amed")
public class GDPInspectionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "request_id")
    @JsonBackReference
    private RegistrationRequestsEntity registrationRequest;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "GDP_INSPECTORS", joinColumns = {
            @JoinColumn(name = "gdp_inspection_id")}, inverseJoinColumns = {
            @JoinColumn(name = "employer_id")})
    private Set<NmEmployeesEntity> documents;
}
