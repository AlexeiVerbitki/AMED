package com.bass.amed.service;

import com.bass.amed.entity.LicensesEntity;
import com.bass.amed.repository.DocumentsRepository;
import com.bass.amed.repository.LicensesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LicenseService
{
    @Autowired
    private LicensesRepository licensesRepository;

    @Autowired
    private DocumentsRepository documentsRepository;

    @Transactional(readOnly = true)
    public LicensesEntity findById(Integer id)
    {

        LicensesEntity le = licensesRepository.findById(id).get();

        if (le == null)
        {
            return null;
        }

        le.getDocuments();
        return le;
    }
}
