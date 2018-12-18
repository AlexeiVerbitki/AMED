package com.bass.amed.dto;

import lombok.Data;

@Data
public class BonDePlataMedicamentDTO
{
    private String nr;
    private String medicamentName;
    private String pharmaceuticForm;
    private String dose;
    private String division;
    private Double price;

    public void assign(BonDePlataMedicamentDTO dto)
    {
        this.nr = dto.getNr();
        this.medicamentName = dto.getMedicamentName();
        this.pharmaceuticForm = dto.getPharmaceuticForm();
        this.dose = dto.getDose();
        this.division = dto.getDivision();
        this.price = dto.getPrice();
    }
}
