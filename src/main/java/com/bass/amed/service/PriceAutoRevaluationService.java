package com.bass.amed.service;

import com.bass.amed.dto.prices.CatalogPriceDTO;
import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.projection.GetAVGCurrencyProjection;
import com.bass.amed.repository.CurrencyHistoryRepository;
import com.bass.amed.repository.CurrencyRepository;
import com.bass.amed.repository.prices.PricesAutoRevaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class PriceAutoRevaluationService {
    public static final Double INCREASE_PERCENT_LIMIT = new Double(3);
    public static final Double DECREASE_PERCENT_LIMIT = new Double(5);
    public static final Double ORIGINAL_MED_PERCENT_LIMIT = new Double(75);

    @Autowired
    PricesAutoRevaluationRepository pricesAutoRevaluationRepository;

    @Autowired
    private CurrencyHistoryRepository currencyHistoryRepository;

    @Autowired
    private CurrencyRepository currencyRepository;

    public List<CatalogPriceDTO> getGenericsPricesForRevaluation(Integer internationalNameId, Double originalMedPriceMdl) {
        List<CatalogPriceDTO> genericMedsPrices = pricesAutoRevaluationRepository.getGenericsPricesForRevaluationByDCI(internationalNameId);
        List<CatalogPriceDTO> genericMedsPricesFiltred = new ArrayList<>();

        double maxGenericMDLPriceValue = (originalMedPriceMdl * ORIGINAL_MED_PERCENT_LIMIT) / 100;

        genericMedsPrices.forEach(p -> {
            if(p.getPriceMdl() > maxGenericMDLPriceValue) {
                CatalogPriceDTO newPrice = new CatalogPriceDTO(p);
                Double differencePercents = (p.getPriceMdl() * 100) / originalMedPriceMdl;
                newPrice.setPriceMdlDifferencePercents(String.format("%.2f%%", differencePercents));
                newPrice.setPriceMdlNew(maxGenericMDLPriceValue);
                genericMedsPricesFiltred.add(newPrice);
            }
        });
        return genericMedsPricesFiltred;
    }

    public List<CatalogPriceDTO> getPricesForRevaluation() {
        List<CatalogPriceDTO> allPrices = pricesAutoRevaluationRepository.getTodayRevisionPrices();
        List<NmCurrenciesHistoryEntity> lastMonthCurrenciesAvg = getPrevMonthAVGCurrencies();
        lastMonthCurrenciesAvg.removeIf(cur -> !cur.getCurrency().getShortDescription().equals("EUR") && !cur.getCurrency().getShortDescription().equals("USD"));

        List<CatalogPriceDTO> pricesToChange = new ArrayList<>();

        allPrices.forEach(p -> {

            if(p.getPrice() != null && p.getPrice() > 0 && p.getPriceMdl() != null && p.getPriceMdl() > 0){

                for(NmCurrenciesHistoryEntity cur : lastMonthCurrenciesAvg) {

                    if(p.getCurrency().equals(cur.getCurrency().getShortDescription())) {

                        Double xchangeValueMdl = cur.getValue();
                        Double updatedMdlPriceValue = p.getPrice() * xchangeValueMdl;
                        Double increasePercentDifference = calculatePercentageIncrease(updatedMdlPriceValue, p.getPriceMdl());
                        Double decreasePercentDifference = calculatePercentageIncrease(p.getPriceMdl(), updatedMdlPriceValue);

                        if (increasePercentDifference > INCREASE_PERCENT_LIMIT || decreasePercentDifference > DECREASE_PERCENT_LIMIT) {

                            String diff = increasePercentDifference > INCREASE_PERCENT_LIMIT ? String.format("\u2191 %.2f%%", increasePercentDifference) : String.format("\u2193 %.2f%%", decreasePercentDifference);
                            CatalogPriceDTO priceForRevaluation = new CatalogPriceDTO(p);
                            priceForRevaluation.setPriceMdlNew(updatedMdlPriceValue);
                            priceForRevaluation.setPriceMdlDifferencePercents(diff);
                            pricesToChange.add(priceForRevaluation);
                        }
                        break;
                    }
                }
            }

        });
        return pricesToChange;
    }

    public List<NmCurrenciesHistoryEntity> getPrevMonthAVGCurrencies() {
        Optional<List<GetAVGCurrencyProjection>> nonNullAVGCurrencyList = Optional.of(currencyHistoryRepository.getPrevMonthAVGCurrencies());
        List<NmCurrenciesHistoryEntity> prevMonthAVGCurrenciesList = new ArrayList<>(nonNullAVGCurrencyList.get().size());

        if (nonNullAVGCurrencyList.isPresent()) {

            nonNullAVGCurrencyList.get().forEach(avgCur -> {
                NmCurrenciesHistoryEntity elem = new NmCurrenciesHistoryEntity();
                elem.setValue(avgCur.getAvgValue());
                NmCurrenciesEntity currency = currencyRepository.findById(avgCur.getCurrencyId()).get();
                elem.setCurrency(currency);
                elem.setPeriod(new java.util.Date());
                prevMonthAVGCurrenciesList.add(elem);
            });
        }
        return prevMonthAVGCurrenciesList;
    }

    Double calculatePercentageIncrease(Double firstValue, Double lastValue) {
        return ((firstValue - lastValue) / lastValue) * 100;
    }
}
