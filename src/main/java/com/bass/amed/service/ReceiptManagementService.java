package com.bass.amed.service;

import com.bass.amed.dto.receiptmanagement.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReceiptManagementService {

    private final static String TASK_QUERY1 =
            "SELECT " +
                    " RREQ.id AS id," +
                    " RREQ.request_number AS requestNumber," +
                    " COMP.name as company," +
                    " PO.number as bonNumber," +
                    " PO.date as emissionDate," +
                    " PO.id as serviceID," +
                    " PO.supplementary_payment suplPay," +
                    " PO.quantity*PO.amount as servicesSum, " +
                    " REC.id as payID, " +
                    " REC.number as payedDocNumber, " +
                    " REC.payment_date as payedDate, " +
                    " REC.amount as payedAmmount " +
                    " FROM registration_requests RREQ " +
                    " LEFT JOIN payment_orders PO ON PO.registration_request_id=RREQ.id " +
                    " LEFT JOIN nm_economic_agents COMP on COMP.id=RREQ.company_id " +
                    " LEFT JOIN receipts REC on REC.payment_order_number=PO.number " +
                    " WHERE PO.number is not null " +
                    " AND PO.quantity is not null" +
                    " AND RREQ.current_step<>'F' " +
                    " AND RREQ.current_step<>'C' " +
                    " AND RREQ.current_step<>'AC' " +
                    " AND RREQ.current_step<>'AF' ";


    private final static String TASK_QUERY2 =
            "SELECT " +
                    " RREQ.id AS id," +
                    " RREQ.request_number as requestNumber," +
                    " COMP.name as company," +
                    " PO.number as bonNumber," +
                    " PO.date as emissionDate," +
                    " POS.id + (select max(amed.payment_orders.id)+5 from amed.payment_orders) as serviceID," +
                    " if(POS.additional_payment>0, 1, 0) as suplPay," +
                    " if(POS.additional_payment>0, POS.additional_payment*POS.quantity, SCH.amount*POS.quantity) as servicesSum," +
                    " REC.id as payID," +
                    " REC.number as payedDocNumber," +
                    " REC.payment_date as payedDate," +
                    " REC.amount as payedAmmount" +
                    " FROM registration_requests RREQ" +
                    " LEFT JOIN nm_economic_agents COMP on COMP.id=RREQ.company_id" +
                    " LEFT JOIN ct_payment_orders PO on PO.registration_request_id=RREQ.id" +
                    " LEFT JOIN ct_pay_ord_serv POS on POS.paymant_order_id=PO.id" +
                    " LEFT JOIN service_charges SCH on SCH.id=POS.service_id" +
                    " LEFT JOIN receipts REC on REC.payment_order_number=PO.number" +
                    " WHERE PO.number is not null" +
                    " AND RREQ.current_step<>'F' " +
                    " AND RREQ.current_step<>'C' " +
                    " AND RREQ.current_step<>'AC' " +
                    " AND RREQ.current_step<>'AF' ";


    private static final Logger LOGGER = LoggerFactory.getLogger(ReceiptManagementService.class);

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    public List<RequestDetailDTO> retreivePaymentOrdersByFilter(ReceiptManagementFilterDTO filter) {
        EntityManager em = null;
        Map<Integer, RequestDetailDTO> taskDetails = new HashMap();
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            List<Object[]> results = new ArrayList<>();
            Query query1 = em.createNativeQuery(createQuery(filter, TASK_QUERY1));
            updateQueryWithValues(filter, query1);
            results.addAll(query1.getResultList());

            Query query2 = em.createNativeQuery(createQuery(filter, TASK_QUERY2));
            updateQueryWithValues(filter, query2);
            results.addAll(query2.getResultList());

            results.stream().forEach(record -> {
                Integer reqId = (Integer) record[0];
                String reqNumber = (String) record[1];
                String economicAgent = (String) record[2];
                String payOrderNr = (record[3] instanceof String) ? (String) record[3] : String.valueOf((Integer) record[3]);

                Date payOrderDate = (Date) record[4];

                Integer serviceId = !(record[5] instanceof Integer) ? ((BigInteger)record[5]).intValue() : (Integer) record[5];

                Boolean isSuplPayment = !(record[6] instanceof Boolean) ? (((Integer)record[6])>0) : Boolean.FALSE;
                Double serviceSumm = (Double) record[7];
                Integer payId = (Integer) record[8];
                String receiptNumber = (String) record[9];
                Date payDate = (Date) record[10];
                Double payedAmmount = (Double) record[11];


                if (taskDetails.containsKey(reqId)) {
                    RequestDetailDTO reqDet = taskDetails.get(reqId);
                    if (reqDet.getPayOrdersMapForCheck().containsKey(payOrderNr)) {
                        PayOrderDTO payOrder = reqDet.getPayOrdersMapForCheck().get(payOrderNr);
                        if (!payOrder.getServiceDetailsMapForCheck().containsKey(serviceId)) {
                            ServiceDetailsDTO sericeDet = new ServiceDetailsDTO(serviceId, isSuplPayment, serviceSumm);
                            payOrder.addserviceDetails(sericeDet);
                        }
                        if (payId != null && !payOrder.getReceipDetailsMapForCheck().containsKey(payId)) {
                            ReceipDetailsDTO receipDet = new ReceipDetailsDTO(payId, receiptNumber, payDate, payedAmmount);
                            payOrder.addReceipDetails(receipDet);
                        }
                    } else {
                        ReceipDetailsDTO receipDet = null;
                        if (payId != null) {
                            receipDet = new ReceipDetailsDTO(payId, receiptNumber, payDate, payedAmmount);
                        }
                        ServiceDetailsDTO sericeDet = new ServiceDetailsDTO(serviceId, isSuplPayment, serviceSumm);
                        PayOrderDTO payOrder = new PayOrderDTO(payOrderNr, payOrderDate, sericeDet, receipDet);
                        reqDet.addPayOrder(payOrder);
                    }
                } else {
                    ReceipDetailsDTO receipDet = null;
                    if (payId != null) {
                        receipDet = new ReceipDetailsDTO(payId, receiptNumber, payDate, payedAmmount);
                    }
                    ServiceDetailsDTO sericeDet = new ServiceDetailsDTO(serviceId, isSuplPayment, serviceSumm);
                    PayOrderDTO payOrder = new PayOrderDTO(payOrderNr, payOrderDate, sericeDet, receipDet);
                    RequestDetailDTO reqDet = new RequestDetailDTO(reqId, reqNumber, economicAgent, payOrder);
                    taskDetails.put(reqId, reqDet);
                }

            });
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            LOGGER.info(e.getMessage());
            LOGGER.debug(e.getMessage());
            throw e;
        } finally {
            em.close();
        }
        List<RequestDetailDTO> array = new ArrayList<RequestDetailDTO>(taskDetails.values());

        Comparator<RequestDetailDTO> comparator = Comparator.comparing(RequestDetailDTO::getReqId);
        List<RequestDetailDTO> sorted = array.stream().sorted(comparator.reversed()).collect(Collectors.toList());

        return sorted;
    }

    private String createQuery(ReceiptManagementFilterDTO filter, String sqlQuery) {
        StringBuilder stringBuilder = new StringBuilder(sqlQuery);
        if (filter.getRequestCode() != null && !filter.getRequestCode().isEmpty()) {
            stringBuilder.append(" AND RREQ.request_number like (:requestCode)");
        }
        if (filter.getRequestNumber() != null && !filter.getRequestNumber().isEmpty()) {
            stringBuilder.append(" AND RREQ.request_number like (:requestNumber)");
        }
        if (filter.getComanyId() != null) {
            stringBuilder.append(" AND RREQ.company_id=:companyId");
        }
        stringBuilder.append(" ORDER BY RREQ.id desc");
        return stringBuilder.toString();
    }

    private void updateQueryWithValues(ReceiptManagementFilterDTO filter, Query query){
        if (filter.getRequestCode() != null && !filter.getRequestCode().isEmpty()) {
            query.setParameter("requestCode", filter.getRequestCode().concat("-").concat("%"));
        }
        if (filter.getRequestNumber() != null && !filter.getRequestNumber().isEmpty()) {
            query.setParameter("requestNumber", "%".concat(filter.getRequestNumber()).concat("%"));
        }
        if (filter.getComanyId() != null) {
            query.setParameter("companyId", filter.getComanyId());
        }
    }
}
