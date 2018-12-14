package com.bass.amed.controller.rest.document;

import com.bass.amed.entity.DocumentModuleDetailsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.DocumentModuleDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;

@RestController
@RequestMapping("/api/doc-module")
public class DocumentModuleController
{
    @Autowired
    DocumentModuleDetailsRepository documentModuleDetailsRepository;

    @PostMapping(value = "/save-document-request")
    public ResponseEntity<DocumentModuleDetailsEntity> saveDocumentRequest(@RequestBody DocumentModuleDetailsEntity documentModuleDetailsEntity) throws CustomException
    {
        documentModuleDetailsEntity.getRegistrationRequestsEntity().setMedicaments(new HashSet<>());
        documentModuleDetailsRepository.save(documentModuleDetailsEntity);
        return new ResponseEntity<>(documentModuleDetailsEntity, HttpStatus.CREATED);
    }
}
