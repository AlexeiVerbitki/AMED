package com.bass.amed.controller.rest;

import com.bass.amed.entity.*;
import com.bass.amed.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nomenclator")
public class NomenclatorController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(NomenclatorController.class);

    @Autowired
    BankRepository bankRepository;

    @Autowired
    BankAccountsRepository bankAccountsRepository;

    @RequestMapping("/all-banks")
    public ResponseEntity<List<NmBanksEntity>> getBanks(){
        List<NmBanksEntity> list = bankRepository.findAll();

        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @RequestMapping("/all-banks-accounts")
    public ResponseEntity<List<NmBankAccountsEntity>> getBanksAccounts(){
        List<NmBankAccountsEntity> list = bankAccountsRepository.findAll();

        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
