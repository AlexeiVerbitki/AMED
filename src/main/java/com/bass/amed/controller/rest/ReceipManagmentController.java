package com.bass.amed.controller.rest;

import com.bass.amed.dto.receiptmanagement.ReceiptManagementFilterDTO;
import com.bass.amed.dto.receiptmanagement.RequestDetailDTO;
import com.bass.amed.projection.TaskDetailsProjectionDTO;
import com.bass.amed.service.ReceiptManagementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/receips")
public class ReceipManagmentController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReceipManagmentController.class);

    @Autowired
    ReceiptManagementService receiptManagementService;

    @PostMapping(value = "/get-pay-orders-by-filter")
    public ResponseEntity<List<RequestDetailDTO>> getTasksByFilter(@RequestBody ReceiptManagementFilterDTO filter)
    {
        LOGGER.debug("Get pay orders by filter: ", filter.toString());
        List<RequestDetailDTO> paymentDetails = receiptManagementService.retreivePaymentOrdersByFilter(filter);
        return new ResponseEntity<>(paymentDetails, HttpStatus.OK);
    }

}
