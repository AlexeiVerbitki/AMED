package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@Table(name = "clinic_trail_notification_type", schema = "amed", catalog = "")
public class ClinicTrailNotificationTypeEntity {

    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "name")
    private String name;
}
