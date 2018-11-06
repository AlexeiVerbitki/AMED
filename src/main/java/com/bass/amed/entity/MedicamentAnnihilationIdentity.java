package com.bass.amed.entity;


import java.io.Serializable;
import java.util.Objects;

//@Embeddable
public class MedicamentAnnihilationIdentity implements Serializable
{
//    @Column(name = "medicament_id")
    private Integer medicamentId;

//    @Column(name = "medicament_annihilation_id")
    private Integer medicamentAnnihilationId;


    public Integer getMedicamentId()
    {
        return medicamentId;
    }

    public void setMedicamentId(Integer medicamentId)
    {
        this.medicamentId = medicamentId;
    }

    public Integer getMedicamentAnnihilationId()
    {
        return medicamentAnnihilationId;
    }

    public void setMedicamentAnnihilationId(Integer medicamentAnnihilationId)
    {
        this.medicamentAnnihilationId = medicamentAnnihilationId;
    }

    public MedicamentAnnihilationIdentity()
    {
    }

    public MedicamentAnnihilationIdentity(Integer medicamentId, Integer medicamentAnnihilationId)
    {
        this.medicamentId = medicamentId;
        this.medicamentAnnihilationId = medicamentAnnihilationId;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicamentAnnihilationIdentity that = (MedicamentAnnihilationIdentity) o;
        return Objects.equals(medicamentId, that.medicamentId) &&
                Objects.equals(medicamentAnnihilationId, that.medicamentAnnihilationId);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(medicamentId, medicamentAnnihilationId);
    }
}
