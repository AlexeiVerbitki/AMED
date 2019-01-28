package com.bass.amed.controller.rest;

import com.bass.amed.dto.AuditDTO;
import com.bass.amed.dto.annihilation.AnnihilationDTO;
import com.bass.amed.entity.NmAuditCategoryEntity;
import com.bass.amed.entity.NmAuditSubcategoryEntity;
import com.bass.amed.projection.AuditProjection;
import com.bass.amed.repository.AuditCategoryRepository;
import com.bass.amed.repository.AuditSubcategoryRepository;
import com.bass.amed.service.AuditLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(AuditController.class);

    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private AuditCategoryRepository auditCategoryRepository;
    @Autowired
    private AuditSubcategoryRepository auditSubcategoryRepository;

    @RequestMapping(value = "/get-filtered-audit", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AuditProjection>> getAuditByFilter(@RequestBody AuditDTO filter)
    {
        LOGGER.debug("Get audit by filter: ", filter.toString());
        List<AuditProjection> auditProjection = auditLogService.retrieveAnnihilationByFilter(filter);
        return new ResponseEntity<>(auditProjection, HttpStatus.OK);
    }


    @RequestMapping(value = "/get-all-categories", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmAuditCategoryEntity>> getAllCategories()
    {
        LOGGER.debug("Get all categories");
        return new ResponseEntity<>(auditCategoryRepository.findAll(), HttpStatus.OK);
    }

//    @RequestMapping(value = "/get-subcategories_by-category_id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<List<NmAuditSubcategoryEntity>> getSubcategoriesByCategoryId(@RequestParam("category_id") String categoryId)
//    {
//        LOGGER.debug("Get all subcategories by category id:" + );
//        return new ResponseEntity<>(auditCategoryRepository.findAll(), HttpStatus.OK);
//    }
}
