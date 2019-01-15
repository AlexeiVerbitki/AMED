package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Data
@Entity
@Table(name = "license_commision_response", schema = "amed")
public class LicenseCommisionResponseEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "entry_rsp_number")
    private String entryRspNumber;
    @Basic
    @Column(name = "organization")
    private String organization;
    @OneToOne( fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "method_id")
    private LicenseAnnounceMethodsEntity announcedMethods;
    @Basic
    @Column(name = "extra_data")
    private String extraData;

}
