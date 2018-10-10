package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_labels", schema = "amed", catalog = "")
public class NmLabelsEntity
{
    private Integer id;
    private String code;
    private String name;
    private String longName;
    private Integer unitsOfMeasurementId;
    private Byte allowForRanges;
    private Integer startSeries;
    private Integer endSeries;

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
    @Column(name = "code")
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "name")
    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    @Basic
    @Column(name = "long_name")
    public String getLongName()
    {
        return longName;
    }

    public void setLongName(String longName)
    {
        this.longName = longName;
    }

    @Basic
    @Column(name = "units_of_measurement_id")
    public Integer getUnitsOfMeasurementId()
    {
        return unitsOfMeasurementId;
    }

    public void setUnitsOfMeasurementId(Integer unitsOfMeasurementId)
    {
        this.unitsOfMeasurementId = unitsOfMeasurementId;
    }

    @Basic
    @Column(name = "allow_for_ranges")
    public Byte getAllowForRanges()
    {
        return allowForRanges;
    }

    public void setAllowForRanges(Byte allowForRanges)
    {
        this.allowForRanges = allowForRanges;
    }

    @Basic
    @Column(name = "start_series")
    public Integer getStartSeries()
    {
        return startSeries;
    }

    public void setStartSeries(Integer startSeries)
    {
        this.startSeries = startSeries;
    }

    @Basic
    @Column(name = "end_series")
    public Integer getEndSeries()
    {
        return endSeries;
    }

    public void setEndSeries(Integer endSeries)
    {
        this.endSeries = endSeries;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (longName != null ? longName.hashCode() : 0);
        result = 31 * result + (unitsOfMeasurementId != null ? unitsOfMeasurementId.hashCode() : 0);
        result = 31 * result + (allowForRanges != null ? allowForRanges.hashCode() : 0);
        result = 31 * result + (startSeries != null ? startSeries.hashCode() : 0);
        result = 31 * result + (endSeries != null ? endSeries.hashCode() : 0);
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

        NmLabelsEntity that = (NmLabelsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null)
        {
            return false;
        }
        if (name != null ? !name.equals(that.name) : that.name != null)
        {
            return false;
        }
        if (longName != null ? !longName.equals(that.longName) : that.longName != null)
        {
            return false;
        }
        if (unitsOfMeasurementId != null ? !unitsOfMeasurementId.equals(that.unitsOfMeasurementId) : that.unitsOfMeasurementId != null)
        {
            return false;
        }
        if (allowForRanges != null ? !allowForRanges.equals(that.allowForRanges) : that.allowForRanges != null)
        {
            return false;
        }
        if (startSeries != null ? !startSeries.equals(that.startSeries) : that.startSeries != null)
        {
            return false;
        }
        if (endSeries != null ? !endSeries.equals(that.endSeries) : that.endSeries != null)
        {
            return false;
        }

        return true;
    }
}
