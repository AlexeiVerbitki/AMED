package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_bank_accounts", schema = "amed")
public class NmBankAccountsEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "description")
    private String description;
    @Column(name = "banknumber")
    private String banknumber;
    @Column(name = "bank_id")
    private Integer bankId;
    @Column(name = "currency_id")
    private Integer currencyId;
    @Column(name = "treasury_code")
    private String treasuryCode;
    @Column(name = "correspondent_bank_id")
    private Integer correspondentBankId;
    @Column(name = "correspondent_info")
    private String correspondentInfo;
}
