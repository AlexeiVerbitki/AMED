package com.bass.amed.service;

import com.bass.amed.dto.EconomicAgentsNomenclator;
import com.bass.amed.entity.EconomicAgentCodeSequence;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.EconomicAgentCodeSeqRepository;
import com.bass.amed.repository.EconomicAgentsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class EconomicAgentService
{
    private static final String ECONOMIC_AGENTS_NOMENCLATURE_QUERRY =
            "SELECT NEA.ID, L.IDNO, NEA.NAME, NEA.LEGAL_ADDRESS address, L.SERIAL_NR serialNr, L.NR\n" +
            "FROM NM_ECONOMIC_AGENTS NEA\n" +
            "  INNER JOIN LICENSES L ON NEA.LICENSE_ID = L.ID\n" +
            "WHERE L.STATUS = 'F'\n" +
            "  AND L.EXPIRATION_DATE >= SYSDATE()\n" +
            "GROUP BY L.IDNO;";

    @Autowired
    EconomicAgentCodeSeqRepository economicAgentCodeSeqRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    public Integer generateCode()
    {
        EconomicAgentCodeSequence seq = new EconomicAgentCodeSequence();
        economicAgentCodeSeqRepository.save(seq);
        return seq.getId();
    }

    public List<EconomicAgentsNomenclator> getEconomicAgentsNomenclature() {
        EntityManager em = null;
        List<EconomicAgentsNomenclator> economicAgents;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNativeQuery(ECONOMIC_AGENTS_NOMENCLATURE_QUERRY, EconomicAgentsNomenclator.class);

            economicAgents = query.getResultList();
            em.getTransaction().commit();
        }
        catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            LOGGER.info(e.getMessage());
            throw e;
        }

        finally
        {
            em.close();
        }

        return economicAgents;
    }


    public void saveNewAgents(List<NmEconomicAgentsEntity> nmEconomicAgentsEntities) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            NmEconomicAgentsEntity main = nmEconomicAgentsEntities.stream().filter(f -> f.getFiliala().equals(0)).findFirst().orElse(null);

            em.persist(main);

            List<NmEconomicAgentsEntity> filiale = nmEconomicAgentsEntities.stream().filter(f -> f.getFiliala().equals(1)).collect(Collectors.toList());

            for (NmEconomicAgentsEntity fil : filiale)
            {
                fil.setParentId(main.getId());
                em.persist(fil);
            }

            em.getTransaction().commit();

        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally
        {
            em.close();
        }
    }



    public void editAgents(List<NmEconomicAgentsEntity> nmEconomicAgentsEntities) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            NmEconomicAgentsEntity main = nmEconomicAgentsEntities.stream().filter(f -> f.getFiliala().equals(0)).findFirst().orElse(null);
            NmEconomicAgentsEntity ecMain = em.find(NmEconomicAgentsEntity.class, main.getId());

            editAgent(main, ecMain);


            em.merge(ecMain);

            //From view
            List<NmEconomicAgentsEntity> filialeView = nmEconomicAgentsEntities.stream().filter(f -> f.getFiliala().equals(1)).collect(Collectors.toList());

            //Existing
            List<NmEconomicAgentsEntity> ecExistingList =  economicAgentsRepository.loadFilialsForIdno(main.getIdno());

            Set<Integer> ecViewIds = filialeView.stream().map(x -> x.getId()).collect(Collectors.toSet());
            Set<Integer> ecExistingIds = ecExistingList.stream().map(x -> x.getId()).collect(Collectors.toSet());

            ecExistingIds.removeAll(ecViewIds);

            //Remove
            for (Integer rmv : ecExistingIds)
            {
                NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, rmv);
                em.remove(ec);
            }

            //Edit
            List<NmEconomicAgentsEntity> editFilials = filialeView.stream().filter(f -> f.getId() != null).collect(Collectors.toList());

            for (NmEconomicAgentsEntity editFil : editFilials)
            {
                NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, editFil.getId());
                editAgent(editFil, ec);
                em.merge(ec);
            }

            List<NmEconomicAgentsEntity> newFilials = filialeView.stream().filter(f -> f.getId() == null).collect(Collectors.toList());
            //Add
            for (NmEconomicAgentsEntity newFil : newFilials)
            {
                newFil.setParentId(main.getId());
                em.persist(newFil);
            }



            em.getTransaction().commit();

        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally
        {
            em.close();
        }
    }

    private void editAgent(NmEconomicAgentsEntity view, NmEconomicAgentsEntity entity)
    {
        entity.setRegistrationDate(view.getRegistrationDate());
        entity.setLegalAddress(view.getLegalAddress());
        entity.setName(view.getName());
        entity.setLongName(view.getLongName());
        entity.setDirector(view.getDirector());
        entity.setType(view.getType());
        entity.setLocality(view.getLocality());
        entity.setStreet(view.getStreet());
    }
}
