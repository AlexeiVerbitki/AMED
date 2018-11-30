package com.bass.amed.service;

import com.bass.amed.dto.prices.CatalogPriceDTO;
import com.bass.amed.repository.prices.PricesAutoRevaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Transactional
@Service
public class PriceAutoRevaluationService {
    @Autowired
    PricesAutoRevaluationRepository pricesAutoRevaluationRepository;

    public List<CatalogPriceDTO> getPricesForRevaluation() {
        List<CatalogPriceDTO> prices = pricesAutoRevaluationRepository.getTodayRevisionPrices();
        return prices;
    }
}
