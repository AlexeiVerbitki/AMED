package com.bass.amed.service;

import com.bass.amed.projection.TaskDetailsProjectionDTO;
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
public class HomepageService {
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
                    " WHERE RREQ.current_step<>'F' " +
                    " AND RREQ.current_step<>'C' " +
                    " AND RREQ.current_step<>'AC' " +
                    " AND RREQ.current_step<>'AF' " +
                    " ORDER BY RREQ.id DESC";

    private static final Logger LOGGER = LoggerFactory.getLogger(HomepageService.class);

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    public List<TaskDetailsProjectionDTO> retreiveUnfinishedTask() {
        EntityManager em = null;
        List<TaskDetailsProjectionDTO> taskDetails = new ArrayList<>();
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNativeQuery(TASK_QUERY);

            List<Object[]> results = query.getResultList();
            results.stream().forEach(record -> {
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
}
