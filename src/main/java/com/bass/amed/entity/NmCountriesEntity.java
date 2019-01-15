package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_countries", schema = "amed", catalog = "")
public class NmCountriesEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "code")
    private String code;
    @Basic@Column(name = "description")
    private String description;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )@JoinColumn( name = "group_id" )
    private NmCountryGroupEntity group;

}
