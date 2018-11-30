package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Set;

@Data
@Entity
@Table(name = "prices", schema = "amed")
public class PricesEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;

    @Basic
    @Column(name = "value")
    private BigDecimal value;

    @OneToOne(fetch = FetchType.EAGER) //, cascade = CascadeType.DETACH)
    @JoinColumn(name = "type_id")
    private PriceTypesEntity type;

    @OneToOne( fetch = FetchType.EAGER)//, cascade = CascadeType.DETACH )
    @JoinColumn( name = "currency_id" )
    private NmCurrenciesEntity currency;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "price_id")
    private Set<ReferencePricesEntity> referencePrices;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "medicament_id")
    private MedicamentEntity medicament;

    @Basic
    @Column(name = "folder_nr")
    private String folderNr;

    @Basic
    @Column(name = "mdl_value")
    private BigDecimal mdlValue;

    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE}, mappedBy = "priceRequest")
    @JsonManagedReference
    private NmPricesEntity nmPrice;
}
