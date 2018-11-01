package com.bass.amed.controller.rest;

import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.entity.PriceExpirationReasonsEntity;
import com.bass.amed.entity.PriceTypesEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.GetAVGCurrencyProjection;
import com.bass.amed.projection.GetMinimalCurrencyProjection;
import com.bass.amed.repository.CurrencyHistoryRepository;
import com.bass.amed.repository.CurrencyRepository;
import com.bass.amed.repository.PriceExpirationReasonRepository;
import com.bass.amed.repository.PriceTypesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping( "/api/price" )
public class PriceController
{
    private static final Logger logger = LoggerFactory.getLogger(PriceController.class);

    @Autowired
    private CurrencyRepository currencyRepository;

    @Autowired
    private CurrencyHistoryRepository currencyHistoryRepository;

    @Autowired
    private PriceExpirationReasonRepository priceExpirationReasonRepository;

    @Autowired
    private PriceTypesRepository priceTypesRepository;

    @RequestMapping("/all-currencies-short")
    public ResponseEntity<List<GetMinimalCurrencyProjection>> getCurrencyShort() throws CustomException
    {
        logger.debug("Retrieve all currencies with minimal info");
        Optional<List<GetMinimalCurrencyProjection>> nonNullCurrencyList = Optional.of(currencyRepository.findAllOnlyIdAndAndShortDescriptionBy());
        return new ResponseEntity<>(nonNullCurrencyList.orElseThrow(() -> new CustomException("There isn't currencies")), HttpStatus.OK);
    }

    @RequestMapping("/all-price-expiration-reasons")
    public ResponseEntity<List<PriceExpirationReasonsEntity>> getPriceExpirationReasons() throws CustomException
    {
        logger.debug("Retrieve all price expiration reasons");
        Optional<List<PriceExpirationReasonsEntity>> nonNullReasonsList = Optional.of(priceExpirationReasonRepository.findAll());
        return new ResponseEntity<>(nonNullReasonsList.orElseThrow(() -> new CustomException("There isn't reasons")), HttpStatus.OK);
    }

    @RequestMapping(value = "/today-currencies-short")
    public ResponseEntity<List<NmCurrenciesHistoryEntity>> getTodayCurrencyShort(@RequestParam(value = "from", required = false) @DateTimeFormat(pattern="dd-MM-yyyy")Date date) throws CustomException
    {
        if(date == null) {
            date = new Date();
        }
        logger.debug("Retrieve all currencies for toady or another day");
        Optional<List<NmCurrenciesHistoryEntity>> nonNullCurrenciesHistoryList = Optional.of(currencyHistoryRepository.getAllByPeriod(date));
        return new ResponseEntity<>(nonNullCurrenciesHistoryList.orElseThrow(() -> new CustomException("No curriencies for today")), HttpStatus.OK);
    }

    @RequestMapping("/prev-month-avg-currencies")
    public ResponseEntity<List<NmCurrenciesHistoryEntity>> getPrevMonthAVGCurrencies() throws CustomException
    {
        logger.debug("Retrieve all average currencies for previous 30 days");
        Optional<List<GetAVGCurrencyProjection>> nonNullAVGCurrencyList = Optional.of(currencyHistoryRepository.getPrevMonthAVGCurrencies());
        List<NmCurrenciesHistoryEntity> prevMonthAVGCurrenciesList = new ArrayList<>(nonNullAVGCurrencyList.get().size());

        if(nonNullAVGCurrencyList.isPresent()) {

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
    public ResponseEntity<List<PriceTypesEntity>> getPriceTypes() throws CustomException
    {
        logger.debug("Retrieve all price types");
        Optional<List<PriceTypesEntity>> nonNullPriceTypesList = Optional.of(priceTypesRepository.findAll());
        return new ResponseEntity<>(nonNullPriceTypesList.orElseThrow(() -> new CustomException("There isn't price types")), HttpStatus.OK);
    }
}
