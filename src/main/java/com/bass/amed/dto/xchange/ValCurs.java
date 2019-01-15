package com.bass.amed.dto.xchange;

import lombok.Data;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@Data
@XmlRootElement(name="ValCurs")
@XmlAccessorType(XmlAccessType.FIELD)
public class ValCurs {

    @XmlElement(name="Valute")
    private List<Valute> valutes;
}
