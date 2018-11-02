package com.bass.amed.service;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.RequestRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MedicamentAnnihilationRequestService
{
    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

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
}
