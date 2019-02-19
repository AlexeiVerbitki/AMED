package com.bass.amed.service;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.ScheduledModuleResponse;
import com.bass.amed.dto.license.DiffLicense;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.repository.RegistrationRequestPayloadRepository;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.utils.AuditUtils;
import com.bass.amed.utils.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class LicenseRegistrationRequestService
{
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private LocalityService localityService;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private RegistrationRequestPayloadRepository registrationRequestPayloadRepository;
    @Autowired
    private AuditLogService auditLogService;

    @Value("${scheduler.rest.api.host}")
    private String schedulerRestApiHost;


    private static final Logger LOGGER = LoggerFactory.getLogger(LicenseRegistrationRequestService.class);

    @Transactional(readOnly = true)
    public RegistrationRequestsEntity findLicenseRegistrationById(Integer id, boolean viewCompleted) throws CustomException
    {
        Optional<RegistrationRequestsEntity> re = requestRepository.findById(id);

        if (!re.isPresent())
        {
            throw new CustomException("Inregistrarea nu a fost gasita");
        } else if (re.get().getEndDate() != null && !viewCompleted)
        {
            throw new CustomException("Cererea a fost deja finisata!!!");
        }
        RegistrationRequestsEntity rrE = re.get();
        rrE.setLicense((LicensesEntity) Hibernate.unproxy(re.get().getLicense()));

        rrE.getLicense().setDetail(rrE.getLicense().getDetails().stream().filter(det -> det.getRegistrationId().equals(rrE.getId())).findFirst().orElse(null));

        if (!viewCompleted)
        {
            rrE.getLicense().setCompanyName(economicAgentsRepository.findFirstByIdnoEquals(rrE.getLicense().getIdno()).get().getLongName());

            for (NmEconomicAgentsEntity ece : rrE.getLicense().getEconomicAgents())
            {
                if (ece.getLocality() != null)
                {
                    ece.setLocality(localityService.findLocalityById(ece.getLocality().getId()));
                }
                ece.setSelectedPharmaceutist(ece.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).orElse(null));
            }
        }


        for (NmEconomicAgentsEntity ne : rrE.getLicense().getEconomicAgents())
        {
            ne.setCurrentResolution(ne.getResolutions().stream().filter(e -> e.getLicenseDetailId().equals(rrE.getLicense().getDetail().getId())).findFirst().orElse(null));
        }

        //Call to load data from proxy
        rrE.getDocuments().toString();

        if (viewCompleted)
        {
            Optional<RegistrationRequestPayloadEntity> reqNewOpt = registrationRequestPayloadRepository.findByRegistrationRequestId(id);

            if (!reqNewOpt.isPresent())
            {
                Optional<Integer> resultOpt = requestRepository.getPreviousLicenseModificationId(rrE.getLicense().getId(), id);

                reqNewOpt = registrationRequestPayloadRepository.findByRegistrationRequestId(resultOpt.get());
            }

            ObjectMapper mapper = new ObjectMapper();
            try
            {
                LicensesEntity version = mapper.readValue(reqNewOpt.get().getPayload(), LicensesEntity.class);

                rrE.getLicense().setSerialNr(version.getSerialNr());
                rrE.getLicense().setNr(version.getNr());
                rrE.getLicense().setExpirationDate(version.getExpirationDate());
                rrE.getLicense().setStatus(version.getStatus());
                rrE.getLicense().setReason(version.getReason());

                for (NmEconomicAgentsEntity ece : version.getEconomicAgents())
                {
                    if (rrE.getLicense().getCompanyName() == null)
                    {
                        rrE.getLicense().setCompanyName(ece.getLongName());
                    }

                    if (ece.getLocality() != null)
                    {
                        ece.setLocality(localityService.findLocalityById(ece.getLocality().getId()));
                    }
                    ece.setSelectedPharmaceutist(ece.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).get());
                }


                rrE.getLicense().setEconomicAgents(version.getEconomicAgents());
            } catch (Exception e)
            {
                throw new CustomException(e.getMessage(), e);
            }
        }

        return rrE;
    }


    public void saveNewLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            request.getLicense().setCurrentStatus("A");

            em.persist(request);


