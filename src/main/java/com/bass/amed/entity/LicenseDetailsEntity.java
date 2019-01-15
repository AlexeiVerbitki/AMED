package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "license_details", schema = "amed")
public class LicenseDetailsEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "registration_id")
    private Integer registrationId;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_detail_id")
    private Set<LicenseResolutionEntity> resolutions;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_detail_id")
    private Set<LicenseCommisionResponseEntity> commisionResponses;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_detail_id")
    private Set<LicenseMandatedContactEntity> licenseMandatedContacts;

    public LicenseDetailsEntity()
    {
    }
}
