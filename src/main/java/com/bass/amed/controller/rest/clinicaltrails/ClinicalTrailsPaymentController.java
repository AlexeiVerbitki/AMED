package com.bass.amed.controller.rest.clinicaltrails;

import com.bass.amed.entity.CtPaymentOrdersEntity;
import com.bass.amed.entity.PaymentOrderNumberSequence;
import com.bass.amed.repository.CtPaymentOrderRepository;
import com.bass.amed.repository.PaymentOrderNumberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clinical-trails-payment")
public class ClinicalTrailsPaymentController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ClinicalTrailsPaymentController.class);

    @Autowired
    private CtPaymentOrderRepository ctPaymentOrderRepository;

    @Autowired
    private PaymentOrderNumberRepository paymentOrderNumberRepository;

    @RequestMapping("/get-payment-orders-by-request-id")
    public ResponseEntity<List<CtPaymentOrdersEntity>> getPaymentOrdersByRequestId(Integer requestId) {
        LOGGER.debug("Retrieve payment orders by request id " + requestId);

        return new ResponseEntity<>(ctPaymentOrderRepository.findByregistrationRequestId(requestId), HttpStatus.OK);
    }

    @PostMapping("/save-payment-order")
    @Transactional
    public ResponseEntity<CtPaymentOrdersEntity> save(@RequestBody CtPaymentOrdersEntity paymentOrder) {
        LOGGER.debug("Save payment order");

        if(paymentOrder.getNumber()==null){
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);

            paymentOrder.setNumber(seq.getId());
        }
        ctPaymentOrderRepository.saveAndFlush(paymentOrder);
        return new ResponseEntity<>(paymentOrder, HttpStatus.OK);
    }

    @PostMapping("/delete-payment-order")
    public ResponseEntity<Void> removePaymentOrder(@RequestBody Integer id){
        LOGGER.debug("Remove payment order with id " + id);
        ctPaymentOrderRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
