package com.bass.amed.service;

import com.bass.amed.dto.TasksDTO;
import com.bass.amed.projection.TaskProjection;
import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@Service
public class TasksService
{
    private final static String TASK_QUERY = "SELECT RR.ID,\n" +
            "       RR.REQUEST_NUMBER  as requestNumber,\n" +
            "       RR.START_DATE      as startDate,\n" +
            "       RR.END_DATE        as endDate,\n" +
            "       PN.DESCRIPTION     as processName,\n" +
            "       RT.DESCRIPTION     as requestType,\n" +
            "       RRS.DESCRIPTION    as step,\n" +
            "       RRS.NAVIGATION_URL as navigationUrl,\n" +
            "       RRH.USERNAME       as username\n" +
            "FROM REGISTRATION_REQUESTS RR,\n" +
            "     REQUEST_TYPES RT,\n" +
            "     PROCESS_NAMES PN,\n" +
            "     REGISTRATION_REQUEST_STEPS RRS,\n" +
            "     REGISTRATION_REQUEST_HISTORY RRH\n" +
            "WHERE RR.TYPE_ID = RT.ID\n" +
            "  AND RT.PROCESS_ID = PN.ID\n" +
            "  AND RT.ID = RRS.REQUEST_TYPE_ID\n" +
            "  AND RR.CURRENT_STEP = RRS.CODE\n" +
            "  AND RR.ID = RRH.REGISTRATION_REQUEST_ID\n" +
            "  AND RR.CURRENT_STEP = RRH.STEP";
    private static final Logger LOGGER = LoggerFactory.getLogger(TasksService.class);
    @Autowired
    private EntityManagerFactory entityManagerFactory;

    public List<TaskProjection> retreiveTaskByFilter(TasksDTO filter)
    {
        EntityManager em = null;
        List<TaskProjection> taskProjections = new ArrayList<>();
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNamedQuery(createQuery(filter), TaskProjection.class);

            taskProjections = query.getResultList();
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
            return taskProjections;
        }

        finally
        {
            em.close();
        }

        return taskProjections;
    }

    private String createQuery(TasksDTO filter)
    {
        StringBuilder stringBuilder = new StringBuilder(TASK_QUERY);

        if (Strings.isNotEmpty(filter.getRequestNumber()))
        {
            stringBuilder.append(" AND RR.REQUEST_NUMBER = :requestNumber;");  // 104457
            return stringBuilder.toString();
        }

        if (Strings.isNotEmpty(filter.getAssignedPerson()))
        {
            stringBuilder.append(" AND RR.REQUEST_NUMBER = :requestNumber");
        }

        if (filter.getRequest() != null)
        {
            stringBuilder.append(" AND RR.REQUEST_NUMBER = :requestNumber");
        }

        if (filter.getRequestType() != null)
        {
            stringBuilder.append(" AND RR.REQUEST_NUMBER = :requestNumber");
        }

        if (filter.getStep() != null)
        {
            stringBuilder.append(" AND RR.REQUEST_NUMBER = :requestNumber");
        }

        if (filter.getStartDate() != null)
        {
            stringBuilder.append(" AND RR.START_DATE = :startDate");
        }

        if (filter.getEndDate() != null)
        {
            stringBuilder.append(" AND RR.END_DATE = :endDate");
        }


        return stringBuilder.toString();
    }
}
