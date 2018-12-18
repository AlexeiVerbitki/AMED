package com.bass.amed.service;

import com.bass.amed.dto.annihilation.AnnihilationDTO;
import com.bass.amed.entity.MedicamentAnnihilationEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.AnnihilationProjection;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.repository.MedicamentRepository;
import com.bass.amed.repository.annihilation.MedicamentAnnihilationMedsRepository;
import com.bass.amed.repository.annihilation.MedicamentAnnihilationRepository;
import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AnnihilationService
{
    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private MedicamentAnnihilationRepository medicamentAnnihilationRepository;

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private MedicamentAnnihilationMedsRepository medicamentAnnihilationMedsRepository;
    @Autowired
    private MedicamentRepository medicamentRepository;

//
//    select * from medicament_annihilation_meds med right join (
//        select ma.*, nma.long_name from medicament_annihilation ma, nm_economic_agents nma where ma.idno = nma.idno and ma.status = 'F' group by nma.idno
//) items on med.medicament_annihilation_id = items.id
//    left join medicament m on med.medicament_id = m.id
//    left join med_annihilation_destroy_methods adm on med.destruction_method_id = adm.id
//    left join registration_requests r on items.id = r.medicament_annihilation_id


    private final static String ANNIHILATION_QUERY =
            " SELECT " +
//            "SELECT new com.bass.amed.projection.AnnihilationProjection( " +
                    "items.id as annihilationMedsId, " +
                    "items.long_name as ecAgentLongName, " +
                    "med.quantity, " +
                    "med.useless_reason, " +
                    "med.seria, " +
                    "m.commercial_name as medicamentName, " +
                    "adm.description as destructionMethod,  " +
                    "r.end_date " +
                    "FROM medicament_annihilation_meds med RIGHT JOIN ( " +
                    " SELECT ma.id, ma.idno, nma.long_name " +
                    " FROM medicament_annihilation ma, nm_economic_agents nma" +
                    " WHERE ma.idno = nma.idno";

    private static final Logger LOGGER = LoggerFactory.getLogger(LicenseService.class);





    public List<AnnihilationProjection> retrieveAnnihilationByFilter(AnnihilationDTO filter)
    {
        EntityManager em = null;
        List<AnnihilationProjection> annihilationDetails = new ArrayList<>();
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createNativeQuery(createQuery(filter));
            updateQueryWithValues(filter, query, filter.getFromDate(), filter.getToDate());

            List<Object[]> results = query.getResultList();
            results.stream().forEach(record -> {
                AnnihilationProjection proj = new AnnihilationProjection();
                proj.setAnnihilationId((Integer) record[0]);
                proj.setEcAgentLongName((String) record[1]);
                proj.setQuantity((Double) record[2]);
                proj.setUselessReason((String) record[3]);
                proj.setSeria((String) record[4]);
                proj.setMedicamentName((String) record[5]);
                proj.setDestructionMethod((String) record[6]);
                proj.setEndDate((Date) record[7]);

                annihilationDetails.add(proj);
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

        return annihilationDetails;
    }


    private String createQuery(AnnihilationDTO filter)
    {
        StringBuilder stringBuilder = new StringBuilder(ANNIHILATION_QUERY);

        if (Strings.isNotEmpty(filter.getIdno()))
        {
            stringBuilder.append(" AND ma.idno = :idno ");
            stringBuilder.toString();
        }
//
//
//        if (Strings.isNotEmpty(filter.getNrLicenta()))
//        {
//            stringBuilder.append(" AND le.nr = :nr");
//        }
//
//        if (Strings.isNotEmpty(filter.getSeriaLicenta()))
//        {
//            stringBuilder.append(" AND le.serialNr = :serialNr");
//        }
//
//        if (filter.getStep() != null)
//        {
//            stringBuilder.append(" AND RRS.id = :registrationRequestStepId");
//        }
//
//        if (Strings.isNotEmpty(filter.getAssignedPerson()))
//        {
//            stringBuilder.append(" AND RR.assignedUser like  (:assignedUser)");
//        }
//        if (filter.getStartDate() != null)
//        {
//            stringBuilder.append(" AND RR.startDate >= :startDate");
//        }
//
//        if (filter.getEndDate() != null)
//        {
//            stringBuilder.append(" AND RR.endDate <= :endDate");
//        }

//        stringBuilder.append(" GROUP BY nme.licenseId ");

        stringBuilder.append(" and ma.status = 'F' GROUP BY nma.idno ) items" +
                " ON med.medicament_annihilation_id = items.id " +
                " LEFT JOIN medicament m on med.medicament_id = m.id" +
                " LEFT JOIN med_annihilation_destroy_methods adm on med.destruction_method_id = adm.id" +
                " INNER JOIN registration_requests r on items.id = r.medicament_annihilation_id");


        if (filter.getFromDate() != null)
        {
            stringBuilder.append(" AND r.end_date > :fromDate");
        }

        if (filter.getToDate() != null)
        {
            stringBuilder.append(" AND r.end_date < :toDate");
        }

        return stringBuilder.toString();
    }

    private void updateQueryWithValues(AnnihilationDTO filter, Query query, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fromDate, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date toDate)
    {
        if (Strings.isNotEmpty(filter.getIdno()))
        {
            query.setParameter("idno", filter.getIdno());
        }

        if (filter.getFromDate() != null)
        {
            query.setParameter("fromDate", fromDate);
        }

        if (filter.getToDate() != null)
        {
            query.setParameter("toDate", toDate);
        }
//
//        if (Strings.isNotEmpty(filter.getNrLicenta()))
//        {
//            query.setParameter("nr", filter.getNrLicenta());
//        }
//
//        if (Strings.isNotEmpty(filter.getSeriaLicenta()))
//        {
//            query.setParameter("serialNr", filter.getSeriaLicenta());
//        }
//
//        if (filter.getStep() != null)
//        {
//            query.setParameter("registrationRequestStepId", filter.getStep().getId());
//        }
//
//        if (Strings.isNotEmpty(filter.getAssignedPerson()))
//        {
//            query.setParameter("assignedUser", "%" + filter.getAssignedPerson() + "%");
//        }
//        if (filter.getStartDate() != null)
//        {
//            query.setParameter("startDate", filter.getStartDate());
//        }
//
//        if (filter.getEndDate() != null)
//        {
//            query.setParameter("endDate", filter.getEndDate());
//        }
    }


    @Transactional(readOnly = true)
    public MedicamentAnnihilationEntity findAnnihilationById(Integer id) throws CustomException
    {
        Optional<MedicamentAnnihilationEntity> mdOpt = medicamentAnnihilationRepository.findById(id);

        //will not happen
        if (!mdOpt.isPresent())
        {
            throw new CustomException("Nimicirea nu a fost gasita");
        }


//        for (NmEconomicAgentsEntity ece : leOpt.get().getEconomicAgents())
//        {
//            if (leOpt.get().getCompanyName() == null)
//            {
//                leOpt.get().setCompanyName(ece.getLongName());
//            }
//
//            ece.setLocality(localityService.findLocalityById(ece.getLocality().getId()));
//            if (!ece.getAgentPharmaceutist().isEmpty())
//            {
//                ece.setSelectedPharmaceutist(ece.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).get());
//            }
//
//        }



//        Optional<RegistrationRequestsEntity> re = requestRepository.findById(id);
//
//        if (!re.isPresent())
//        {
//            throw new CustomException("Inregistrarea nu a fost gasita");
//        }
//        else if (re.get().getEndDate() != null)
//        {
//            throw new CustomException("Cererea a fost deja finisata!!!");
//        }
//        RegistrationRequestsEntity rrE = re.get();
//        rrE.setMedicamentAnnihilation((MedicamentAnnihilationEntity) Hibernate.unproxy(re.get().getMedicamentAnnihilation()));
//
//        rrE.getMedicamentAnnihilation().setCompanyName(economicAgentsRepository.findFirstByIdnoEquals(rrE.getMedicamentAnnihilation().getIdno()).get().getName());
//
//        rrE.getMedicamentAnnihilation().setMedicamentsMedicamentAnnihilationMeds(medicamentAnnihilationMedsRepository.findByMedicamentAnnihilationId(rrE.getMedicamentAnnihilation().getId()));
//
//        rrE.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(ma -> ma.setMedicamentName(medicamentRepository.getCommercialNameById(ma.getMedicamentId()).orElse(null)));
//
//        return rrE;


        mdOpt.get().setCompanyName(economicAgentsRepository.findFirstByIdnoEquals(mdOpt.get().getIdno()).get().getLongName());

        mdOpt.get().setMedicamentsMedicamentAnnihilationMeds(medicamentAnnihilationMedsRepository.findByMedicamentAnnihilationId(mdOpt.get().getId()));

        mdOpt.get().getMedicamentsMedicamentAnnihilationMeds().forEach(ma -> ma.setMedicamentName(medicamentRepository.getCommercialNameById(ma.getMedicamentId()).orElse(null)));

        return mdOpt.get();
    }

}
