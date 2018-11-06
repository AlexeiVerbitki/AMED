package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "medicament_experts", schema = "amed", catalog = "")
public class MedicamentExpertsEntity
{
    private Integer id;
    private NmEmployeesEntity chairman;
    private NmEmployeesEntity farmacolog;
    private NmEmployeesEntity farmacist;
    private NmEmployeesEntity medic;
    private Timestamp date;
    private String comment;
    private String number;
    private Integer status;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "chairman_id" )
    public NmEmployeesEntity getChairman()
    {
        return chairman;
    }

    public void setChairman(NmEmployeesEntity chairman)
    {
        this.chairman = chairman;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "farmacolog_id" )
    public NmEmployeesEntity getFarmacolog()
    {
        return farmacolog;
    }

    public void setFarmacolog(NmEmployeesEntity farmacolog)
    {
        this.farmacolog = farmacolog;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "farmacist_id" )
    public NmEmployeesEntity getFarmacist()
    {
        return farmacist;
    }

    public void setFarmacist(NmEmployeesEntity farmacist)
    {
        this.farmacist = farmacist;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "medic_id" )
    public NmEmployeesEntity getMedic()
    {
        return medic;
    }

    public void setMedic(NmEmployeesEntity medic)
    {
        this.medic = medic;
    }

    @Basic
    @Column(name = "date")
    public Timestamp getDate()
    {
        return date;
    }

    public void setDate(Timestamp date)
    {
        this.date = date;
    }

    @Basic
    @Column(name = "comment")
    public String getComment()
    {
        return comment;
    }

    public void setComment(String comment)
    {
        this.comment = comment;
    }

    @Basic
    @Column(name = "status")
    public Integer getStatus()
    {
        return status;
    }

    public void setStatus(Integer status)
    {
        this.status = status;
    }

    @Basic
    @Column(name = "number")
    public String getNumber()
    {
        return number;
    }

    public void setNumber(String number)
    {
        this.number = number;
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

        MedicamentExpertsEntity that = (MedicamentExpertsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (chairman != null ? !chairman.equals(that.chairman) : that.chairman != null)
        {
            return false;
        }
        if (farmacolog != null ? !farmacolog.equals(that.farmacolog) : that.farmacolog != null)
        {
            return false;
        }
        if (farmacist != null ? !farmacist.equals(that.farmacist) : that.farmacist != null)
        {
            return false;
        }
        if (medic != null ? !medic.equals(that.medic) : that.medic != null)
        {
            return false;
        }
        if (date != null ? !date.equals(that.date) : that.date != null)
        {
            return false;
        }
        if (comment != null ? !comment.equals(that.comment) : that.comment != null)
        {
            return false;
        }
        if (number != null ? !number.equals(that.number) : that.number != null)
        {
            return false;
        }
        return status != null ? status.equals(that.status) : that.status == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (chairman != null ? chairman.hashCode() : 0);
        result = 31 * result + (farmacolog != null ? farmacolog.hashCode() : 0);
        result = 31 * result + (farmacist != null ? farmacist.hashCode() : 0);
        result = 31 * result + (medic != null ? medic.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (comment != null ? comment.hashCode() : 0);
        result = 31 * result + (number != null ? number.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        return result;
    }
}
