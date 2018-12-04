package com.bass.amed.controller.rest.prices;

import com.bass.amed.dto.prices.CatalogPriceDTO;
import com.bass.amed.dto.prices.PricesDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.GetMinimalCurrencyProjection;
import com.bass.amed.repository.*;
import com.bass.amed.repository.prices.*;
import com.bass.amed.repository.prices.PriceRepository;
import com.bass.amed.repository.prices.PriceTypesRepository;
import com.bass.amed.repository.prices.PricesManagementRepository;
import com.bass.amed.service.PriceAutoRevaluationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    private NmPricesRepository nmPricesRepository;

    @Autowired
    private PricesHistoryRepository pricesHistoryRepository;

    @Autowired
    private PriceAutoRevaluationService priceAutoRevaluationService;

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
    public ResponseEntity<List<NmCurrenciesHistoryEntity>> getPrevMonthAVGCurrencies() {
        logger.debug("Retrieve all average currencies for previous 30 days");
        List<NmCurrenciesHistoryEntity> prevMonthAVGCurrenciesList = priceAutoRevaluationService.getPrevMonthAVGCurrencies();
        return new ResponseEntity<>(prevMonthAVGCurrenciesList, HttpStatus.OK);
    }

    @RequestMapping("/by-id")
    public ResponseEntity<PricesEntity> getPriceById(@RequestParam(value = "id", required = true) Integer priceId) {
        logger.debug("getPriceById");
        PricesEntity price = priceRepository.findOneById(priceId);
        return new ResponseEntity<>(price, HttpStatus.OK);
    }

    @RequestMapping("/price-types")
    public ResponseEntity<List<PriceTypesEntity>> getPriceTypes(@RequestParam(value = "price", required = true) Integer price) throws CustomException {
        logger.debug("Retrieve all price types");
        Optional<List<PriceTypesEntity>> nonNullPriceTypesList;
        if(price == 3) {
            nonNullPriceTypesList = Optional.of(priceTypesRepository.findAll());
        } else {
            nonNullPriceTypesList = Optional.of(priceTypesRepository.findAllByPrice(price));
        }
        return new ResponseEntity<>(nonNullPriceTypesList.orElseThrow(() -> new CustomException("There isn't price types")), HttpStatus.OK);
    }

    @RequestMapping("/med-prev-prices")
    public ResponseEntity<List<PricesHistoryEntity>> getMedPrevPrices(@RequestParam(value = "id", required = true) Integer id) {
        logger.debug("getMedPrevPrices");
        List<PricesHistoryEntity> prices = pricesHistoryRepository.findAllByMedicamentId(id); //2 = acceptat
        return new ResponseEntity<>(prices, HttpStatus.OK);
    }

    @RequestMapping("/original-meds-prices")
    public ResponseEntity<List<NmPricesEntity>> getOriginalMedsPrices(@RequestParam(value = "id", required = true) Integer internationalNameId) {
        logger.debug("getOriginalMedsPrices");
        List<NmPricesEntity> pricesCNP = nmPricesRepository.findAllOriginalMedsSource(internationalNameId, 2, "F"); //2 = acceptat
        return new ResponseEntity<>(pricesCNP, HttpStatus.OK);
    }

    @RequestMapping("/med-price")
    public ResponseEntity<PricesEntity> getMedPrice(@RequestParam(value = "id", required = true) Integer id) {
        logger.debug("getMedPrevPrices");
        PriceTypesEntity type = priceTypesRepository.findOneByDescription("Acceptat");
        PricesEntity price = priceRepository.findLast(id, type.getId());
        return new ResponseEntity<>(price, HttpStatus.OK);
    }

    @RequestMapping("/revaluation")
    public ResponseEntity<List<CatalogPriceDTO>> getPricesForRevaluation() {
        logger.debug("getPricesForRevaluation");
        return new ResponseEntity<>(priceAutoRevaluationService.getPricesForRevaluation(), HttpStatus.OK);
    }

    @RequestMapping("/generics-revaluation")
    public ResponseEntity<List<CatalogPriceDTO>> getGenericsPricesForRevaluation(@RequestParam(value = "priceId", required = true) Integer id) {
        logger.debug("getGenericsPricesForRevaluation");
        PricesEntity originalMedPrice = priceRepository.findOneById(id);

        Optional<NmInternationalMedicamentNameEntity> dci = Optional.ofNullable(originalMedPrice.getMedicament().getInternationalMedicamentName());

        if(dci.isPresent()) {
            Integer dciId = dci.get().getId();
            List<CatalogPriceDTO> genericMedPrices = priceAutoRevaluationService.getGenericsPricesForRevaluation(dciId, originalMedPrice.getMdlValue());
            return new ResponseEntity<>(genericMedPrices, HttpStatus.OK);
        }

        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value = "/save-reevaluation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> savePriceRequest(@RequestBody List<NmPricesEntity> prices)
    {
        List<NmPricesEntity> oldPrices = new ArrayList<>(prices.size());

        prices.forEach(p -> {
            NmPricesEntity oldPrice = nmPricesRepository.findOneById(p.getId());
            oldPrice.setRevisionDate(p.getRevisionDate());
            oldPrice.setPriceMdl(p.getPriceMdl());
            oldPrice.setStatus(p.getStatus());
            oldPrice.setOrderNr(p.getOrderNr());
            oldPrice.setOrderApprovDate(p.getOrderApprovDate());
            oldPrices.add(oldPrice);
        });

        try {
            nmPricesRepository.saveAll(oldPrices);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.CREATED);
        }
    }

    @PostMapping(value = "/by-filter")
    public ResponseEntity<List<PricesDTO>> getPricesByFilter(@RequestBody PricesDTO filter) {
        logger.debug("getPricesByFilter");

          List<PricesDTO> dtos = pricesManagementRepository.getPricesByFilter(filter.getRequestNumber(),
                filter.getMedicamentCode(),
                filter.getOrderNr(),
                filter.getCurrentStep(),
                filter.getPriceType(),
                filter.getAssignedPerson(),
                filter.getOrderApprovDate(),
                filter.getFolderNr(),
                filter.getExpirationDate());

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

}
