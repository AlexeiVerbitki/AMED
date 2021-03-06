package com.bass.amed.entity;

import com.bass.amed.common.Constants;
import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

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
    @Column(name = "entity_id")
    private Integer entityId;
    @Basic
    @Column(name = "request_id")
    private Integer requestId;
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

    public AuditLogEntity withOldValue(Object oldValue){
        if (oldValue instanceof String)
        {
            this.oldValue = (String)oldValue;
        }
        else if (oldValue instanceof Timestamp)
        {
            SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.Layouts.DATE_TIME_FORMAT);
            this.oldValue = dateFormat.format((Timestamp)oldValue);
        }
        else if (oldValue instanceof Integer)
        {
            this.oldValue = String.valueOf(oldValue);
        }
        return this;
    }

    public AuditLogEntity withNewValue(Object newValue){
        if (newValue instanceof String)
        {
            this.newValue = (String)newValue;
        }
        else if (newValue instanceof Timestamp)
        {
            SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.Layouts.DATE_TIME_FORMAT);
            this.newValue = dateFormat.format((Timestamp)newValue);
        }
        else if (newValue instanceof Integer)
        {
            this.newValue = String.valueOf(newValue);
        }
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

    public AuditLogEntity withEntityId(Integer entityId){
        this.entityId = entityId;
        return this;
    }

    public AuditLogEntity withRequestId(Integer requestId){
        this.requestId = requestId;
        return this;
    }

}
