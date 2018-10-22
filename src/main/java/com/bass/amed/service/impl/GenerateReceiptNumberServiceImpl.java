package com.bass.amed.service.impl;

import com.bass.amed.entity.ReceiptNumberSequence;
import com.bass.amed.repository.GenerateReceiptNumberRepository;
import com.bass.amed.service.GenerateReceiptNumberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GenerateReceiptNumberServiceImpl implements GenerateReceiptNumberService {
    private final GenerateReceiptNumberRepository receiptNumberRepository;

    @Autowired
    public GenerateReceiptNumberServiceImpl(GenerateReceiptNumberRepository receiptNumberRepository) {
        this.receiptNumberRepository = receiptNumberRepository;
    }


    public Integer getReceiptNr(){
        ReceiptNumberSequence receiptNr = new ReceiptNumberSequence();
        receiptNumberRepository.save(receiptNr);
        return receiptNr.getId();
    }
}
