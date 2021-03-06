package com.bass.amed.controller.rest;

import com.bass.amed.common.AdministrationConstants;
import com.bass.amed.dto.ReceiptFilterDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.GetCountriesMinimalProjection;
import com.bass.amed.projection.GetMinimalCompanyProjection;
import com.bass.amed.projection.LicenseCompanyProjection;
import com.bass.amed.repository.*;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.GenerateReceiptNumberService;
import com.bass.amed.service.LdapUserDetailsSynchronizationService;
import com.bass.amed.utils.AdministrationUtils;
import com.bass.amed.utils.ReceiptsQueryUtils;
import jdk.nashorn.internal.runtime.URIUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.apache.tomcat.util.buf.UriUtil;
import org.hibernate.JDBCException;
import org.hibernate.transform.ResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriUtils;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/administration")
public class AdministrationController {
    @Autowired
    private InvestigatorRepository investigatorRepository;
    @Autowired
    private MedicalInstitutionsRepository medicalInstitutionsRepository;
    @Autowired
    private ServiceChargesRepository serviceChargesRepositorys;
    @Autowired
    private MedicamentFormsRepository medicamentFormsRepository;
    @Autowired
    private NmAtcCodesRepository nmAtcCodesRepository;
    @Autowired
    private SrcUserRepository srcUserRepository;
    @Autowired
    private NmClinicalTrailPhasesRepository nmClinicalTrailPhasesRepository;
    @Autowired
    private MedicamentGroupRepository medicamentGroupRepository;
    @Autowired
    private GenerateDocNumberService generateDocNumberService;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private NmStatesRepository nmStatesRepository;
    @Autowired
    private NmLocalitiesRepository nmLocalitiesRepository;
    @Autowired
    private PharmaceuticalFormsRepository pharmaceuticalFormsRepository;
    @Autowired
    private PharmaceuticalFormTypesRepository pharmaceuticalFormTypesRepository;
    @Autowired
    private ActiveSubstancesRepository activeSubstancesRepository;
    @Autowired
    private AuxiliarySubstancesRepository auxiliarySubstancesRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private SysParamsRepository sysParamsRepository;
    @Autowired
    private UnitsOfMeasurementRepository unitsOfMeasurementRepository;
    @Autowired
    private InternationalMedicamentNameRepository internationalMedicamentNameRepository;
    @Autowired
    private MedicamentTypeRepository medicamentTypeRepository;
    @Autowired
    private NmSterileProductsRepository nmSterileProductsRepository;
    @Autowired
    private NmNesterileProductsRepository nmNesterileProductsRepository;
    @Autowired
    private NmImportActivityRepository nmImportActivityRepository;
    @Autowired
    private NmImportSourcesRepository nmImportSourcesRepository;
    @Autowired
    private NmBiologicalMedicinesRepository nmBiologicalMedicinesRepository;
    @Autowired
    private NmGMPManufacturesRepository nmGMPManufacturesRepository;
    @Autowired
    private NmSterilizationRepository nmSterilizationRepository;
    @Autowired
    private NmPrimaryPackagingRepository nmPrimaryPackagingRepository;
    @Autowired
    private NmSecondaryPackagingRepository nmSecondaryPackagingRepository;
    @Autowired
    private NmTestsForQualityControlRepository nmTestsForQualityControlRepository;
    @Autowired
    private ManufactureRepository manufactureRepository;
    @Autowired
    private GenerateReceiptNumberService generateReceiptNumberService;
    @Autowired
    private NmCountriesRepository nmCountriesRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private NmCustomsCodesRepository nmCustomsCodesRepository;
    @Autowired
    private ReceiptRepository receiptRepository;
    @Autowired
    private PaymentOrderRepository paymentOrderRepository;
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    @Autowired
    private RequestTypeRepository requestTypeRepository;
    @Autowired
    private NmVariationTypeRespository variationTypeRespository;
    @Autowired
    private NmCustomsPointsRepository nmCustomsPointsRepository;
    @Autowired
    private LdapUserDetailsSynchronizationService ldapUserDetailsSynchronizationService;
    @Autowired
    private ScrRoleRepository scrRoleRepository;
    @Autowired
    private ScrAuthorityRepository scrAuthorityRepository;
    @Autowired
    private CtMedInstSubdivRepository ctMedInstSubdivRepository;
    @Autowired
    private NmReportRepository nmReportRepository;
    @Autowired
    private NmReportTypeRepository nmReportTypeRepository;
    @Autowired
    private OutputDocumentsRepository outputDocumentsRepository;

