package com.bass.amed.dto.xchange;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class Valute {

    @XmlAttribute(name = "ID")
    private Integer id;
    private String NumCode;
    private String CharCode;
    private Integer Nominal;
    private String Name;
    private Double Value;
}
