package com.bass.amed.projection;

import com.bass.amed.entity.*;

import java.sql.Date;
import java.util.Set;

public interface MedicamentDetailsForPraceRegProjection {

    Integer getId();
    String getName();
    String getCode();
    NmInternationalMedicamentNameEntity getInternationalMedicamentName();
    Integer getTermsOfValidity();
    Date getExpirationDate();
    NmUnitsOfMeasurementEntity getUnitsOfMeasurement();
    NmUnitsOfMeasurementEntity getUnitsQuantityMeasurement();
    NmUnitsOfMeasurementEntity getStorageQuantityMeasurement();
    Double getDose();
    Integer getStorageQuantity();
    Integer getUnitsQuantity();
    String getVolume();
    NmMedicamentTypeEntity getMedicamentType();
    Set<PricesEntity> getPrices();
    Set<ReferencePricesEntity> getReferencePrices();
    Set<DocumentsEntity> getDocuments();
}
