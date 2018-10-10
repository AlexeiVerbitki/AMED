package com.bass.amed.service.impl;

import com.bass.amed.entity.DocumentNumberSequence;
import com.bass.amed.repository.GenerateDocNumberRepository;
import com.bass.amed.service.GenerateDocNumberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GenerateDocNumberServiceImpl implements GenerateDocNumberService
{
    private final GenerateDocNumberRepository docNumberRepository;

    @Autowired
    public GenerateDocNumberServiceImpl(GenerateDocNumberRepository docNumberRepository)
    {
        this.docNumberRepository = docNumberRepository;
    }

    public Integer getDocumentNumber()
    {
        DocumentNumberSequence docNr = new DocumentNumberSequence();
        docNr.setCode("A");
        docNumberRepository.save(docNr);
        return docNr.getId();
    }

}
