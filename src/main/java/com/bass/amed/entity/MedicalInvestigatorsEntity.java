package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "medical_investigators", schema = "amed", catalog = "")
public class MedicalInvestigatorsEntity
{
    private Integer id;
    private Integer personId;
    private Integer clinicalTrialId;

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
    @Column(name = "person_id")
    public Integer getPersonId()
    {
        return personId;
    }

    public void setPersonId(Integer personId)
    {
        this.personId = personId;
    }

    @Basic
    @Column(name = "clinical_trial_id")
    public Integer getClinicalTrialId()
    {
        return clinicalTrialId;
    }

    public void setClinicalTrialId(Integer clinicalTrialId)
    {
        this.clinicalTrialId = clinicalTrialId;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (personId != null ? personId.hashCode() : 0);
        result = 31 * result + (clinicalTrialId != null ? clinicalTrialId.hashCode() : 0);
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

        MedicalInvestigatorsEntity that = (MedicalInvestigatorsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (personId != null ? !personId.equals(that.personId) : that.personId != null)
        {
            return false;
        }
        if (clinicalTrialId != null ? !clinicalTrialId.equals(that.clinicalTrialId) : that.clinicalTrialId != null)
        {
            return false;
        }

        return true;
    }
}
