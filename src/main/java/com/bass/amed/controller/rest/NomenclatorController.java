package com.bass.amed.controller.rest;

import com.bass.amed.dto.ReceiptFilterDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.GetCountriesMinimalProjection;
import com.bass.amed.projection.GetMinimalCompanyProjection;
import com.bass.amed.projection.LicenseCompanyProjection;
import com.bass.amed.repository.*;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.GenerateReceiptNumberService;
import com.bass.amed.utils.ReceiptsQueryUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

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
