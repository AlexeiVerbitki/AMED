package com.bass.amed.dto.gmp;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "gmp_authorizations", schema = "amed")
public class GMPAuthorizationDetailsDTO
{
    @Id
    private Integer id;
    private String company;
    private String authorizationNumber;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date authorizationStartDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date authorizationEndDate;
    private String authorizationPath;
    private String certificateNumber;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date certificateStartDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date certificateEndDate;
    private String certificatePath;
    private String status;
}
