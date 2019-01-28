package com.bass.amed.service;

import com.bass.amed.common.Constants;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.repository.annihilation.MedicamentAnnihilationInstitutionRepository;
import com.bass.amed.repository.annihilation.MedicamentAnnihilationMedsRepository;
import com.bass.amed.repository.MedicamentRepository;
import com.bass.amed.repository.RequestRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicamentAnnihilationRequestService
{
    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private MedicamentAnnihilationMedsRepository medicamentAnnihilationMedsRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    @Autowired
    private MedicamentAnnihilationInstitutionRepository medicamentAnnihilationInstitutionRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public RegistrationRequestsEntity findMedAnnihilationRegistrationById(Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> re = requestRepository.findById(id);

        if (!re.isPresent())
        {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }
        else if (re.get().getEndDate() != null)
        {
            throw new CustomException("Cererea a fost deja finisata!!!");
        }
        RegistrationRequestsEntity rrE = re.get();
        rrE.setMedicamentAnnihilation((MedicamentAnnihilationEntity) Hibernate.unproxy(re.get().getMedicamentAnnihilation()));

        rrE.getMedicamentAnnihilation().setCompanyName(economicAgentsRepository.findFirstByIdnoEquals(rrE.getMedicamentAnnihilation().getIdno()).get().getName());

        rrE.getMedicamentAnnihilation().setMedicamentsMedicamentAnnihilationMeds(medicamentAnnihilationMedsRepository.findByMedicamentAnnihilationId(rrE.getMedicamentAnnihilation().getId()));

        rrE.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(ma -> ma.setMedicamentName(medicamentRepository.getCommercialNameById(ma.getMedicamentId()).orElse(null)));

        return rrE;
    }

    @Transactional
    public void saveAnnihilation(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            em.persist(request);

            for (MedicamentAnnihilationMedsEntity mm : request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds())
            {
                mm.setMedicamentAnnihilationId(request.getMedicamentAnnihilation().getId());
                em.persist(mm);
            }

            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        }
        finally
        {
            em.close();
        }
    }


    @Transactional
    public void updateAnnihilation(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            for (MedicamentAnnihilationMedsEntity mm : request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds())
            {
                MedicamentAnnihilationMedsEntity mam = em.find(MedicamentAnnihilationMedsEntity.class, new MedicamentAnnihilationIdentity(mm.getMedicamentId(), mm.getMedicamentAnnihilationId()));
                mam.setDestructionMethod(mm.getDestructionMethod());
                mam.setTax(mm.getTax());

                em.merge(mam);
            }

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));

            //Update documents
            Set<DocumentsEntity> dSet = request.getMedicamentAnnihilation().getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty()){
                r.getMedicamentAnnihilation().getDocuments().addAll(dSet);
            }

           //Institions
            r.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions().clear();
            r.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions().addAll(request.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions());

            r.setCurrentStep(request.getCurrentStep());
            r.setAssignedUser(request.getAssignedUser());

            r.getMedicamentAnnihilation().setFirstname(request.getMedicamentAnnihilation().getFirstname());
            r.getMedicamentAnnihilation().setLastname(request.getMedicamentAnnihilation().getLastname());

            em.merge(r);

            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        }
        finally
        {
            em.close();
        }
    }


    @Transactional
    public void finishAnnihilation(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));

            //Update documents
            Set<DocumentsEntity> dSet = request.getMedicamentAnnihilation().getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty()){
                r.getMedicamentAnnihilation().getDocuments().addAll(dSet);
            }

            r.setCurrentStep(request.getCurrentStep());
            r.setAssignedUser(request.getAssignedUser());

            r.getMedicamentAnnihilation().setStatus("F");

            r.setEndDate(new Timestamp( new Date().getTime()));


            //Institions
            r.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions().clear();
            r.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions().addAll(request.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions());

            r.getMedicamentAnnihilation().setFirstname(request.getMedicamentAnnihilation().getFirstname());
            r.getMedicamentAnnihilation().setLastname(request.getMedicamentAnnihilation().getLastname());

            em.merge(r);

            StringBuilder sb = new StringBuilder();
            sb.append("Salvare cerere pentru nimicire");

            StringBuilder sb1 = new StringBuilder("Agentul economic ").append(request.getMedicamentAnnihilation().getCompanyName()).append(" cu IDNO ").append(request.getMedicamentAnnihilation().getIdno());


            auditLogService.save(new AuditLogEntity().withNewValue(sb.toString()).withCategoryName("MODULE").withSubCategoryName("MODULE_8").withField(sb1.toString()).withAction(Constants.AUDIT_ACTIONS.ADD.name()));

            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        }
        finally
        {
            em.close();
        }
    }
}
