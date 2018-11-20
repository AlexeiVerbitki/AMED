package com.bass.amed.service;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.NmLocalitiesRepository;
import com.bass.amed.repository.NmStatesRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.Optional;

@Service
@Transactional
public class LocalityService
{

    @Autowired
    private NmLocalitiesRepository localitiesRepository;

    @Autowired
    private NmStatesRepository statesRepository;

    public NmLocalitiesEntity findLocalityById(Integer id) throws CustomException
    {
        Optional<NmLocalitiesEntity> local = localitiesRepository.findById(id);

        if (!local.isPresent())
        {
            throw new CustomException("Localitatea nu a fost gasita");
        }

        local.get().setStateName(statesRepository.findById(local.get().getStateId()).get().getDescription());

        return local.get();
    }

}
