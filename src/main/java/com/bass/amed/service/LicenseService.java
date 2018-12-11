package com.bass.amed.service;

import com.bass.amed.dto.license.LicenseDTO;
import com.bass.amed.entity.LicenseAgentPharmaceutistEntity;
import com.bass.amed.entity.LicensesEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.LicenseProjection;
import com.bass.amed.repository.license.LicensesRepository;
import org.apache.logging.log4j.util.Strings;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class LicenseService
{
    private final static String LICENSE_QUERY = "SELECT new com.bass.amed.projection.LicenseProjection( " +
            "le.id as licenseId, " +
            "le.nr, " +
            "le.serialNr, " +
            "le.releaseDate, " +
            "le.expirationDate, " +
            "le.status, " +
            "le.idno ) " +
            "FROM LicensesEntity le, " +
            "  NmEconomicAgentsEntity nme " +
            " WHERE le.idno = nme.idno" +
            "  AND le.id = nme.licenseId" +
            "  AND le.expirationDate > curdate() "+
            "  AND le.status in ('F', 'R', 'S')";


    private static final Logger LOGGER = LoggerFactory.getLogger(LicenseService.class);

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private LicensesRepository licensesRepository;

    @Autowired
    private LocalityService localityService;


    public List<LicenseProjection> retrieveLicenseByFilter(LicenseDTO filter)
    {
        EntityManager em = null;
        List<LicenseProjection> licenseDetails;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            Query query = em.createQuery(createQuery(filter), LicenseProjection.class);
            updateQueryWithValues(filter, query);

            licenseDetails = query.getResultList();
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

        return licenseDetails;
    }


    private String createQuery(LicenseDTO filter)
    {
        StringBuilder stringBuilder = new StringBuilder(LICENSE_QUERY);

        if (Strings.isNotEmpty(filter.getIdno()))
        {
            stringBuilder.append(" AND le.idno = :idno ");
            stringBuilder.toString();
        }


        if (Strings.isNotEmpty(filter.getNrLicenta()))
        {
            stringBuilder.append(" AND le.nr = :nr");
        }

        if (Strings.isNotEmpty(filter.getSeriaLicenta()))
        {
            stringBuilder.append(" AND le.serialNr = :serialNr");
        }
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

        stringBuilder.append(" GROUP BY nme.licenseId ");

        return stringBuilder.toString();
    }

    private void updateQueryWithValues(LicenseDTO filter, Query query)
    {
        if (Strings.isNotEmpty(filter.getIdno()))
        {
            query.setParameter("idno", filter.getIdno());
        }

        if (Strings.isNotEmpty(filter.getNrLicenta()))
        {
            query.setParameter("nr", filter.getNrLicenta());
        }

        if (Strings.isNotEmpty(filter.getSeriaLicenta()))
        {
            query.setParameter("serialNr", filter.getSeriaLicenta());
        }
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
    public LicensesEntity findLicenseById(Integer id) throws CustomException
    {
        Optional<LicensesEntity> leOpt = licensesRepository.findById(id);

        //will not happen
        if (!leOpt.isPresent())
        {
            throw new CustomException("Licenta nu a fost gasita");
        }


//        RegistrationRequestsEntity rrE = re.get();
//        rrE.setLicense((LicensesEntity) Hibernate.unproxy(re.get().getLicense()));
////        rrE.getLicense().getAddresses().forEach(
////                addr -> addr.setState(statesRepository.findById(addr.getLocality().getStateId()).get())
////        );
//
//        rrE.getLicense().setDetail(rrE.getLicense().getDetails().stream().filter(det -> det.getRegistrationId().equals(rrE.getId())).findFirst().orElse(null));

        for (NmEconomicAgentsEntity ece : leOpt.get().getEconomicAgents())
        {
            if (leOpt.get().getCompanyName() == null)
            {
                leOpt.get().setCompanyName(ece.getLongName());
            }

            ece.setLocality(localityService.findLocalityById(ece.getLocality().getId()));
            if (!ece.getAgentPharmaceutist().isEmpty())
            {
                ece.setSelectedPharmaceutist(ece.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).get());
            }

        }

//        for (NmEconomicAgentsEntity ne : rrE.getLicense().getEconomicAgents())
//        {
//            ne.setCurrentResolution(ne.getResolutions().stream().filter(e -> e.getLicenseDetailId().equals(rrE.getLicense().getDetail().getId())).findFirst().orElse(null));
//        }



//        if (rrE.getLicense().getAgentPharmaceutist() != null && !rrE.getLicense().getAgentPharmaceutist().isEmpty())
//        {
//            rrE.getLicense().setSelectedPharmaceutist(rrE.getLicense().getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).get());
//        }
//
//
//        if (rrE.getLicense().getResolutions() != null && !rrE.getLicense().getResolutions().isEmpty())
//        {
//            Optional<LicenseResolutionEntity> first = rrE.getLicense().getResolutions().stream().filter(r -> r.getRegistrationId().equals(rrE.getId())).findFirst();
//            if (first.isPresent())
//            {
//                rrE.getLicense().setResolution(first.get());
//            }
//        }

        return leOpt.get();
    }
}
