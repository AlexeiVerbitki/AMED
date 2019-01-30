package com.bass.amed.service;

import com.bass.amed.dto.TasksDTO;
import com.bass.amed.projection.TaskDetailsProjectionDTO;
import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.List;

@Service
public class TasksService
{
    private final static String TASK_QUERY = "SELECT new com.bass.amed.projection.TaskDetailsProjectionDTO( " +
            "RR.id as id," +
            "       RR.requestNumber  as requestNumber," +
            "       RR.startDate      as startDate," +
            "       RR.endDate        as endDate," +
            "       RR.currentStep    as currentStep," +
            "       RR.expired        as expired," +
            "       RR.critical       as critical," +
            "       PN.description    as processName," +
            "       RT.description    as requestType," +
            "       RRS.description   as step," +
            "       RRS.navigationUrl as navigationUrl," +
            "       RR.assignedUser   as assignedUser) " +
            "FROM RegistrationRequestsEntity RR, " +
            "  RequestTypesEntity RT, " +
            "  ProcessNamesEntity PN ," +
            "  RegistrationRequestStepsEntity RRS " +
            "WHERE RR.type.id = RT.id" +
            "  AND RT.processId = PN.id" +
            "  AND RT.id = RRS.requestTypeId" +
            "  AND RR.currentStep = RRS.code";
    private static final Logger LOGGER = LoggerFactory.getLogger(TasksService.class);
    @Autowired
    private EntityManagerFactory entityManagerFactory;

    public List<TaskDetailsProjectionDTO> retreiveTaskByFilter(TasksDTO filter)
    {
        EntityManager em = null;
        List<TaskDetailsProjectionDTO> taskDetails;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createQuery(createQuery(filter), TaskDetailsProjectionDTO.class);
            updateQueryWithValues(filter, query);

            taskDetails = query.getResultList();
            em.getTransaction().commit();
        }
        catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            LOGGER.info(e.getMessage());
            LOGGER.debug(e.getMessage());
            throw e;
        }

        finally
        {
            em.close();
        }

        return taskDetails;
    }

    private String createQuery(TasksDTO filter)
    {
        StringBuilder stringBuilder = new StringBuilder(TASK_QUERY);

        if (Strings.isNotEmpty(filter.getRequestNumber()))
        {
            stringBuilder.append(" AND RR.requestNumber = :requestNumber");  // 104457
            return stringBuilder.toString();
        }


        if (filter.getRequest() != null)
        {
            stringBuilder.append(" AND PN.id = :processId");
        }

        if (filter.getRequestType() != null)
        {
            stringBuilder.append(" AND RT.id = :requestTypeId");
        }

        if (filter.getStep() != null)
        {
            stringBuilder.append(" AND RRS.id = :registrationRequestStepId");
        }

        if (Strings.isNotEmpty(filter.getAssignedPerson()))
        {
            stringBuilder.append(" AND RR.assignedUser like  (:assignedUser)");
        }
        if (filter.getStartDate() != null)
        {
            stringBuilder.append(" AND RR.startDate >= :startDate");
        }

        if (filter.getEndDate() != null)
        {
            stringBuilder.append(" AND RR.endDate <= :endDate");
        }

        stringBuilder.append(" ORDER BY RR.id desc");
        return stringBuilder.toString();
    }

    private void updateQueryWithValues(TasksDTO filter, Query query)
    {
        if (Strings.isNotEmpty(filter.getRequestNumber()))
        {
            query.setParameter("requestNumber", filter.getRequestNumber());
            return;
        }

        if (filter.getRequest() != null)
        {
            query.setParameter("processId", filter.getRequest().getId());
        }

        if (filter.getRequestType() != null)
        {
            query.setParameter("requestTypeId", filter.getRequestType().getId());
        }

        if (filter.getStep() != null)
        {
            query.setParameter("registrationRequestStepId", filter.getStep().getId());
        }

        if (Strings.isNotEmpty(filter.getAssignedPerson()))
        {
            query.setParameter("assignedUser", "%" + filter.getAssignedPerson() + "%");
        }
        if (filter.getStartDate() != null)
        {
            query.setParameter("startDate", filter.getStartDate());
        }

        if (filter.getEndDate() != null)
        {
            query.setParameter("endDate", filter.getEndDate());
        }
    }
}
