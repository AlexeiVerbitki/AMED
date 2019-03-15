package com.bass.amed.service;

import com.bass.amed.dto.TasksDTO;
import com.bass.amed.projection.TaskDetailsProjectionDTO;
import com.bass.amed.repository.RequestTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TasksService {
    private final static String TASK_QUERY =
            "SELECT " +
                    " RREQ.id AS id," +
                    " RREQ.request_number AS requestNumber," +
                    " RREQ.start_date AS startDate," +
                    " RREQ.end_date AS endDate," +
                    " COMP.name AS company," +
                    " CONCAT( MANCONT.mandated_firstname, ' ', MANCONT.mandated_lastname) AS mandatedContact," +
                    " STEP.description AS step," +
                    " STEP.navigation_url AS navigationUrl, " +
                    " RREQ.expired AS expired, " +
                    " RREQ.critical AS critical, " +
                    " RREQ.reg_subject AS regSubject " +
                    " FROM registration_requests RREQ " +
                    " LEFT JOIN nm_economic_agents COMP on COMP.id=RREQ.company_id " +
                    " LEFT JOIN registration_request_mandated_contact MANCONT on MANCONT.registration_request_id=RREQ.id " +
                    " LEFT JOIN registration_request_steps STEP on (STEP.request_type_id=RREQ.type_id and STEP.code=RREQ.current_step) " +
                    " WHERE 1=1" ;
    private static final Logger LOGGER = LoggerFactory.getLogger(TasksService.class);
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    @Autowired
    RequestTypeRepository requestTypeRepository;

    public List<TaskDetailsProjectionDTO> retreiveTaskByFilter(TasksDTO filter) {
        EntityManager em = null;
        List<TaskDetailsProjectionDTO> taskDetails = new ArrayList<>();
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNativeQuery(createQuery(filter));


            updateQueryWithValues(filter, query);

            List<Object[]> results = query.getResultList();
            results.stream().forEach(record -> {
                if( ((Integer)record[0]).equals(2821))
                {
                    System.out.println(record);
                }
                TaskDetailsProjectionDTO taskProj = new TaskDetailsProjectionDTO((Integer) record[0], (String) record[1], (Date) record[2], (Date) record[3], (String) record[4], (String) record[5], (String) record[6], (String) record[7], (Boolean)record[8], (Boolean)record[9], (String) record[10]);
                taskDetails.add(taskProj);
            });
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            LOGGER.info(e.getMessage());
            LOGGER.debug(e.getMessage());
            throw e;
        } finally {
            em.close();
        }

        return taskDetails;
    }

    private String createQuery(TasksDTO filter) {
        StringBuilder stringBuilder = new StringBuilder(TASK_QUERY);

        if (filter.getRequestCode() != null && !filter.getRequestCode().isEmpty()) {
            stringBuilder.append(" AND RREQ.request_number like (:requestNumber)");
        }

        if (filter.getRequestNumber() != null && !filter.getRequestNumber().isEmpty()) {
            stringBuilder.append(" AND RREQ.request_number like (:requestNumber2)");
        }

        if (filter.getStartDateFrom() != null) {
            if (filter.getStartDateTo() != null) {
                stringBuilder.append(" AND RREQ.start_date BETWEEN :startDateFrom AND :startDateTo");
            } else {
                stringBuilder.append(" AND RREQ.start_date >= :startDateFrom");
            }
        }

        if (filter.getComanyId() != null) {
            stringBuilder.append(" AND RREQ.company_id=:companyId");
        }

        if (filter.getProcessId() != null) {
            if (filter.getProcessTypeId() != null) {
                stringBuilder.append(" AND RREQ.type_id=:typeId");
                if (filter.getStepCode() != null && !filter.getStepCode().isEmpty()) {
                    stringBuilder.append(" AND RREQ.current_step=:currentStep");
                }
            }else {
                stringBuilder.append(" AND RREQ.type_id IN :typeIdList");
            }
        }

        stringBuilder.append(" ORDER BY RREQ.id desc");
        return stringBuilder.toString();
    }

    private void updateQueryWithValues(TasksDTO filter, Query query) {
        if (filter.getRequestCode() != null && !filter.getRequestCode().isEmpty()) {
            query.setParameter("requestNumber", filter.getRequestCode().concat("-") + "%");
        }

        if (filter.getRequestNumber() != null && !filter.getRequestNumber().isEmpty()) {
            query.setParameter("requestNumber2", "%".concat(filter.getRequestNumber()).concat("%"));
        }

        if (filter.getStartDateFrom() != null) {
            if (filter.getStartDateTo() != null) {
                query.setParameter("startDateFrom", filter.getStartDateFrom());
                query.setParameter("startDateTo", filter.getStartDateTo());
            } else {
                query.setParameter("startDateFrom", filter.getStartDateFrom());
            }
        }

        if (filter.getComanyId() != null) {
            query.setParameter("companyId", filter.getComanyId());
        }

        if (filter.getProcessId() != null) {
            if (filter.getProcessTypeId() != null) {
                query.setParameter("typeId", filter.getProcessTypeId());
                if (filter.getStepCode() != null && !filter.getStepCode().isEmpty()) {
                    query.setParameter("currentStep", filter.getStepCode());
                }
            }else {
                List<Integer>idList= requestTypeRepository.findIdByProcessId(filter.getProcessId());
                query.setParameter("typeIdList",idList);
            }
        }
    }
}
