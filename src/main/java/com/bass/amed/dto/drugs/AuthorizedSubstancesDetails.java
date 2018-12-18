package com.bass.amed.dto.drugs;

import lombok.Data;

@Data
public class AuthorizedSubstancesDetails {

    private String medicamentName;
    private String um;
    private String quantity;
    private String activeSubstance;
    private String quantityActiveSubstance;

}
