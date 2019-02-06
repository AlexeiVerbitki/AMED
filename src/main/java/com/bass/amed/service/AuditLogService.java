package com.bass.amed.service;

import com.bass.amed.dto.AuditDTO;
import com.bass.amed.entity.AuditLogEntity;
import com.bass.amed.entity.ScrUserEntity;
import com.bass.amed.projection.AuditProjection;
import com.bass.amed.repository.AuditCategoryRepository;
import com.bass.amed.repository.AuditLogRepository;
import com.bass.amed.repository.AuditSubcategoryRepository;
import com.bass.amed.repository.SrcUserRepository;
import com.bass.amed.utils.SecurityUtils;
import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class AuditLogService
{
    private final static String AUDIT_QUERY = "SELECT " +
            "ale.field, " +
            "ale.old_value as oldValue, " +
            "ale.new_value as newValue, " +
            "ale.action, " +
            "sue.fullname as user, " +
            "ale.date_time as dateTime, " +
            "nmc.description as category, " +
            "nms.description as subcategory " +
            "FROM audit_log ale " +
            "LEFT JOIN scr_user sue ON ale.user_id = sue.id " +
            "LEFT JOIN nm_audit_category nmc ON ale.category_id = nmc.id " +
            "LEFT JOIN nm_audit_subcategory nms ON ale.subcategory_id = nms.id ";


    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private SrcUserRepository srcUserRepository;

    @Autowired
    private AuditCategoryRepository auditCategoryRepository;

    @Autowired
    private AuditSubcategoryRepository auditSubcategoryRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    private static final Logger LOGGER = LoggerFactory.getLogger(AuditLogService.class);

    @Transactional(propagation=Propagation.REQUIRED)
    public void save(AuditLogEntity dummyEntity)
    {
        dummyEntity.setDateTime(new Timestamp(new Date().getTime()));
        ScrUserEntity userEntity = srcUserRepository.findOneWithAuthoritiesByUsername(SecurityUtils.getCurrentUser().orElse(null)).orElse(null);
        dummyEntity.setUser(userEntity);

        if (dummyEntity.getCategoryName() != null)
        {
            dummyEntity.setCategory(auditCategoryRepository.findByName(dummyEntity.getCategoryName()).orElse(null));
        }

        if (dummyEntity.getSubCategoryName() != null)
        {
            dummyEntity.setSubcategory(auditSubcategoryRepository.findByName(dummyEntity.getSubCategoryName()).orElse(null));
        }

        auditLogRepository.save(dummyEntity);
    }

    public void saveAll(List<AuditLogEntity> dummyEntities)
    {
        for(AuditLogEntity dummyEntity : dummyEntities)
        {
            dummyEntity.setDateTime(new Timestamp(new Date().getTime()));
            ScrUserEntity userEntity = srcUserRepository.findOneWithAuthoritiesByUsername(SecurityUtils.getCurrentUser().orElse(null)).orElse(null);
            dummyEntity.setUser(userEntity);

            if (dummyEntity.getCategoryName() != null)
            {
                dummyEntity.setCategory(auditCategoryRepository.findByName(dummyEntity.getCategoryName()).orElse(null));
            }

            if (dummyEntity.getSubCategoryName() != null)
            {
                dummyEntity.setSubcategory(auditSubcategoryRepository.findByName(dummyEntity.getSubCategoryName()).orElse(null));
            }
        }
        auditLogRepository.saveAll(dummyEntities);
    }


    public List<AuditProjection> retrieveAnnihilationByFilter(AuditDTO filter)
    {
        EntityManager         em                  = null;
        List<AuditProjection> auditDetails = new ArrayList<>();
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNativeQuery(createQuery(filter));
            updateQueryWithValues(filter, query, filter.getFromDate(), filter.getToDate());

            List<Object[]> results = query.getResultList();
            results.stream().forEach(record -> {
                AuditProjection proj = new AuditProjection();
                proj.setField((String) record[0]);
                proj.setOldValue((String) record[1]);
                proj.setNewValue((String) record[2]);
                proj.setAction((String) record[3]);
                proj.setUser((String) record[4]);
                proj.setDatetime ((Date) record[5]);
                proj.setCategory((String) record[6]);
                proj.setSubcategory((String) record[7]);
                auditDetails.add(proj);
            });

            em.getTransaction().commit();
        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            LOGGER.info(e.getMessage());
            LOGGER.debug(e.getMessage());
            throw e;
        } finally
        {
            em.close();
        }

        return auditDetails;
    }


    private String createQuery(AuditDTO filter)
    {
        StringBuilder stringBuilder = new StringBuilder(AUDIT_QUERY);

        boolean firstCriteria = true;
        String WHERE = "WHERE";
        String AND = "AND";

        if (filter.getCategory() != null)
        {
            stringBuilder.append(" WHERE nmc.id = :category ");
        }
        if (filter.getSubcategory() != null)
        {
            stringBuilder.append(firstCriteria ? WHERE : AND).append(" nms.id = :subcategory ");
            firstCriteria = false;
        }
        if (filter.getUsername() != null)
        {
            stringBuilder.append(firstCriteria ? WHERE : AND).append(" sue.id = :user ");
            firstCriteria = false;
        }
        if (Strings.isNotEmpty(filter.getAction()))
        {
            stringBuilder.append(firstCriteria ? WHERE : AND).append(" ale.action = :action ");
            firstCriteria = false;
        }

        if (filter.getFromDate() != null)
        {
            stringBuilder.append(firstCriteria ? WHERE : AND).append(" ale.date_time >= :fromDate ");
            firstCriteria = false;
        }

        if (filter.getToDate() != null)
        {
            stringBuilder.append(firstCriteria ? WHERE : AND).append(" ale.date_time <= :toDate ");
            firstCriteria = false;
        }

        return stringBuilder.toString();
    }


    private void updateQueryWithValues(AuditDTO filter, Query query, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fromDate, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date toDate)
    {
        if (filter.getCategory() != null)
        {
            query.setParameter("category", filter.getCategory().getId());
        }
        if (filter.getSubcategory() != null)
        {
            query.setParameter("subcategory", filter.getSubcategory().getId());
        }
        if (filter.getUsername() != null)
        {
            query.setParameter("user", filter.getUsername().getId());
        }
        if (Strings.isNotEmpty(filter.getAction()))
        {
            query.setParameter("action", filter.getAction());
        }

        if (filter.getFromDate() != null)
        {
            query.setParameter("fromDate", filter.getFromDate());
        }

        if (filter.getToDate() != null)
        {
            query.setParameter("toDate", filter.getToDate());
        }
    }
}