    @RequestMapping(value = "/generate-doc-nr")
    public ResponseEntity<Integer> generateDocNr() {
        return new ResponseEntity<>(generateDocNumberService.getDocumentNumber(), HttpStatus.OK);
    }

    @GetMapping("/all-companies")
    public ResponseEntity<List<NmEconomicAgentsEntity>> retrieveAllEconomicAgents() {
        LOGGER.debug("Retrieve all economic agents");
        List<NmEconomicAgentsEntity> allCompanies = economicAgentsRepository.findAll();

        return new ResponseEntity<>(allCompanies, HttpStatus.OK);
    }

    @RequestMapping("/search-companies-by-name-or-idno")
    public ResponseEntity<List<NmEconomicAgentsEntity>> getCompaniesByNameAndIdno(String partialName) {
        LOGGER.debug("Retrieve companies by name or idno");
        return new ResponseEntity<>(economicAgentsRepository.getCompaniesByNameAndIdno(partialName, partialName), HttpStatus.OK);
    }

    @GetMapping("/all-companies-details")
    public ResponseEntity<List<GetMinimalCompanyProjection>> retrieveAllEconomicAgentsDetails() {
        LOGGER.debug("Retrieve all economic agents");
        List<GetMinimalCompanyProjection> allCompanies = economicAgentsRepository.getMinimalDetails();

        return new ResponseEntity<>(allCompanies, HttpStatus.OK);
    }

    @GetMapping("/all-companies-details-license")
    public ResponseEntity<List<LicenseCompanyProjection>> retrieveAllEconomicAgentsDetailsForLicense(String partialName) {
        LOGGER.debug("Retrieve all economic agents group by IDNO");
        List<LicenseCompanyProjection> allCompanies = economicAgentsRepository.getLicenseDetails(partialName, partialName);

        return new ResponseEntity<>(allCompanies, HttpStatus.OK);
    }

