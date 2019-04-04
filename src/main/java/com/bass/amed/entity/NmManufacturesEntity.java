package com.bass.amed.entity;

import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_manufactures", schema = "amed", catalog = "")
public class NmManufacturesEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "code")
    private String code;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "long_description")
    private String longDescription;
    @Basic@Column(name = "idno")
    private String idno;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )@JoinColumn( name = "country_id" )@Fetch(FetchMode.JOIN)
    private NmCountriesEntity country;
    @Basic@Column(name = "authorization_holder")
    private Byte authorizationHolder;
    @Basic@Column(name = "address")
    private String address;


}
