package com.bass.amed.dto.license;

import lombok.Data;

@Data
public class DiffLicense
{
    private String field;
    private String fieldDesc;
    private Action action;
    private String oldValue;
    private String newValue;

    public enum Action {
        ADD, REMOVE, MODIFY
    }

}


