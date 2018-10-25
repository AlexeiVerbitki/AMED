package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "import_authorization", schema = "amed", catalog = "")
public class ImportAuthorizationEntity
{
    private Integer   id;
    private Integer   stuffType;
    private Integer   importerId;
    private Integer   sellerId;
    private Integer   producerId;
    private Integer   nr;
    private Timestamp startDate;
    private Timestamp endDate;
    private Integer   customsTransactionTypeId;
    private Integer   customCodeId;
    private Integer   sampling;
    private Integer   returnedQuantity;
    private Integer   customsDeclarationsNr;
    private Timestamp customsDeclarationDate;

    @Id
    @Column(name = "id")
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "stuff_type")
    public Integer getStuffType()
    {
        return stuffType;
    }

    public void setStuffType(Integer stuffType)
    {
        this.stuffType = stuffType;
    }

    @Basic
    @Column(name = "importer_id")
    public Integer getImporterId()
    {
        return importerId;
    }

    public void setImporterId(Integer importerId)
    {
        this.importerId = importerId;
    }

    @Basic
    @Column(name = "seller_id")
    public Integer getSellerId()
    {
        return sellerId;
    }

    public void setSellerId(Integer sellerId)
    {
        this.sellerId = sellerId;
    }

    @Basic
    @Column(name = "producer_id")
    public Integer getProducerId()
    {
        return producerId;
    }

    public void setProducerId(Integer producerId)
    {
        this.producerId = producerId;
    }

    @Basic
    @Column(name = "nr")
    public Integer getNr()
    {
        return nr;
    }

    public void setNr(Integer nr)
    {
        this.nr = nr;
    }

    @Basic
    @Column(name = "start_date")
    public Timestamp getStartDate()
    {
        return startDate;
    }

    public void setStartDate(Timestamp startDate)
    {
        this.startDate = startDate;
    }

    @Basic
    @Column(name = "end_date")
    public Timestamp getEndDate()
    {
        return endDate;
    }

    public void setEndDate(Timestamp endDate)
    {
        this.endDate = endDate;
    }

    @Basic
    @Column(name = "customs_transaction_type_id")
    public Integer getCustomsTransactionTypeId()
    {
        return customsTransactionTypeId;
    }

    public void setCustomsTransactionTypeId(Integer customsTransactionTypeId)
    {
        this.customsTransactionTypeId = customsTransactionTypeId;
    }

    @Basic
    @Column(name = "custom_code_id")
    public Integer getCustomCodeId()
    {
        return customCodeId;
    }

    public void setCustomCodeId(Integer customCodeId)
    {
        this.customCodeId = customCodeId;
    }

    @Basic
    @Column(name = "sampling")
    public Integer getSampling()
    {
        return sampling;
    }

    public void setSampling(Integer sampling)
    {
        this.sampling = sampling;
    }

    @Basic
    @Column(name = "returned_quantity")
    public Integer getReturnedQuantity()
    {
        return returnedQuantity;
    }

    public void setReturnedQuantity(Integer returnedQuantity)
    {
        this.returnedQuantity = returnedQuantity;
    }

    @Basic
    @Column(name = "customs_declarations_nr")
    public Integer getCustomsDeclarationsNr()
    {
        return customsDeclarationsNr;
    }

    public void setCustomsDeclarationsNr(Integer customsDeclarationsNr)
    {
        this.customsDeclarationsNr = customsDeclarationsNr;
    }

    @Basic
    @Column(name = "customs_declaration_date")
    public Timestamp getCustomsDeclarationDate()
    {
        return customsDeclarationDate;
    }

    public void setCustomsDeclarationDate(Timestamp customsDeclarationDate)
    {
        this.customsDeclarationDate = customsDeclarationDate;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (stuffType != null ? stuffType.hashCode() : 0);
        result = 31 * result + (importerId != null ? importerId.hashCode() : 0);
        result = 31 * result + (sellerId != null ? sellerId.hashCode() : 0);
        result = 31 * result + (producerId != null ? producerId.hashCode() : 0);
        result = 31 * result + (nr != null ? nr.hashCode() : 0);
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
        result = 31 * result + (endDate != null ? endDate.hashCode() : 0);
        result = 31 * result + (customsTransactionTypeId != null ? customsTransactionTypeId.hashCode() : 0);
        result = 31 * result + (customCodeId != null ? customCodeId.hashCode() : 0);
        result = 31 * result + (sampling != null ? sampling.hashCode() : 0);
        result = 31 * result + (returnedQuantity != null ? returnedQuantity.hashCode() : 0);
        result = 31 * result + (customsDeclarationsNr != null ? customsDeclarationsNr.hashCode() : 0);
        result = 31 * result + (customsDeclarationDate != null ? customsDeclarationDate.hashCode() : 0);
        return result;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }
        if (o == null || getClass() != o.getClass())
        {
            return false;
        }

        ImportAuthorizationEntity that = (ImportAuthorizationEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (stuffType != null ? !stuffType.equals(that.stuffType) : that.stuffType != null)
        {
            return false;
        }
        if (importerId != null ? !importerId.equals(that.importerId) : that.importerId != null)
        {
            return false;
        }
        if (sellerId != null ? !sellerId.equals(that.sellerId) : that.sellerId != null)
        {
            return false;
        }
        if (producerId != null ? !producerId.equals(that.producerId) : that.producerId != null)
        {
            return false;
        }
        if (nr != null ? !nr.equals(that.nr) : that.nr != null)
        {
            return false;
        }
        if (startDate != null ? !startDate.equals(that.startDate) : that.startDate != null)
        {
            return false;
        }
        if (endDate != null ? !endDate.equals(that.endDate) : that.endDate != null)
        {
            return false;
        }
        if (customsTransactionTypeId != null ? !customsTransactionTypeId.equals(that.customsTransactionTypeId) : that.customsTransactionTypeId != null)
        {
            return false;
        }
        if (customCodeId != null ? !customCodeId.equals(that.customCodeId) : that.customCodeId != null)
        {
            return false;
        }
        if (sampling != null ? !sampling.equals(that.sampling) : that.sampling != null)
        {
            return false;
        }
        if (returnedQuantity != null ? !returnedQuantity.equals(that.returnedQuantity) : that.returnedQuantity != null)
        {
            return false;
        }
        if (customsDeclarationsNr != null ? !customsDeclarationsNr.equals(that.customsDeclarationsNr) : that.customsDeclarationsNr != null)
        {
            return false;
        }
        if (customsDeclarationDate != null ? !customsDeclarationDate.equals(that.customsDeclarationDate) : that.customsDeclarationDate != null)
        {
            return false;
        }

        return true;
    }
}
