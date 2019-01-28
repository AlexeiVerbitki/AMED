package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Data
@Entity
@Table(name = "audit_log", schema = "amed")
public class AuditLogEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "field")
    private String field;
    @Basic
    @Column(name = "old_value")
    private String oldValue;
    @Basic
    @Column(name = "new_value")
    private String newValue;
    @Basic
    @Column(name = "date_time")
    private Timestamp dateTime;
    @Basic
    @Column(name = "action")
    private String action;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "user_id")
    private ScrUserEntity user;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "category_id")
    private NmAuditCategoryEntity category;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "subcategory_id")
    private NmAuditSubcategoryEntity subcategory;
    @Transient
    private String categoryName;
    @Transient
    private String subCategoryName;

    public AuditLogEntity withField(String field){
        this.field = field;
        return this;
    }

    public AuditLogEntity withOldValue(String oldValue){
        this.oldValue = oldValue;
        return this;
    }

    public AuditLogEntity withNewValue(String newValue){
        this.newValue = newValue;
        return this;
    }

    public AuditLogEntity withAction(String action)
    {
        this.action = action;
        return this;
    }

    public AuditLogEntity withCategoryName(String categoryName){
        this.categoryName = categoryName;
        return this;
    }

    public AuditLogEntity withSubCategoryName(String subCategoryName){
        this.subCategoryName = subCategoryName;
        return this;
    }

}