//            LicensesEntity l = em.find(LicensesEntity.class, request.getLicense().getId());

            LicenseDetailsEntity detail = request.getLicense().getDetail();
            detail.setRegistrationId(request.getId());
            request.getLicense().getDetails().add(detail);


            em.merge(request);


            List<NmEconomicAgentsEntity> agentsByIdno = economicAgentsRepository.findAllByIdno(request.getLicense().getIdno());

            for (NmEconomicAgentsEntity ag : agentsByIdno)
            {
                if (ag.getLicenseId() != null)
                {
                    NmEconomicAgentsEntity r = em.find(NmEconomicAgentsEntity.class, ag.getId());

                    r.setLicenseId(null);

                    em.merge(r);
                }
            }

            //Schedule job for new license
            LOGGER.debug("Start jobSchedule method...");
            ResponseEntity<ScheduledModuleResponse> result = null;
            result = Utils.jobSchedule(20, "/set-critical-request", "/set-expired-request", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost, "Se depaseste termenul de informare a clientului despre decizie");
            if (result != null && !result.getBody().isSuccess())
            {
                LOGGER.debug("The method jobSchedule, was not successful.");
                throw new CustomException("Nu a putut fi setat termenul de informare a clientului despre decizie.");
            }
            else
            {
                LOGGER.debug("Finished jobSchedule method.");
            }

            em.getTransaction().commit();

        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally
        {
            em.close();
        }
    }

    public void updateRegistrationLicense(RegistrationRequestsEntity request, boolean next) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            //License Details
            LicenseDetailsEntity lde           = em.find(LicenseDetailsEntity.class, request.getLicense().getDetail().getId());
            boolean              updateDetails = false;

            //Commision responses
            for (LicenseCommisionResponseEntity le : request.getLicense().getDetail().getCommisionResponses())
            {
                if (le.getId() != null)
                {
                    LicenseCommisionResponseEntity lTmp = em.find(LicenseCommisionResponseEntity.class, le.getId());
                    lTmp.setDate(le.getDate());
                    lTmp.setAnnouncedMethods(le.getAnnouncedMethods());
                    lTmp.setEntryRspNumber(le.getEntryRspNumber());
                    lTmp.setOrganization(le.getOrganization());
                    lTmp.setExtraData(le.getExtraData());

                    em.merge(lTmp);
                }
            }

            Set<LicenseCommisionResponseEntity> newC = request.getLicense().getDetail().getCommisionResponses().stream().filter(co -> co.getId() == null).collect(Collectors.toSet());
            if (!newC.isEmpty())
            {
                lde.setCommisionResponses(newC);
            }

            //Merge data
            if (updateDetails)
            {
                em.merge(lde);
            }


            //Economic agents
            //From view
            Set<NmEconomicAgentsEntity> ecViewList = request.getLicense().getEconomicAgents();
            //Existing
            Set<NmEconomicAgentsEntity> ecExistingList = r.getLicense().getEconomicAgents();

            Set<Integer> ecViewIds     = ecViewList.stream().map(x -> x.getId()).collect(Collectors.toSet());
            Set<Integer> ecExistingIds = ecExistingList.stream().map(x -> x.getId()).collect(Collectors.toSet());

            ecExistingIds.removeAll(ecViewIds);

            for (Integer rmv : ecExistingIds)
            {
                NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, rmv);

                ec.setLicenseId(null);

                em.merge(ec);
            }

            for (NmEconomicAgentsEntity ecView : ecViewList)
            {
                NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, ecView.getId());

