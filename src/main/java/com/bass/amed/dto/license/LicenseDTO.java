package com.bass.amed.dto.license;

import lombok.Data;

import java.io.Serializable;

@Data
public class LicenseDTO implements Serializable
{
    private String idno;
    private String seriaLicenta;
    private String nrLicenta;
}
