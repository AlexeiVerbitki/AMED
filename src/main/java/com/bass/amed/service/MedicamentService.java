package com.bass.amed.service;

import com.bass.amed.dto.DrugsNomenclator;
import org.hibernate.jpa.QueryHints;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MedicamentService
{
    private static final Logger LOGGER      = LoggerFactory.getLogger(MedicamentService.class);
    private static final String queryString = "SELECT m.id,\n" +
            "       IFNULL(m.name, '')                                    AS denumireComerciala,\n" +
            "       IFNULL(m.code, '')                                    AS codulMed,\n" +
            "       IFNULL(m.customs_code, 0)                             AS codVamal,\n" +
            "       IFNULL(NPF.description, '')                           AS formaFarmaceutica,\n" +
            "       IFNULL(m.dose, '')                                    AS doza,\n" +
            "       IFNULL(CONCAT_WS(' ', m.volume, vum.description), '') AS volum,\n" +
            "       IFNULL(m.division, '')                                AS divizare,\n" +
            "       IFNULL(m.atc_code, '')                                AS atc,\n" +
            "       IFNULL(nmm.description, '')                           AS firmaProducatoare,\n" +
            "       IFNULL(m.registration_number, 0)                      AS nrDeInregistrare,\n" +
            "       m.registration_date                                   AS dataInregistrarii,\n" +
            "       IFNULL(m.originale, FALSE)                            AS original,\n" +
            "       CASE\n" +
            "         WHEN m.prescription = 1 THEN 'cu prescripție'\n" +
            "         WHEN m.prescription = 2 THEN 'staționar'\n" +
            "         ELSE 'fără prescripție'\n" +
            "        END                                                  AS statutDeEliberare,\n" +
            "       IFNULL(NMIM.description, '')                          AS dci,\n" +
            "       IFNULL(nnmm.description, '')                          AS detinatorulCertificatuluiDeIntreg,\n" +
            "       IFNULL(nmct.description, '')                          AS taraDetinatorului,\n" +
            "       IFNULL((SELECT GROUP_CONCAT(mi.path SEPARATOR '; ')\n" +
            "                      FROM\n" +
            "                      medicament_instructions mi\n" +
            "                      WHERE\n" +
            "                      mi.medicament_id = m.id\n" +
            "                        AND mi.type = 'I'\n" +
            "                      GROUP\n" +
            "                      BY\n" +
            "                      medicament_id,\n" +
            "                      type), '')                             AS instructiunea,\n" +
            "       IFNULL((SELECT GROUP_CONCAT(mi.path SEPARATOR '; ')\n" +
            "                      FROM\n" +
            "                      medicament_instructions mi\n" +
            "                      WHERE\n" +
            "                      mi.medicament_id = m.id\n" +
            "                        AND mi.type = 'M'\n" +
            "                      GROUP\n" +
            "                      BY\n" +
            "                      medicament_id,\n" +
            "                      type), '')                             AS machetaAmbalajului,\n" +
            "       IFNULL(m.terms_of_validity, 0)                        AS termenValabilitate\n" +
            "       FROM\n" +
            "       medicament m\n" +
            "         INNER JOIN nm_pharmaceutical_forms NPF ON m.pharmaceutical_form_id = NPF.id\n" +
            "         LEFT JOIN medicament_manufactures mm ON m.id = mm.medicament_id AND mm.producator_produs_finit = TRUE\n" +
            "         LEFT JOIN nm_manufactures nmm ON mm.manufacture_id = nmm.id\n" +
            "         LEFT JOIN nm_international_medicament_names nmim ON m.international_name_id = NMIM.id\n" +
            "         LEFT JOIN nm_manufactures nnmm ON m.authorization_holder_id = NNMM.id\n" +
            "         LEFT JOIN nm_countries nmct ON NNMM.country_id = NMCT.id\n" +
            "         LEFT JOIN nm_units_of_measurement vum ON m.volume_unit_measurement_id = vum.id\n" +
            "       WHERE\n" +
            "       m.status = 'F'\n" +
            "         AND (m.expiration_date > sysdate() OR m.unlimited_registration_period = 1);";

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    public List<DrugsNomenclator> retreiveAllMedicamentNomenclature()
    {
        EntityManager          em                = null;
        List<DrugsNomenclator> drugsNomenclators = new ArrayList<>();
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query          query     = em.createNativeQuery(queryString).setHint(QueryHints.HINT_FETCH_SIZE, 200).setHint(QueryHints.HINT_READONLY, true);

            List<Object[]> result    = query.getResultList();

            result.forEach(record -> {
                DrugsNomenclator drugsNomenclator = new DrugsNomenclator();
                drugsNomenclator.setId((Integer)record[0]);
                drugsNomenclator.setDenumireComerciala((String) record[1]);
                drugsNomenclator.setCodulMed((String)record[2]);
                drugsNomenclator.setCodVamal(((BigInteger) record[3]).intValue());
                drugsNomenclator.setFormaFarmaceutica((String) record[4]);
                drugsNomenclator.setDoza((String) record[5]);
                drugsNomenclator.setVolum((String) record[6]);
                drugsNomenclator.setDivizare((String) record[7]);
                drugsNomenclator.setAtc((String) record[8]);
                drugsNomenclator.setFirmaProducatoare((String) record[9]);
                drugsNomenclator.setNrDeInregistrare(((BigInteger) record[10]).intValue());
                drugsNomenclator.setDataInregistrarii( record[11] == null ? Timestamp.valueOf(LocalDate.now().atStartOfDay()) : (Timestamp) record[11]);
                drugsNomenclator.setOriginal(Boolean.TRUE.equals(record[12]) ? "Da" : "Nu");
                drugsNomenclator.setStatutDeEliberare((String)record[13]);
                drugsNomenclator.setDci((String) record[14]);
                drugsNomenclator.setDetinatorulCertificatuluiDeIntreg((String) record[15]);
                drugsNomenclator.setTaraDetinatorului((String) record[16]);

                drugsNomenclator.setInstructiunea((String) record[17]);
                drugsNomenclator.setMachetaAmbalajului((String) record[18]);
                drugsNomenclator.setTermenValabilitate(((BigInteger) record[19]).intValue());

                drugsNomenclators.add(drugsNomenclator);
            });

            em.getTransaction().commit();
        }
        catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            LOGGER.info(e.getMessage());
            LOGGER.debug(e.getMessage(), e);
            throw e;
        }
        finally
        {
            em.close();
        }

        return drugsNomenclators;
    }
}
