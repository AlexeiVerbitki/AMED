package com.bass.amed.controller.rest;

import com.bass.amed.dto.PricesDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.GetAVGCurrencyProjection;
import com.bass.amed.projection.GetMinimalCurrencyProjection;
import com.bass.amed.repository.*;
import org.hibernate.transform.Transformers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/price")
public class PriceController {
    private static final Logger logger = LoggerFactory.getLogger(PriceController.class);

    @Autowired
    private CurrencyRepository currencyRepository;

    @Autowired
    private CurrencyHistoryRepository currencyHistoryRepository;

    @Autowired
    private PriceExpirationReasonRepository priceExpirationReasonRepository;

    @Autowired
    private PriceTypesRepository priceTypesRepository;

    @Autowired
    PricesManagementRepository pricesManagementRepository;

    @Autowired
    private PriceRepository priceRepository;

    @RequestMapping("/all-currencies-short")
    public ResponseEntity<List<GetMinimalCurrencyProjection>> getCurrencyShort() throws CustomException {
        logger.debug("Retrieve all currencies with minimal info");
        Optional<List<GetMinimalCurrencyProjection>> nonNullCurrencyList = Optional.of(currencyRepository.findAllOnlyIdAndAndShortDescriptionBy());
        return new ResponseEntity<>(nonNullCurrencyList.orElseThrow(() -> new CustomException("There isn't currencies")), HttpStatus.OK);
    }

    @RequestMapping("/all-price-expiration-reasons")
    public ResponseEntity<List<PriceExpirationReasonsEntity>> getPriceExpirationReasons() throws CustomException {
        logger.debug("Retrieve all price expiration reasons");
        Optional<List<PriceExpirationReasonsEntity>> nonNullReasonsList = Optional.of(priceExpirationReasonRepository.findAll());
        return new ResponseEntity<>(nonNullReasonsList.orElseThrow(() -> new CustomException("There isn't reasons")), HttpStatus.OK);
    }

    @RequestMapping(value = "/today-currencies-short")
    public ResponseEntity<List<NmCurrenciesHistoryEntity>> getTodayCurrencyShort(@RequestParam(value = "from", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") Date date) throws CustomException {
        if (date == null) {
            date = new Date();
        }
        logger.debug("Retrieve all currencies for toady or another day");
        Optional<List<NmCurrenciesHistoryEntity>> nonNullCurrenciesHistoryList = Optional.of(currencyHistoryRepository.getAllByPeriod(date));
        return new ResponseEntity<>(nonNullCurrenciesHistoryList.orElseThrow(() -> new CustomException("No curriencies for today")), HttpStatus.OK);
    }

    @RequestMapping("/prev-month-avg-currencies")
    public ResponseEntity<List<NmCurrenciesHistoryEntity>> getPrevMonthAVGCurrencies() throws CustomException {
        logger.debug("Retrieve all average currencies for previous 30 days");
        Optional<List<GetAVGCurrencyProjection>> nonNullAVGCurrencyList = Optional.of(currencyHistoryRepository.getPrevMonthAVGCurrencies());
        List<NmCurrenciesHistoryEntity> prevMonthAVGCurrenciesList = new ArrayList<>(nonNullAVGCurrencyList.get().size());

        if (nonNullAVGCurrencyList.isPresent()) {

            nonNullAVGCurrencyList.get().forEach(avgCur -> {
                NmCurrenciesHistoryEntity elem = new NmCurrenciesHistoryEntity();
                elem.setValue(avgCur.getAvgValue());
                NmCurrenciesEntity currency = currencyRepository.findById(avgCur.getCurrencyId()).get();
                elem.setCurrency(currency);
                prevMonthAVGCurrenciesList.add(elem);
            });
        }
        return new ResponseEntity<>(prevMonthAVGCurrenciesList, HttpStatus.OK);
    }

    @RequestMapping("/all-price-types")
    public ResponseEntity<List<PriceTypesEntity>> getPriceTypes() throws CustomException {
        logger.debug("Retrieve all price types");
        Optional<List<PriceTypesEntity>> nonNullPriceTypesList = Optional.of(priceTypesRepository.findAll());
        return new ResponseEntity<>(nonNullPriceTypesList.orElseThrow(() -> new CustomException("There isn't price types")), HttpStatus.OK);
    }

    @RequestMapping("/med-prev-prices")
    public ResponseEntity<List<PricesEntity>> getMedPrevPrices(@RequestParam(value = "id", required = true) Integer id) {
        logger.debug("getMedPrevPrices");
        List<PricesEntity> prices = priceRepository.findAllByMedicamentIdAndTypeId(id, 2); //2 = propus
        return new ResponseEntity<>(prices, HttpStatus.OK);
    }

    @PostMapping(value = "/by-filter")
    public ResponseEntity<List<PricesDTO>> getPricesByFilter(@RequestBody PricesDTO filter) throws CustomException {
        logger.debug("Retrieve all price types");

          List<PricesDTO> nonNullPricesRequestList = pricesManagementRepository.getPricesByFilter(filter.getRequestNumber(),
                filter.getMedicamentCode(),
                filter.getMedicamentType(),
                filter.getCurrentStep(),
                filter.getPriceType(),
                filter.getAssignedPerson(),
                filter.getStartDate(),
                filter.getEndDate());/*.unwrap( org.hibernate.query.NativeQuery.class )
            .setResultTransformer( Transformers.aliasToBean( PricesDTO.class ) )
            .getResultList();*/

        List<PricesDTO> dtos = nonNullPricesRequestList;

//        nonNullPricesRequestList.forEach(priceRequestProjection -> {
//            dtos.add(priceRequestProjection);
//        });
//
//        PricesDTO t =  nonNullPricesRequestList.get(0);



        return new ResponseEntity<>(nonNullPricesRequestList, HttpStatus.OK);
//                nonNullPricesRequestList.orElseThrow(() -> new CustomException("There isn't prices")), HttpStatus.OK);
    }

}