    @RequestMapping("/all-states")
    public ResponseEntity<List<NmStatesEntity>> retrieveAllStates() {
        LOGGER.debug("Retrieve all states");
        return new ResponseEntity<>(nmStatesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-localities-by-state")
    public ResponseEntity<Set<NmLocalitiesEntity>> retrieveLocalitiesByState(@RequestParam(value = "stateId") String stateIso) {
        LOGGER.debug("Retrieve localities by state" + stateIso);
        return new ResponseEntity<>(nmLocalitiesRepository.findByStateId(Integer.valueOf(stateIso)), HttpStatus.OK);
    }

    @RequestMapping("/all-pharamceutical-form-types")
    public ResponseEntity<List<NmPharmaceuticalFormTypesEntity>> retrieveAllPharmaceuticalFormTypes() {
        LOGGER.debug("Retrieve all pharmaceutical form types");
        return new ResponseEntity<>(pharmaceuticalFormTypesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-pharamceutical-forms")
    public ResponseEntity<List<NmPharmaceuticalFormsEntity>> retrieveAllPharmaceuticalFormsByTypeId(@RequestParam(value = "typeId") Integer typeId) {
        LOGGER.debug("Retrieve all pharmaceutical forms by type");
        NmPharmaceuticalFormTypesEntity typesEntity = new NmPharmaceuticalFormTypesEntity();
        typesEntity.setId(typeId);
        return new ResponseEntity<>(pharmaceuticalFormsRepository.findByType(typesEntity), HttpStatus.OK);
    }

    @RequestMapping("/get-all-pharamceutical-forms")
    public ResponseEntity<List<NmPharmaceuticalFormsEntity>> retrieveAllPharmaceuticalForms() {
        LOGGER.debug("Retrieve all pharmaceutical forms");
        return new ResponseEntity<>(pharmaceuticalFormsRepository.findAllByOrderByDescriptionAsc(), HttpStatus.OK);
    }

    @RequestMapping("/all-medicament-groups")
    public ResponseEntity<List<NmMedicamentGroupEntity>> retrieveAllMedicamentGroups() {
        LOGGER.debug("Retrieve all medicament groups");
        return new ResponseEntity<>(medicamentGroupRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-customs-codes")
    public ResponseEntity<List<NmCustomsCodesEntity>> retrieveAllCustomCodes() {
        LOGGER.debug("Retrieve all custom codes");
        return new ResponseEntity<>(nmCustomsCodesRepository.findAll().stream().filter(r -> r.getCode().length() >= 9).collect(Collectors.toList()), HttpStatus.OK);
    }

    @RequestMapping("/all-request-types")
    public ResponseEntity<List<RequestTypesEntity>> retrieveAllRequestTypes() {
        LOGGER.debug("Retrieve request types");
        return new ResponseEntity<>(requestTypeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/search-pharamceutical-forms-by-descr")
    public ResponseEntity<List<NmPharmaceuticalFormsEntity>> getPharmaceuticalFormsByDesc(String partialDescr) {
        LOGGER.debug("Retrieve all pharmaceutical forms by name " + partialDescr);
        return new ResponseEntity<>(pharmaceuticalFormsRepository.findByDescriptionStartingWithIgnoreCase(partialDescr), HttpStatus.OK);
    }


    @RequestMapping("/all-doc-types")
    public ResponseEntity<List<NmDocumentTypesEntity>> retrieveAllDocTypes() {
        LOGGER.debug("Retrieve all doc types");
        return new ResponseEntity<>(documentTypeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-sys-params")
    public ResponseEntity<List<SysParamsEntity>> retrieveAllSysParams() {
        LOGGER.debug("Retrieve all sys params types");
        return new ResponseEntity<>(sysParamsRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-active-substances")
    public ResponseEntity<List<NmActiveSubstancesEntity>> retrieveAllActiveSubstances() {
        LOGGER.debug("Retrieve all active substances");
        return new ResponseEntity<>(activeSubstancesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-auxiliary-substances")
    public ResponseEntity<List<NmAuxiliarySubstancesEntity>> retrieveAllAuxiliarySubstances() {
        LOGGER.debug("Retrieve all auxiliary substances");
        return new ResponseEntity<>(auxiliarySubstancesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-units-of-measurement")
    public ResponseEntity<List<NmUnitsOfMeasurementEntity>> retrieveAllUnitsOfMeasurement() {
        LOGGER.debug("Retrieve all units of measurement");
        return new ResponseEntity<>(unitsOfMeasurementRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-medicament-forms")
    public ResponseEntity<List<NmMedicamentFormsEntity>> retrieveAllMedicamentForms() {
        LOGGER.debug("Retrieve all medicament forms");
        return new ResponseEntity<>(medicamentFormsRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-service-charges")
    public ResponseEntity<List<ServiceChargesEntity>> retrieveAllServiceCharges() {
        LOGGER.debug("Retrieve service charges");
        return new ResponseEntity<>(serviceChargesRepositorys.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/find-service-charge-by-code")
    public ResponseEntity<ServiceChargesEntity> retrieveServiceChargeByCategory(@RequestParam(value = "category") String category) {
        LOGGER.debug("Retrieve service charge by category" + category);
        return new ResponseEntity<>(serviceChargesRepositorys.findByCategory(category).get(), HttpStatus.OK);
    }

    @RequestMapping(value = "/generate-receipt-nr")
    public ResponseEntity<Integer> generateReceiptNr() {
        return new ResponseEntity<>(generateReceiptNumberService.getReceiptNr(), HttpStatus.OK);
    }

    @RequestMapping("/all-international-names")
    public ResponseEntity<List<NmInternationalMedicamentNameEntity>> retrieveAllInternationalNames() {
        LOGGER.debug("Retrieve all international medicament names");
        return new ResponseEntity<>(internationalMedicamentNameRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-international-names-by-name")
    public ResponseEntity<List<NmInternationalMedicamentNameEntity>> retrieveAllInternationalNamesByName(String partialName) {
        partialName= UriUtils.decode(partialName, "UTF-8");
        LOGGER.debug("Retrieve International names by name: " + partialName);
        return new ResponseEntity<>(internationalMedicamentNameRepository.findInternationalMedicamentNameByName(partialName), HttpStatus.OK);
    }

    //    @RequestMapping("/all-atc-codes-by-code")
    //    public ResponseEntity<List<NmAtcCodesEntity>> retrieveAtcCodeByCode(String partialCode) {
    //        LOGGER.debug("Retrieve all ATC codes by code " + partialCode);
    //        return new ResponseEntity<>(nmAtcCodesRepository.findByCodeStartingWithIgnoreCase(partialCode), HttpStatus.OK);
    //    }

    @RequestMapping("/all-employees")
    public ResponseEntity<List<NmEmployeesEntity>> retrieveAllEmployees() {
        LOGGER.debug("Retrieve all employees");
        return new ResponseEntity<>(employeeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/employee-by-id")
    public ResponseEntity<NmEmployeesEntity> retrieveEmployeeById(String id) {
        LOGGER.debug("Retrieve employee by id" + id);
        return new ResponseEntity<>(employeeRepository.findById(Integer.valueOf(id)).get(), HttpStatus.OK);
    }

    @RequestMapping("/all-medicament-types")
    public ResponseEntity<List<NmMedicamentTypeEntity>> retrieveAllMedicamentTypes() {
        LOGGER.debug("Retrieve all medicament types");
        return new ResponseEntity<>(medicamentTypeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-sterile-products")
    public ResponseEntity<List<NmSterileProductsEntity>> retrieveAllSterileProducts() {
        LOGGER.debug("Retrieve all sterile products");
        return new ResponseEntity<>(nmSterileProductsRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-nesterile-products")
    public ResponseEntity<List<NmNesterileProductsEntity>> retrieveAllNesterileProducts() {
        LOGGER.debug("Retrieve all nesterile products");
        return new ResponseEntity<>(nmNesterileProductsRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-import-activities")
    public ResponseEntity<List<NmImportActivitiesEntity>> retrieveAllImportActivities() {
        LOGGER.debug("Retrieve all import activities");
        return new ResponseEntity<>(nmImportActivityRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-import-sources")
    public ResponseEntity<List<NmImportSources>> retrieveAllImportSources() {
        LOGGER.debug("Retrieve all import activities");
        return new ResponseEntity<>(nmImportSourcesRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping("/all-biological-medicines")
    public ResponseEntity<List<NmBiologicalMedicinesEntity>> retrieveAllBiologicalMedicines() {
        LOGGER.debug("Retrieve all biological medicines");
        return new ResponseEntity<>(nmBiologicalMedicinesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-gmp-manufactures")
    public ResponseEntity<List<NmGMPManufactureEntity>> retrieveAllGMPManufactures() {
        LOGGER.debug("Retrieve all GMP manufactures");
        return new ResponseEntity<>(nmGMPManufacturesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-sterilizations")
    public ResponseEntity<List<NmSterilizationsEntity>> retrieveAllSterilizations() {
        LOGGER.debug("Retrieve all sterilizations");
        return new ResponseEntity<>(nmSterilizationRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-primary-packaging")
    public ResponseEntity<List<NmPrimaryPackagingEntity>> retrieveAllPrimaryPackagings() {
        LOGGER.debug("Retrieve all primary packagings");
        return new ResponseEntity<>(nmPrimaryPackagingRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-secondary-packaging")
    public ResponseEntity<List<NmSecondaryPackagingEntity>> retrieveAllSecondaryPackagings() {
        LOGGER.debug("Retrieve all secondary packagings");
        return new ResponseEntity<>(nmSecondaryPackagingRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-tests-for-quality-control")
    public ResponseEntity<List<NmTestsForQualityControlEntity>> retrieveAllTestsForQualityControl() {
        LOGGER.debug("Retrieve all tests for quality control");
        return new ResponseEntity<>(nmTestsForQualityControlRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-manufactures")
    public ResponseEntity<List<NmManufacturesEntity>> retrieveAllManufactures() {
        LOGGER.debug("Retrieve all manufactures");
        return new ResponseEntity<>(manufactureRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/search-manufactures-by-name")
    public ResponseEntity<List<NmManufacturesEntity>> getManufacturesByName(String partialName) {
        LOGGER.debug("Retrieve manufacturers by name:" + partialName);
        return new ResponseEntity<>(manufactureRepository.findByDescriptionStartingWithIgnoreCase(partialName), HttpStatus.OK);
    }

    @RequestMapping("/search-manufactures-by-idno")
    public ResponseEntity<List<NmManufacturesEntity>> getManufacturesByIDNO(String idno) {
        LOGGER.debug("Retrieve manufacturers by IDNO:" + idno);
        return new ResponseEntity<>(manufactureRepository.findByIdno(idno), HttpStatus.OK);
    }


    @GetMapping("/countries")
    public ResponseEntity<List<GetCountriesMinimalProjection>> retrieveCountries() {
        LOGGER.debug("Retrieve all Countries");
        return new ResponseEntity<>(nmCountriesRepository.findAllOnlyIdAndAndDescriptionBy(), HttpStatus.OK);
    }

    @GetMapping("/countries-detailed")
    public ResponseEntity<List<NmCountriesEntity>> retrieveCountriesDetailed() {
        LOGGER.debug("Retrieve all Countries with all details");
        return new ResponseEntity<>(nmCountriesRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/customs-points")
    public ResponseEntity<List<NmCustomsPointsEntity>> getCustomsPoints() {
        LOGGER.debug("Retrieve all Customs Points");
        return new ResponseEntity<>(nmCustomsPointsRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-investigators")
    public ResponseEntity<List<NmInvestigatorsEntity>> retrieveAllInvestigators() {
        LOGGER.debug("Retrieve all investigators");
        return new ResponseEntity<>(investigatorRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-medical-institutions")
    public ResponseEntity<List<NmMedicalInstitutionEntity>> retrieveMedicalInstitutions() {
        LOGGER.debug("Retrieve all investigators");
        List<NmMedicalInstitutionEntity> institutions = medicalInstitutionsRepository.findAll();
        return new ResponseEntity<>(medicalInstitutionsRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-atc-codes-by-code")
    public ResponseEntity<List<NmAtcCodesEntity>> retrieveAtcCodeByCode(String partialCode) {
        LOGGER.debug("Retrieve all ATC codes by code " + partialCode);
        return new ResponseEntity<>(nmAtcCodesRepository.findByCodeStartingWithIgnoreCase(partialCode), HttpStatus.OK);
    }

    @RequestMapping("/all-clinical-trail-phases")
    public ResponseEntity<List<NmClinicTrailPhasesEntity>> getAllClinicalTrailsPhases() {
        LOGGER.debug("Retrieve clinical trails phases");
        return new ResponseEntity<>(nmClinicalTrailPhasesRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/get-all-valid-users")
    public ResponseEntity<List<ScrUserEntity>> retrieveAllValidScrUsers() {
        LOGGER.debug("Retrieve all valid users");
        List<ScrUserEntity> allScrUsers = srcUserRepository.findAllByOldIdIsNull();

        return new ResponseEntity<>(allScrUsers, HttpStatus.OK);
    }

    @GetMapping("/get-all-valid-users-with-roles")
    public ResponseEntity<Set<ScrUserEntity>> getAllValidUsersWithRoles() {
        LOGGER.debug("Retrieve all valid users with roles");
        Set<ScrUserEntity> allScrUsers = srcUserRepository.findAllUsersWithRoles();

        return new ResponseEntity<>(allScrUsers, HttpStatus.OK);
    }

    @RequestMapping("/all-customs-code-by-description")
    public ResponseEntity<List<NmCustomsCodesEntity>> retrieveAllCustomsCodes(String partialCode) {
        LOGGER.debug("Retrieve customs codes by description" + partialCode);
        return new ResponseEntity<>(nmCustomsCodesRepository.findByDescriptionStartingWithIgnoreCase(partialCode), HttpStatus.OK);
    }

    @PostMapping(value = "/receipts-by-payment-order-numbers")
    public ResponseEntity<List<ReceiptsEntity>> getReceiptsByPaymentOrderNumbers(@RequestBody List<String> paymentOrderNumbers) {
        LOGGER.debug("Get receipts by payment order numbers");
        return new ResponseEntity<>(receiptRepository.findByPaymentOrderNumberIn(paymentOrderNumbers), HttpStatus.OK);
    }

    @PostMapping(value = "/receipts-by-filter")
    public ResponseEntity<List<ReceiptsEntity>> getReceiptsByFilter(@RequestBody ReceiptFilterDTO filter) throws CustomException {
        LOGGER.debug("Get receipts by filter");

        EntityManager em = null;
        List<ReceiptsEntity> result = new ArrayList<>();
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            StringBuilder queryString = ReceiptsQueryUtils.createReceiptsByFilterQuery(filter);
            Query query = em.createNativeQuery(queryString.toString(), ReceiptsEntity.class);
            ReceiptsQueryUtils.fillReceiptQueryWithValues(filter, query);
            result = query.getResultList();
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage());
        } finally {
            em.close();
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/add-payment-order", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PaymentOrdersEntity> savePaymentOrder(@RequestBody PaymentOrdersEntity paymentOrdersEntity) throws CustomException {
        LOGGER.debug("Add payment order");
        paymentOrderRepository.save(paymentOrdersEntity);
        return new ResponseEntity<>(paymentOrdersEntity, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-payment-order", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removePaymentOrder(@RequestBody Integer id) throws CustomException {
        LOGGER.debug("Remove payment order");
        paymentOrderRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/add-receipt", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ReceiptsEntity> saveReceipts(@RequestBody ReceiptsEntity receipt) throws CustomException {
        LOGGER.debug("Add receipt");
        receipt.setInsertDate(new java.sql.Timestamp(Calendar.getInstance().getTime().getTime()));
        receiptRepository.save(receipt);
        return new ResponseEntity<>(receipt, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/edit-receipt", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ReceiptsEntity> editReceipts(@RequestBody ReceiptsEntity receipt) throws CustomException {
        LOGGER.debug("Edit receipt");
        receiptRepository.save(receipt);
        return new ResponseEntity<>(receipt, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-receipt", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removeReceipt(@RequestBody Integer id) throws CustomException {
        LOGGER.debug("Remove receipt");
        receiptRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping("/get-payment-orders-by-request-id")
    public ResponseEntity<List<PaymentOrdersEntity>> getPaymentOrdersByRequestId(Integer requestId) {
        LOGGER.debug("Retrieve payment orders by request id " + requestId);
        return new ResponseEntity<>(paymentOrderRepository.findByregistrationRequestId(requestId), HttpStatus.OK);
    }

    @RequestMapping("/search-companies-by-idno")
    public ResponseEntity<List<NmEconomicAgentsEntity>> getCompaniesByIdno(String idno) {
        LOGGER.debug("Retrieve companies by idno");
        return new ResponseEntity<>(economicAgentsRepository.findAllByIdno(idno), HttpStatus.OK);
    }

    @GetMapping("/synchronize-all-users")
    public ResponseEntity<List<ScrUserEntity>> sychronizeLdapUsers() throws CustomException {
        LOGGER.debug("Syncronize local with LDAP users");
        List<ScrUserEntity> reponse = ldapUserDetailsSynchronizationService.synchronizeLdapUsers();
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }

    @GetMapping("/user-rights-and-roles")
    public ResponseEntity<Set<ScrRoleEntity>> getUserRightsAndRoles() {
        LOGGER.debug("Get all roles with rights");
        Set<ScrRoleEntity> scrRoleEntities = scrRoleRepository.findAllRolesWithRights();
        return new ResponseEntity<>(scrRoleEntities, HttpStatus.OK);
    }

    @GetMapping("/get-all-authorities")
    public ResponseEntity<List<ScrAuthorityEntity>> getAllAuthorities() {
        LOGGER.debug("Get all authorities");
        List<ScrAuthorityEntity> scrRoleEntities = scrAuthorityRepository.findAll();
        return new ResponseEntity<>(scrRoleEntities, HttpStatus.OK);
    }

    @PostMapping("/sync-roles-with-authorities")
    public ResponseEntity<String> syncRolesWithAuthorities(@RequestBody List<ScrRoleEntity> scrRoleEntities) {
        LOGGER.debug("Synchronize roles with authorities");
        scrRoleRepository.saveAll(scrRoleEntities);
        return new ResponseEntity<>("Modificarile au fost salvate cu succes", HttpStatus.OK);
    }


    @RequestMapping("/remove-nomenclature-row")
    public ResponseEntity<Boolean> removeNomenclatureRow(@RequestParam(value = "nomenclature", required = true) Integer nr, @RequestParam(value = "id", required = true) Integer id) throws CustomException {

        String tableName = AdministrationConstants.TABLES[nr - 1];
        int isSuccesful = 0;

        if (!Strings.isEmpty(tableName)) {
            String sqlQuerry = String.format(AdministrationConstants.SQL_DELETE_TABLE, tableName);

            EntityManager em = null;
            try {
                em = entityManagerFactory.createEntityManager();
                em.getTransaction().begin();
                isSuccesful = em.createNativeQuery(sqlQuerry).setParameter("id", id).executeUpdate();
                em.getTransaction().commit();
            } catch (Exception e) {
                if (em != null) {
                    em.getTransaction().rollback();
                }

                if (e.getCause() instanceof JDBCException) {
                    JDBCException sqlCauseEx = (JDBCException) e.getCause();
                    throw new CustomException(String.format("Inregistrarea nu poate fi stearsa întrucat este utilizata in alt tabel. (%s)", sqlCauseEx.getSQLException().getMessage()));
                }
                throw new CustomException(e.getMessage());
            } finally {
                em.close();
            }
        }

        return new ResponseEntity<>(new Boolean(isSuccesful > 0), HttpStatus.OK);
    }

    @PostMapping(value = "insert-row")
    public ResponseEntity<Long> insertNomenclatureRow(@RequestBody Map<String, Object> nomenclature) throws CustomException {

        String tableName = AdministrationUtils.getTableName(nomenclature);

        Long insertedRowId = null;

        if (!Strings.isEmpty(tableName)) {

            nomenclature.remove("tableNr");

            EntityManager em = null;
            try {
                em = entityManagerFactory.createEntityManager();
                em.getTransaction().begin();

                String query = AdministrationUtils.createInsertQuery(nomenclature, tableName);
                int numberOfAfected = em.createNativeQuery(query).executeUpdate();
                if (numberOfAfected > 0) {
                    insertedRowId = ((BigInteger) em.createNativeQuery("SELECT LAST_INSERT_ID()").getSingleResult()).longValue();
                }

                em.getTransaction().commit();
            } catch (Exception e) {
                if (em != null) {
                    em.getTransaction().rollback();
                }

                if (e.getCause() instanceof JDBCException) {
                    JDBCException sqlCauseEx = (JDBCException) e.getCause();
                    throw new CustomException(String.format("Inregistrarea nu poate fi inserata. (%s)", sqlCauseEx.getSQLException().getMessage()));
                }
                throw new CustomException(e.getMessage());
            } finally {
                em.close();
            }
        }

        return new ResponseEntity<>(insertedRowId, HttpStatus.OK);
    }


    @PostMapping(value = "update-row")
    public ResponseEntity<Boolean> updateNomenclatureRow(@RequestBody Map<String, Object> nomenclature) throws CustomException {

        String tableName = AdministrationUtils.getTableName(nomenclature);

        int success = 0;

        if (!Strings.isEmpty(tableName)) {

            nomenclature.remove("tableNr");

            String query = "";

            EntityManager em = null;
            try {
                em = entityManagerFactory.createEntityManager();
                em.getTransaction().begin();

                query = AdministrationUtils.createUpdateQuery(nomenclature, tableName);
                success = em.createNativeQuery(query).executeUpdate();

                em.getTransaction().commit();
            } catch (Exception e) {
                if (em != null) {
                    em.getTransaction().rollback();
                }

                if (e.getCause() instanceof JDBCException) {
                    JDBCException sqlCauseEx = (JDBCException) e.getCause();
                    throw new CustomException(String.format("Inregistrarea nu poate fi actualizata. (%s)", sqlCauseEx.getSQLException().getMessage()));
                }
                throw new CustomException(e.getMessage());
            } finally {
                em.close();
            }
        }

        return new ResponseEntity<>(success > 0, HttpStatus.OK);
    }

    @SuppressWarnings("deprecation")
    @RequestMapping("/get-nomenclature")
    public ResponseEntity<List<Object>> getNomenclature(@RequestParam(value = "nomenclature", required = true) Integer nr) throws CustomException {
        String tableName = AdministrationConstants.TABLES[nr - 1];


        if (!Strings.isEmpty(tableName)) {
            String sqlColumnsQuery = String.format(AdministrationConstants.SQL_GET_COLUMNS_NAMES, tableName);

            String sqlQuerry = String.format(AdministrationConstants.SQL_GET_ALL_BY_TABLE, tableName);

            List<Object> responseList;
            EntityManager em = null;
            try {
                em = entityManagerFactory.createEntityManager();
                em.getTransaction().begin();

                Query colNameQuerry = em.createNativeQuery(sqlColumnsQuery).unwrap(org.hibernate.query.Query.class)
                        .setResultTransformer(new ResultTransformer() {
                            private Map<String, String> columns = new HashMap<>();

                            @Override
                            public Object transformTuple(Object[] tuple, String[] aliases) {
                                columns.put(tuple[0].toString(), tuple[1].toString());
                                return null;
                            }

                            @Override
                            public List transformList(List collection) {
                                collection.add(columns);
                                List<Object> colls = new ArrayList<>(1);
                                colls.add(columns);
                                return colls;
                            }
                        });

                responseList = colNameQuerry.getResultList();

                Query query = em.createNativeQuery(sqlQuerry).unwrap(org.hibernate.query.Query.class)
                        .setResultTransformer(new ResultTransformer() {
                            @Override
                            public Object transformTuple(Object[] tuple, String[] aliases) {
                                Map<String, Object> clas = new HashMap<>(tuple.length);
                                for (int i = 0; i < tuple.length; i++) {
                                    clas.put(aliases[i], tuple[i]);
                                }
                                return clas;
                            }

                            @Override
                            public List transformList(List collection) {
                                return collection;
                            }
                        });

                responseList.addAll(query.getResultList());
                em.getTransaction().commit();
            } catch (Exception e) {
                if (em != null) {
                    em.getTransaction().rollback();
                }
                throw new CustomException(e.getMessage());
            } finally {
                em.close();
            }

            return new ResponseEntity<>(responseList, HttpStatus.OK);
        }
        LOGGER.debug("getNomenclature");
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @RequestMapping(value = "/variation-types-to-json")
    public ResponseEntity<String> variationTypesJSON() {
        LOGGER.debug("Retrieve JSON of variation types");
        List<NmVariationTypeEntity> variations = variationTypeRespository.findAll();

        AdministrationUtils utils = new AdministrationUtils();
        Map<Integer, AdministrationUtils.VariationType> variationTypeMap = new HashMap<>();
        variations.stream().forEach(v -> variationTypeMap.put(v.getId(), utils.new VariationType(v.getId(), v.getParentId(), v.getCode(), v.getDescription(),
                v.getPossibleValues())));

        variationTypeMap.values().stream().forEach(v -> {
            AdministrationUtils.VariationType tempV = variationTypeMap.get(v.getParentId());
            if (tempV != null) {
                tempV.getChildrens().add(v);
            }
        });

        Map<Integer, AdministrationUtils.VariationType> initialMap = new HashMap<>();
        initialMap.putAll(variationTypeMap);
        variationTypeMap.entrySet().removeIf(entry -> entry.getValue().getParentId() != null);

        List<AdministrationUtils.VariationType> variationsFinal = new ArrayList<>();
        variationTypeMap.values().stream().forEach(v -> variationsFinal.add(v));

        String json = utils.removeUnnecessaryFields(initialMap, variationsFinal);
        String jsonWithIds = utils.getJSONWithIds(initialMap, variationsFinal);

        return new ResponseEntity<>("{\"val1\" : {" + json + "},\"val2\" : {" + jsonWithIds + "} }", HttpStatus.OK);
    }

    @GetMapping("/get-med-inst-subdivisions-by-id")
    public ResponseEntity<List<NmMedInstSubdivisionsEntity>> getMedInstSubdivisionsById(@RequestParam(value = "id") Integer id) {
        LOGGER.debug("Retrieve medical institution subdivisions by id");
        return new ResponseEntity<>(ctMedInstSubdivRepository.findSubdivisionsByMedicalInstitutionId(id), HttpStatus.OK);
    }

    @RequestMapping("/all-report-types")
    public ResponseEntity<List<NmReportType>> retrieveAllReportTypes() {
        LOGGER.debug("Retrieve all report types");
        return new ResponseEntity<>(nmReportTypeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-reports-by-report-type")
    public ResponseEntity<List<NmReport>> retrieveReportsByTypeId(String id) {
        LOGGER.debug("Retrieve reports by type id" + id);
        return new ResponseEntity<>(nmReportRepository.findNmReportsByReportType_Id(Integer.valueOf(id)), HttpStatus.OK);
    }

    @RequestMapping("/get-path-by-doc-number-and-request-id")
    public ResponseEntity<String> getPathByDocNumberAndRequestId(String number,String typeCode) {
        LOGGER.debug("Retrieve doc path by doc type category " + typeCode + "and number "+ number);
        OutputDocumentsEntity outDoc = outputDocumentsRepository.findByNumberAndDocType_Category(number,typeCode).orElse(new OutputDocumentsEntity());
        return new ResponseEntity<>(outDoc.getPath(), HttpStatus.OK);
    }

}
