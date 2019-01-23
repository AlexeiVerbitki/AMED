package com.bass.amed.controller.rest.clinicaltrails;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.clinicaltrial.ClinicalTrialPayNoteDTO;
import com.bass.amed.dto.clinicaltrial.ServiceTaxesDTO;
import com.bass.amed.entity.CtPaymentOrdersEntity;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.PaymentOrderNumberSequence;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.utils.AmountUtils;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clinical-trails-payment")
public class ClinicalTrailsPaymentController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ClinicalTrailsPaymentController.class);

    @Autowired
    private CtPaymentOrderRepository ctPaymentOrderRepository;

    @Autowired
    private PaymentOrderNumberRepository paymentOrderNumberRepository;

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    @Autowired
    private SysParamsRepository sysParamsRepository;

    @Autowired
    private CurrencyHistoryRepository currencyHistoryRepository;

    @RequestMapping("/get-payment-orders-by-request-id")
    public ResponseEntity<List<CtPaymentOrdersEntity>> getPaymentOrdersByRequestId(Integer requestId) {
        LOGGER.debug("Retrieve payment orders by request id " + requestId);

        return new ResponseEntity<>(ctPaymentOrderRepository.findByregistrationRequestId(requestId), HttpStatus.OK);
    }

    @PostMapping("/save-payment-order")
    @Transactional
    public ResponseEntity<CtPaymentOrdersEntity> save(@RequestBody CtPaymentOrdersEntity paymentOrder) {
        LOGGER.debug("Save payment order");

        if (paymentOrder.getNumber() == null) {
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);

            paymentOrder.setNumber(seq.getId());
        }
        ctPaymentOrderRepository.saveAndFlush(paymentOrder);
        return new ResponseEntity<>(paymentOrder, HttpStatus.OK);
    }

    @PostMapping("/delete-payment-order")
    public ResponseEntity<Void> removePaymentOrder(@RequestBody Integer id) {
        LOGGER.debug("Remove payment order with id " + id);
        ctPaymentOrderRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/generate-payment-order")
    public ResponseEntity<byte[]> generatePaymentOrder(@RequestBody ClinicalTrialPayNoteDTO ctPayNote) throws CustomException {
        byte[] bytes = null;

        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = null;

            Double coeficient = 1d;
            DateFormat formatter = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            if (!ctPayNote.getCurrency().isEmpty() && !ctPayNote.getCurrency().equals("MDL")) {
                List<NmCurrenciesHistoryEntity> nmCurrenciesHistoryEntities = currencyHistoryRepository.findAllByPeriod(formatter.parse(formatter.format(ctPayNote.getPayOrder().getDate())));
                if (nmCurrenciesHistoryEntities.isEmpty()) {
                    throw new CustomException("Lipseste cursul valutar pentru astazi.");
                }
                NmCurrenciesHistoryEntity nmCurrenciesHistoryEntity =
                        nmCurrenciesHistoryEntities.stream().filter(t -> t.getCurrency().getShortDescription().equals(ctPayNote.getCurrency())).findFirst().orElse(new NmCurrenciesHistoryEntity());
                if (nmCurrenciesHistoryEntity.getId() <= 0) {
                    throw new CustomException("Nu a fost gasit cursul valutar pentru valuta " + ctPayNote.getCurrency());
                }
                coeficient = AmountUtils.round(nmCurrenciesHistoryEntity.getValue() / nmCurrenciesHistoryEntity.getMultiplicity(), 4);
            }
            switch (ctPayNote.getCurrency()) {
                case "USD":
                    res = resourceLoader.getResource("layouts/BonDePlataStudiuClinicUsd.jrxml");
                    break;
                case "EUR":
                    res = resourceLoader.getResource("layouts/BonDePlataStudiuClinicEur.jrxml");
                    break;
                default:
                    res = resourceLoader.getResource("layouts/BonDePlataStudiuClinicLei.jrxml");
                    break;
            }

            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<ServiceTaxesDTO> servTaxList = ctPayNote.getPayOrder().getCtPayOrderServices().stream().map(serv -> {
                ServiceTaxesDTO servTax = new ServiceTaxesDTO();
                servTax.setServicesName(serv.getServiceCharge().getDescription());
                servTax.setQuantety(serv.getQuantity().toString());
                servTax.setSum(serv.getServiceCharge().getAmount());
                servTax.setTotalSum(serv.getQuantity() * serv.getServiceCharge().getAmount());
                return servTax;
            }).collect(Collectors.toList());

            JRBeanCollectionDataSource bonDePlataStudiuClinicDataset = new JRBeanCollectionDataSource(servTaxList);

            NmEconomicAgentsEntity nmEconomicAgentsEntity = economicAgentsRepository.getParentForIdno(ctPayNote.getEconomicAgent().getIdno()).get();
            String date = new SimpleDateFormat(Constants.Layouts.POINT_DATE_FORMAT).format(ctPayNote.getPayOrder().getDate());

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", ctPayNote.getPayOrder().getNumber().toString());
            parameters.put("date", date);

            parameters.put("companyName", nmEconomicAgentsEntity.getName());
            parameters.put("companyAddress", nmEconomicAgentsEntity.getLegalAddress());

            if (ctPayNote.getClinicalTrial() != null) {
                parameters.put("clinicStudyNr", ctPayNote.getClinicalTrial().getCode());
                parameters.put("clinicStudyDescription", ctPayNote.getClinicalTrial().getTitle());
                parameters.put("phases", ctPayNote.getClinicalTrial().getPhase().getName());
            }

            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("beneficiary", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY).get().getValue());
            parameters.put("ibanCode", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_IBAN).get().getValue());

            parameters.put("bankAccount", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK_ACCOUNT).get().getValue());

            parameters.put("intermediaryBank", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_ITERMEDIARY_BANK).get().getValue());
            parameters.put("swiftCode", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_SWIFT_CODE).get().getValue());

            parameters.put("fiscalCode", sysParamsRepository.findByCode(Constants.SysParams.VAT_CODE).get().getValue());
            parameters.put("bankCode", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK_CODE).get().getValue());

            parameters.put("servicesTableDataset", bonDePlataStudiuClinicDataset);
            parameters.put("exchangeDate", formatter.format(ctPayNote.getPayOrder().getDate()));
            parameters.put("1euroToMdl", coeficient);
            parameters.put("1usdToMdl", coeficient);

            double summedTaxes = servTaxList.stream().mapToDouble(serv -> serv.getTotalSum()).sum();
            parameters.put("sumToPayEUR", String.valueOf(AmountUtils.round(summedTaxes / coeficient, 2)));
            parameters.put("sumToPayUSD", String.valueOf(AmountUtils.round(summedTaxes / coeficient, 2)));

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=anexaLicenta.pdf").body(bytes);
    }
}
