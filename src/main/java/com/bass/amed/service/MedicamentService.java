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
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class MedicamentService
{
    private static final Logger LOGGER      = LoggerFactory.getLogger(MedicamentService.class);
    private static final String queryString = "SELECT m.id,\n" +
                                                      "       m.name                         AS denumireComerciala,\n" +
                                                      "       m.code                         AS codulMed,\n" +
                                                      "       m.customs_code                 AS codVamal,\n" +
                                                      "       NPF.description                AS formaFarmaceutica,\n" +
                                                      "       m.dose                         AS doza,\n" +
                                                      "       m.volume                       AS volum,\n" +
                                                      "       m.division                     AS divizare,\n" +
                                                      "       m.atc_code                     AS atc,\n" +
                                                      "       nmm.description                AS firmaProducatoare,\n" +
                                                      "       m.registration_number          AS nrDeInregistrare,\n" +
                                                      "       m.registration_date            AS dataInregistrarii,\n" +
                                                      "       m.originale                    AS original,\n" +
                                                      "       m.prescription                 AS statutDeEliberare,\n" +
                                                      "       NMIM.description               AS dci,\n" +
                                                      "       nnmm.description               AS detinatorulCertificatuluiDeIntreg,\n" +
                                                      "       nmct.description               AS taraDetinatorului,\n" +
                                                      "       (SELECT GROUP_CONCAT(mi.path SEPARATOR '; ')\n" +
                                                      "        FROM medicament_instructions mi\n" +
                                                      "        WHERE mi.medicament_id = m.id\n" +
                                                      "          AND mi.type = 'I'\n" +
                                                      "        GROUP BY medicament_id, type) AS instructiunea,\n" +
                                                      "       (SELECT GROUP_CONCAT(mi.path SEPARATOR '; ')\n" +
                                                      "        FROM medicament_instructions mi\n" +
                                                      "        WHERE mi.medicament_id = m.id\n" +
                                                      "          AND mi.type = 'M'\n" +
                                                      "        GROUP BY medicament_id, type) AS machetaAmbalajului\n" +
                                                      "FROM medicament m\n" +
                                                      "       LEFT JOIN nm_pharmaceutical_forms NPF ON m.pharmaceutical_form_id = NPF.id\n" +
                                                      "       LEFT JOIN medicament_manufactures mm ON m.id = mm.medicament_id AND mm.producator_produs_finit = TRUE\n" +
                                                      "       LEFT JOIN nm_manufactures nmm ON mm.manufacture_id = nmm.id\n" +
                                                      "       LEFT JOIN nm_international_medicament_names nmim ON m.international_name_id = NMIM.id\n" +
                                                      "       LEFT JOIN nm_manufactures nnmm ON m.authorization_holder_id = NNMM.id\n" +
                                                      "       LEFT JOIN nm_countries nmct ON NNMM.country_id = NMCT.id\n" +
                                                      "WHERE m.status = 'F'\n" +
                                                      "  AND (m.expiration_date > sysdate() OR m.unlimited_registration_period = 1);";

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Transactional(readOnly = true)
    public List<DrugsNomenclator> retreiveAllMedicamentDetails()
    {
        EntityManager          em                = null;
        List<DrugsNomenclator> drugsNomenclators = new ArrayList<>();
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNativeQuery(queryString).setHint(QueryHints.HINT_FETCH_SIZE, 100);

            long           startTime = System.nanoTime();
            List<Object[]> result    = query.getResultList();

            long endTime = System.nanoTime();

            long duration = (endTime - startTime) / 1_000_000 / 1_000;
            System.out.println("sql duration: " + duration);


            long streamTime = System.nanoTime();
            result.stream().forEach(record -> {
                DrugsNomenclator drugsNomenclator = new DrugsNomenclator();
//                drugsNomenclator.setId((Integer) record[0]);
                drugsNomenclator.setDenumireComerciala((String) record[1]);
                drugsNomenclator.setCodulMed((String) record[2]);
                drugsNomenclator.setCodVamal((Integer) record[3]);
                drugsNomenclator.setFormaFarmaceutica((String) record[4]);
                drugsNomenclator.setDoza((String) record[5]);
                drugsNomenclator.setVolum((String) record[6]);
                drugsNomenclator.setDivizare((String) record[7]);
                drugsNomenclator.setAtc((String) record[8]);
                drugsNomenclator.setFirmaProducatoare((String) record[9]);
                drugsNomenclator.setNrDeInregistrare((Integer) record[10]);
                drugsNomenclator.setDataInregistrarii((Timestamp) record[11]);
                drugsNomenclator.setOriginal(Boolean.TRUE.equals(record[12]) ? "Da" : "Nu");
                drugsNomenclator.setStatutDeEliberare(Boolean.TRUE.equals( record[13]) ? "Da" : "Nu");
                drugsNomenclator.setDci((String) record[14]);
                drugsNomenclator.setDetinatorulCertificatuluiDeIntreg((String) record[15]);
                drugsNomenclator.setTaraDetinatorului((String) record[16]);
                drugsNomenclator.setInstructiunea((String) record[17]);
                drugsNomenclator.setMachetaAmbalajului((String) record[18]);
                drugsNomenclators.add(drugsNomenclator);
            });

            long streamEndTime = System.nanoTime();

            long streamDuration = (streamEndTime - streamTime) / 1_000_000 / 1_000;
            System.out.println("Stream duration: " + streamDuration);


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

        return drugsNomenclators;
    }
}
