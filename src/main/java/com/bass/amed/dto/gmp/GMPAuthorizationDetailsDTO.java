package com.bass.amed.dto.gmp;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
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
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date fromDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date toDate;
    private String cause;
    @Transient
    private Boolean isAuthorization;

    public void assign(GMPAuthorizationDetailsDTO other)
    {
        this.id = other.id;
        this.cause = other.cause;
        this.company = other.company;
        this.authorizationNumber = other.authorizationNumber;
        this.authorizationStartDate = other.authorizationStartDate;
        this.authorizationEndDate = other.authorizationEndDate;
        this.authorizationPath = other.authorizationPath;
        this.certificateNumber = other.certificateNumber;
        this.certificateStartDate = other.certificateStartDate;
        this.certificateEndDate = other.certificateEndDate;
        this.certificatePath = other.certificatePath;
        this.status = other.status;
        this.fromDate = other.fromDate;
        this.toDate = other.toDate;
        this.isAuthorization = other.isAuthorization;
    }
}
