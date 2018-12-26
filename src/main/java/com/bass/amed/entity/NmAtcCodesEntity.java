package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_atc_codes", schema = "amed", catalog = "")
public class NmAtcCodesEntity {
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "parent_id")
    private Integer parentId;
    @Basic@Column(name = "code")
    private String code;
    @Basic@Column(name = "description")
    private String description;

}
