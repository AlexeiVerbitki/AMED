package com.bass.amed.dto.medicament.registration;

import com.bass.amed.entity.NmUnitsOfMeasurementEntity;
import lombok.Data;

@Data
public class DivisionDTO {
    private String code;
    private String description;
    private String volume;
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurement;
}
