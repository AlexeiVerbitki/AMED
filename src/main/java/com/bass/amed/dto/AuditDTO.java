package com.bass.amed.dto;

import com.bass.amed.entity.NmAuditCategoryEntity;
import com.bass.amed.entity.NmAuditSubcategoryEntity;
import com.bass.amed.entity.ScrUserEntity;
import lombok.Data;

import java.util.Date;

@Data
public class AuditDTO
{
    private NmAuditCategoryEntity    category;
    private NmAuditSubcategoryEntity subcategory;
    private ScrUserEntity            username;
    private String                   action;
    private Date                     fromDate;
    private Date                     toDate;
}