//                ec = ecView;

                //Farmacisti
                ec.getAgentPharmaceutist().clear();
                ec.getAgentPharmaceutist().addAll(ecView.getAgentPharmaceutist());


                //Activitati
                ec.getActivities().clear();
                ec.getActivities().addAll(ecView.getActivities());

                //Resolution
                if (ecView.getCurrentResolution() != null)
                {
                    ecView.getCurrentResolution().setLicenseDetailId(request.getLicense().getDetail().getId());
                    ec.getResolutions().clear();
                    ec.getResolutions().add(ecView.getCurrentResolution());
                }


                ec.setLicenseId(request.getLicense().getId());

                ec.setType(ecView.getType());

                //Cesionare
                if (request.getType().getCode().equals("LICC") && !ecView.getIdno().equals(request.getLicense().getIdno()))
                {
                    NmEconomicAgentsEntity originalEc = ecViewList.stream().filter(ss -> !ss.getIdno().equals(ecView.getIdno())).findFirst().get();

                    ec.setOldIdno(ecView.getIdno());
                    ec.setIdno(request.getLicense().getIdno());


                    ec.setName(originalEc.getName());
                    ec.setLongName(originalEc.getLongName());
                    ec.setLegalAddress(originalEc.getLegalAddress());
                }

                em.merge(ec);
            }

            //Update documents
            Set<DocumentsEntity> dSet = request.getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty())
            {
                r.getDocuments().addAll(dSet);
            }

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));

            r.setCurrentStep(request.getCurrentStep());
            r.setAssignedUser(request.getAssignedUser());

            em.merge(r);


            //Job Unshcedule for new license
            if (request.getType().getCode().equals("LICEL") && next )
            {
                LOGGER.debug("Start jobUnschedule method...");
                Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
                LOGGER.debug("Finished jobUnschedule method.");
            }

            //Job Unshcedule for duplicate license
            if (request.getType().getCode().equals("LICD") && next )
            {
                LOGGER.debug("Start jobUnschedule method...");
                Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
                LOGGER.debug("Finished jobUnschedule method.");
            }


            em.getTransaction().commit();

        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally
        {
            em.close();
        }
    }


    public void finishLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            r.getLicense().setSerialNr(request.getLicense().getSerialNr());
            r.getLicense().setNr(request.getLicense().getNr());

            r.getLicense().setCurrentStatus(null);

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));

            r.setEndDate(request.getEndDate());

            if (request.getType().getCode().equals("LICEL") && request.getLicense().getStatus().equals("F"))
            {
                Date releaseDate = new Date();
                r.getLicense().setReleaseDate(releaseDate);

                Calendar c = Calendar.getInstance();
                c.setTime(releaseDate);
                c.add(Calendar.YEAR, 5);

                r.getLicense().setExpirationDate(c.getTime());
            }

            //Prelungire
            if (request.getType().getCode().equals("LICP"))
            {
                Date curExpirationDate = request.getLicense().getExpirationDate();

                Calendar c = Calendar.getInstance();
                c.setTime(curExpirationDate);
                c.add(Calendar.YEAR, 5);

                r.getLicense().setExpirationDate(c.getTime());
            }

            //Anulare
            if (request.getType().getCode().equals("LICA"))
            {
                request.getLicense().setStatus("R");
                r.getLicense().setClosedDate(new Date());


                for (NmEconomicAgentsEntity ecView : r.getLicense().getEconomicAgents())
                {
                    NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, ecView.getId());

                    ec.setLicenseId(null);

                    em.merge(ec);
                }

            }


            //Suspendare
            if (request.getType().getCode().equals("LICS"))
            {
                request.getLicense().setStatus("S");
                r.getLicense().setSuspendDate(new Date());
            }

            //Reluare
            if (request.getType().getCode().equals("LICRL"))
            {
                request.getLicense().setStatus("F");
            }


            r.getLicense().setStatus(request.getLicense().getStatus());
            r.setCurrentStep(request.getCurrentStep());
            r.setAssignedUser(request.getAssignedUser());

            r.getLicense().setStatus(request.getLicense().getStatus());
            em.merge(r);

            //Update mandated contacts
            LicenseMandatedContactEntity lmView = request.getLicense().getDetail().getLicenseMandatedContacts().stream().findFirst().get();
            if (lmView.getNewMandatedLastname() != null && !lmView.getNewMandatedLastname().isEmpty())
            {
                LicenseMandatedContactEntity lmc = em.find(LicenseMandatedContactEntity.class, lmView.getId());

                lmc.setNewMandatedFirstname(lmView.getNewMandatedFirstname());
                lmc.setNewMandatedLastname(lmView.getNewMandatedLastname());
                lmc.setNewMandatedNr(lmView.getNewMandatedNr());
                lmc.setNewMandatedDate(lmView.getNewMandatedDate());
                lmc.setNewEmail(lmView.getNewEmail());
                lmc.setNewPhoneNumber(lmView.getNewPhoneNumber());
                lmc.setNewIdnp(lmView.getNewIdnp());

                em.merge(lmc);
            }

            //Save payload
            if (request.getType().getCode().equals("LICEL") || request.getType().getCode().equals("LICM") || request.getType().getCode().equals("LICC") || request.getType().getCode().equals("LICP"))
            {
                Optional<RegistrationRequestPayloadEntity> plOpt  = registrationRequestPayloadRepository.findByRegistrationRequestId(r.getId());
                ObjectMapper                               mapper = new ObjectMapper();
                if (plOpt.isPresent())
                {
                    RegistrationRequestPayloadEntity opt = em.find(RegistrationRequestPayloadEntity.class, plOpt.get().getId());
                    opt.setPayload(mapper.writeValueAsString(Hibernate.unproxy(r.getLicense())));
                } else
                {
                    RegistrationRequestPayloadEntity payload = new RegistrationRequestPayloadEntity();
                    payload.setRegistrationRequestId(r.getId());


                    //Object to JSON in file
                    payload.setPayload(mapper.writeValueAsString(Hibernate.unproxy(r.getLicense())));

                    em.persist(payload);
                }
            }

            AuditUtils.auditLicense(auditLogService, request);

            em.getTransaction().commit();

        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally
        {
            em.close();
        }
    }


    public void stopLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));
            r.setEndDate(new Timestamp(new Date().getTime()));
            if (r.getType().getCode().equals("LICEL"))
            {
                r.getLicense().setStatus("C");
            }

            r.getLicense().setCurrentStatus(null);
            r.setCurrentStep("C");

            em.merge(r);

            em.getTransaction().commit();

        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally
        {
            em.close();
        }
    }


    public void updateModifyLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            LicensesEntity originalLicense = request.getLicense();
            LicensesEntity le              = em.find(LicensesEntity.class, originalLicense.getId());
            le.setCurrentStatus("A");
            le.setReason(originalLicense.getReason());
            request.setLicense(le);


            //New request
            em.persist(request);


            LicenseDetailsEntity detail = originalLicense.getDetail();
            detail.setRegistrationId(request.getId());
            request.getLicense().getDetails().add(detail);

            em.merge(request);


            if (request.getType().getCode().equals("LICM") || request.getType().getCode().equals("LICC"))
            {
                List<RegistrationRequestsEntity> reqList              = requestRepository.getRequestsForLicense(originalLicense.getId());
                boolean                          alreadyRegisteredObj = false;
                for (RegistrationRequestsEntity rOld : reqList)
                {
                    Optional<RegistrationRequestPayloadEntity> payloadOptional = registrationRequestPayloadRepository.findByRegistrationRequestId(rOld.getId());
                    if (payloadOptional.isPresent())
                    {
                        alreadyRegisteredObj = true;
                        break;
                    }
                }

                if (!alreadyRegisteredObj)
                {
                    RegistrationRequestPayloadEntity payload = new RegistrationRequestPayloadEntity();
                    payload.setRegistrationRequestId(request.getId());
                    ObjectMapper mapper = new ObjectMapper();

                    //Object to JSON in file
                    payload.setPayloadMigration(mapper.writeValueAsString(request.getLicense()));

                    em.persist(payload);
                }

            }

            if (request.getType().getCode().equals("LICD"))
            {
                //Schedule job for duplicate
                LOGGER.debug("Start jobSchedule method...");
                ResponseEntity<ScheduledModuleResponse> result = null;
                result = Utils.jobSchedule(3, "/set-critical-request", "/set-expired-request", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost, "Se depaseste termenul de eliberare a duplicatului licentei");
                if (result != null && !result.getBody().isSuccess())
                {
                    LOGGER.debug("The method jobSchedule, was not successful.");
                    throw new CustomException("Nu a putut fi setat termenul de eliberare a duplicatului.");
                } else
                {
                    LOGGER.debug("Finished jobSchedule method.");
                }
            }


            em.getTransaction().commit();

        } catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally
        {
            em.close();
        }
    }


    public List<DiffLicense> compareRevisions(Integer licenseId, Integer newRequestId) throws CustomException
    {
        Optional<Integer> resultOpt = requestRepository.getPreviousLicenseModificationId(licenseId, newRequestId);

        RegistrationRequestPayloadEntity reqNew = registrationRequestPayloadRepository.findByRegistrationRequestId(newRequestId).get();

        ObjectMapper mapper = new ObjectMapper();

        LicensesEntity oldVersion;

        try
        {
            if (!resultOpt.isPresent())
            {
                if (reqNew.getPayloadMigration() == null)
                {
                    throw new CustomException("Can not find previous version.");
                } else
                {
                    oldVersion = mapper.readValue(reqNew.getPayloadMigration(), LicensesEntity.class);
                }
            } else
            {
                RegistrationRequestPayloadEntity reqOld = registrationRequestPayloadRepository.findByRegistrationRequestId(resultOpt.get()).get();
                oldVersion = mapper.readValue(reqOld.getPayload(), LicensesEntity.class);
            }

            LicensesEntity newVersion = mapper.readValue(reqNew.getPayload(), LicensesEntity.class);


            List<DiffLicense> listDifference = new ArrayList<>();

            if (!newVersion.getExpirationDate().equals(oldVersion.getExpirationDate()))
            {
                DiffLicense diffLicense = new DiffLicense();
                diffLicense.setField("expirationDate");
                diffLicense.setFieldDesc("Data expirarii");
                diffLicense.setAction(DiffLicense.Action.MODIFY);
                SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
                diffLicense.setOldValue(sdf.format(oldVersion.getExpirationDate()));
                diffLicense.setNewValue(sdf.format(newVersion.getExpirationDate()));
                listDifference.add(diffLicense);
            }

            if (!newVersion.getSerialNr().equals(oldVersion.getSerialNr()))
            {
                DiffLicense diffLicense = new DiffLicense();
                diffLicense.setField("serialNr");
                diffLicense.setFieldDesc("Seria");
                diffLicense.setAction(DiffLicense.Action.MODIFY);
                diffLicense.setOldValue(oldVersion.getSerialNr());
                diffLicense.setNewValue(newVersion.getSerialNr());
                listDifference.add(diffLicense);
            }

            if (!newVersion.getNr().equals(oldVersion.getNr()))
            {
                DiffLicense diffLicense = new DiffLicense();
                diffLicense.setField("nr");
                diffLicense.setFieldDesc("Numarul");
                diffLicense.setAction(DiffLicense.Action.MODIFY);
                diffLicense.setOldValue(oldVersion.getNr());
                diffLicense.setNewValue(newVersion.getNr());
                listDifference.add(diffLicense);
            }


            if (!newVersion.getStatus().equals(oldVersion.getStatus()))
            {
                DiffLicense diffLicense = new DiffLicense();
                diffLicense.setField("status");
                diffLicense.setFieldDesc("Statut");
                diffLicense.setAction(DiffLicense.Action.MODIFY);
                diffLicense.setOldValue(oldVersion.getStatus());
                diffLicense.setNewValue(newVersion.getStatus());
                listDifference.add(diffLicense);
            }


            //Economic agents
            //Old
            Set<NmEconomicAgentsEntity> ecOldList = oldVersion.getEconomicAgents();
            //New
            Set<NmEconomicAgentsEntity> ecNewList = newVersion.getEconomicAgents();


            Set<Integer> ecOldIds = ecOldList.stream().map(x -> x.getId()).collect(Collectors.toSet());
            Set<Integer> ecNewIds = ecNewList.stream().map(x -> x.getId()).collect(Collectors.toSet());


            //Modified
            for (Integer newId : ecNewIds)
            {
                if (ecOldIds.contains(newId))
                {
                    if (!ecNewList.stream().filter(f -> f.getId().equals(newId)).findFirst().get().equals(ecOldList.stream().filter(f -> f.getId().equals(newId)).findFirst().get()))
                    {
                        DiffLicense diffLicense = new DiffLicense();
                        diffLicense.setField("ecAgent");
                        diffLicense.setFieldDesc("Agentul economic");
                        diffLicense.setAction(DiffLicense.Action.MODIFY);
                        NmEconomicAgentsEntity ecAgent = ecNewList.stream().filter(ecN -> ecN.getId().equals(newId)).findFirst().get();

                        NmLocalitiesEntity locality = localityService.findLocalityById(ecAgent.getLocality().getId());

                        StringBuilder                   sb       = new StringBuilder();
                        LicenseAgentPharmaceutistEntity pharmNew = ecAgent.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).orElse(null);

                        sb.append(ecAgent.getType().getDescription()).append("; ");
                        sb.append(locality.getStateName()).append(", ").append(locality.getDescription()).append(", ").append(ecAgent.getStreet()).append("; ");
                        if (pharmNew != null)
                        {
                            sb.append(pharmNew.getFullName()).append("; ");
                        }
                        sb.append(ecAgent.getActivities().stream().map(act -> act.getDescription()).collect(Collectors.joining(", ")));


                        NmEconomicAgentsEntity ecAgentOld = ecOldList.stream().filter(ecN -> ecN.getId().equals(newId)).findFirst().get();

                        StringBuilder sbOld = new StringBuilder();

                        LicenseAgentPharmaceutistEntity pharmOld = ecAgentOld.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).orElse(null);

                        sbOld.append(ecAgentOld.getType().getDescription()).append("; ");
                        sbOld.append(locality.getStateName()).append(", ").append(locality.getDescription()).append(", ").append(ecAgentOld.getStreet()).append("; ");
                        if (pharmOld != null)
                        {
                            sbOld.append(pharmOld.getFullName()).append("; ");
                        }

                        sbOld.append(ecAgentOld.getActivities().stream().map(act -> act.getDescription()).collect(Collectors.joining(", ")));

                        diffLicense.setNewValue(sb.toString());
                        diffLicense.setOldValue(sbOld.toString());
                        listDifference.add(diffLicense);
                    }
                }
            }


            //Added
            ecNewIds.removeAll(ecOldIds);

            for (Integer added : ecNewIds)
            {
                DiffLicense diffLicense = new DiffLicense();
                diffLicense.setField("ecAgent");
                diffLicense.setFieldDesc("Agentul economic");
                diffLicense.setAction(DiffLicense.Action.ADD);
                NmEconomicAgentsEntity ecAgent = ecNewList.stream().filter(ecN -> ecN.getId().equals(added)).findFirst().get();

                NmLocalitiesEntity locality = localityService.findLocalityById(ecAgent.getLocality().getId());

                StringBuilder                   sb       = new StringBuilder();
                LicenseAgentPharmaceutistEntity pharmNew = ecAgent.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).orElse(null);

                sb.append(ecAgent.getType().getDescription()).append("; ");
                sb.append(locality.getStateName()).append(", ").append(locality.getDescription()).append(", ").append(ecAgent.getStreet()).append("; ");
                if (pharmNew != null)
                {
                    sb.append(pharmNew.getFullName()).append("; ");
                }
                sb.append(ecAgent.getActivities().stream().map(act -> act.getDescription()).collect(Collectors.joining(", ")));


                diffLicense.setNewValue(sb.toString());
                listDifference.add(diffLicense);
            }

            //New
            ecNewIds = ecNewList.stream().map(x -> x.getId()).collect(Collectors.toSet());

            ecOldIds.removeAll(ecNewIds);

            for (Integer removed : ecOldIds)
            {
                DiffLicense diffLicense = new DiffLicense();
                diffLicense.setField("ecAgent");
                diffLicense.setFieldDesc("Agentul economic");
                diffLicense.setAction(DiffLicense.Action.REMOVE);
                NmEconomicAgentsEntity ecAgent = ecOldList.stream().filter(ecN -> ecN.getId().equals(removed)).findFirst().get();

                NmLocalitiesEntity locality = localityService.findLocalityById(ecAgent.getLocality().getId());

                StringBuilder                   sb       = new StringBuilder();
                LicenseAgentPharmaceutistEntity pharmOld = ecAgent.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).orElse(null);

                sb.append(ecAgent.getType().getDescription()).append("; ");
                sb.append(locality.getStateName()).append(", ").append(locality.getDescription()).append(", ").append(ecAgent.getStreet()).append("; ");
                if (pharmOld != null)
                {
                    sb.append(pharmOld.getFullName()).append("; ");
                }
                sb.append(ecAgent.getActivities().stream().map(act -> act.getDescription()).collect(Collectors.joining(", ")));


                diffLicense.setOldValue(sb.toString());
                listDifference.add(diffLicense);
            }

            return listDifference;

        } catch (IOException e)
        {
            throw new CustomException(e.getMessage(), e);
        }


    }

}