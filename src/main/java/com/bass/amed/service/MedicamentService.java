package com.bass.amed.service;

import com.bass.amed.dto.DrugsNomenclator;
import org.hibernate.jpa.QueryHints;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@Service
public class MedicamentService
{
    private static final Logger LOGGER = LoggerFactory.getLogger(MedicamentService.class);
    private static final String queryString = "SELECT m.id,\n" +
            "       m.name          AS denumireComerciala,\n" +
            "       m.code          AS codulMed,\n" +
            "       m.customs_code  AS codVamal,\n" +
            "       ph.description  AS formaFarmaceutica,\n" +
            "       m.dose          AS doza,\n" +
            "       m.volume        AS volum,\n" +
            "       m.division      AS divizare,\n" +
            "       m.atc_code      AS atc,\n" +
            "       nmm.description AS firmaProducatoare\n" +
            "FROM medicament m,\n" +
            "     nm_pharmaceutical_forms ph,\n" +
            "     medicament_manufactures mm,\n" +
            "     nm_manufactures nmm\n" +
            "WHERE m.status = 'F'\n" +
            "  AND (m.expiration_date > sysdate() OR m.unlimited_registration_period = 1)\n" +
            "  AND m.pharmaceutical_form_id = ph.id\n" +
            "  AND m.id = mm.medicament_id\n" +
            "  AND mm.producator_produs_finit = TRUE\n" +
            "  AND mm.manufacture_id = nmm.id;";

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Transactional(readOnly = true)
    public List<String> retreiveAllMedicamentDetails()
    {
        EntityManager em = null;

        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNativeQuery(queryString).setHint(QueryHints.HINT_FETCH_SIZE, 100);

            long startTime = System.nanoTime();
            List<Object> result = query.getResultList();

//            ((Object[])result.get(0));
                    for(Object obj: result)
                    {
                        System.out.println(obj);
                    }

            long endTime = System.nanoTime();

            long duration = (endTime - startTime) / 1_000_000 / 1_000;
            System.out.println("sql duration: " + duration);


            System.out.println(result.size());

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

        return new ArrayList<>();
    }
}
