package com.bass.amed.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Table(name = "scr_user")
public class ScrUserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "fullname")
    private String fullname;
    @Column(name = "username")
    private String username;
    @Column(name = "phone_number")
    private String phoneNumber;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST}, fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private ScrRoleEntity srcRole;

}
