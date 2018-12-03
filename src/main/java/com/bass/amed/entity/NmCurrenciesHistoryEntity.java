package com.bass.amed.entity;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "nm_currencies_history", schema = "amed", catalog = "")
public class NmCurrenciesHistoryEntity
{

    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "period")
    private Date period;

    @Basic
    @Column(name = "value")
    private Double value;

    @Basic
    @Column(name = "multiplicity")
    private Integer multiplicity;

    @OneToOne
    @JoinColumn(name = "currency_id", referencedColumnName = "id")
    private NmCurrenciesEntity currency;

}
