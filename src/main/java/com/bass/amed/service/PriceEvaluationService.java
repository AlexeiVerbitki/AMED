package com.bass.amed.service;

import com.bass.amed.dto.prices.CatalogPriceDTO;
import com.bass.amed.dto.prices.registration.annexes.MedicineInfoForAnnex1;
import com.bass.amed.dto.prices.registration.annexes.RegistrationPriceDataForAnnex1;
import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.projection.GetAVGCurrencyProjection;
import com.bass.amed.repository.CurrencyHistoryRepository;
import com.bass.amed.repository.CurrencyRepository;
import com.bass.amed.repository.prices.PriceRepository;
import com.bass.amed.repository.prices.PricesEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
@Service
public class PriceEvaluationService {
    public static final Double INCREASE_PERCENT_LIMIT = new Double(3);
    public static final Double DECREASE_PERCENT_LIMIT = new Double(5);
    public static final Double ORIGINAL_MED_PERCENT_LIMIT = new Double(75);

    @Autowired
    PricesEvaluationRepository pricesEvaluationRepository;

    @Autowired
    private CurrencyHistoryRepository currencyHistoryRepository;

    @Autowired
    private CurrencyRepository currencyRepository;


    public List<MedicineInfoForAnnex1> getPricesForApproval() {
        Optional<List<CatalogPriceDTO>> requests = Optional.of(pricesEvaluationRepository.getPriceForAnexa1());

        List<MedicineInfoForAnnex1> pricesDTO = new ArrayList<>();

        if (requests.isPresent()) {

            Map<Pair<String, String>, List<CatalogPriceDTO>> grouped = requests.get().stream().collect(Collectors.groupingBy(p -> Pair.of(p.getCompany(), p.getCountry())));
            grouped.forEach((p,l) -> {
                List<RegistrationPriceDataForAnnex1> list = l.stream().map(pp -> new RegistrationPriceDataForAnnex1(pp.getMedicamentCode(), pp.getCommercialName(), pp.getPharmaceuticalForm(), pp.getDose(), pp.getDivision(), pp.getPriceMdlNew(), pp.getPriceNew(), pp.getCurrency())).collect(Collectors.toList());
                pricesDTO.add(new MedicineInfoForAnnex1(p.getFirst(), p.getSecond(), list));
            });
        }

        return pricesDTO;
    }


    public List<CatalogPriceDTO> getGenericsPricesForRevaluation(Integer internationalNameId, Double originalMedPriceMdl) {
        List<CatalogPriceDTO> genericMedsPrices = pricesEvaluationRepository.getGenericsPricesForRevaluationByDCI(internationalNameId);
        List<CatalogPriceDTO> genericMedsPricesFiltred = new ArrayList<>();

        double maxGenericMDLPriceValue = (originalMedPriceMdl * ORIGINAL_MED_PERCENT_LIMIT) / 100;

        genericMedsPrices.forEach(p -> {
            if(p.getPriceMdl() > maxGenericMDLPriceValue) {
                CatalogPriceDTO newPrice = new CatalogPriceDTO(p);
                Double differencePercents = (p.getPriceMdl() * 100) / originalMedPriceMdl;
                newPrice.setPriceMdlDifferencePercents(String.format("%.2f", differencePercents));
                newPrice.setPriceMdlNew(maxGenericMDLPriceValue);
                genericMedsPricesFiltred.add(newPrice);
            }
        });

//        changeCNPricesStatus(genericMedsPricesFiltred, "N");

        return genericMedsPricesFiltred;
    }

    public List<CatalogPriceDTO> getPricesForRevaluation() {
        List<CatalogPriceDTO> allPrices = pricesEvaluationRepository.getTodayRevisionPrices();
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

                            String diff = increasePercentDifference > INCREASE_PERCENT_LIMIT ? String.format("\u2191 %.2f", increasePercentDifference) : String.format("\u2193 %.2f", decreasePercentDifference);
                            CatalogPriceDTO priceForRevaluation = new CatalogPriceDTO(p);
                            priceForRevaluation.setPriceMdlNew(updatedMdlPriceValue);
                            priceForRevaluation.setPriceMdlDifferencePercents(diff);
                            priceForRevaluation.setPriceNew(updatedMdlPriceValue * cur.getValue());
                            pricesToChange.add(priceForRevaluation);
                        }
                        break;
                    }
                }
            }
        });

//        changeCNPricesStatus(pricesToChange, "N");

        return pricesToChange;
    }


    public void changeCNPricesStatus(List<CatalogPriceDTO> prices, String status){
        if (prices.size() > 0) {
            List<Integer> idList = prices.stream().map(CatalogPriceDTO::getId).collect(Collectors.toList());
            pricesEvaluationRepository.changeCNPricesStatus(idList, status);
        }
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
