package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "medicament_annihilation_meds", schema = "amed", catalog = "")
@IdClass(MedicamentAnnihilationIdentity.class)
public class MedicamentAnnihilationMedsEntity
{
    @Id
    @Column(name = "medicament_id")
    private Integer medicamentId;

    @Id
    @Column(name = "medicament_annihilation_id")
    private Integer medicamentAnnihilationId;


    @Column(name="quantity")
    private Double quantity;

    @Column(name="useless_reason")
    private String uselessReason;

    @Column(name="destruction_method")
    private String destructionMethod;

    public Double getQuantity()
    {
        return quantity;
    }

    public void setQuantity(Double quantity)
    {
        this.quantity = quantity;
    }

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

    public String getUselessReason()
    {
        return uselessReason;
    }

    public void setUselessReason(String uselessReason)
    {
        this.uselessReason = uselessReason;
    }

    public String getDestructionMethod()
    {
        return destructionMethod;
    }

    public void setDestructionMethod(String destructionMethod)
    {
        this.destructionMethod = destructionMethod;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicamentAnnihilationMedsEntity that = (MedicamentAnnihilationMedsEntity) o;
        return Objects.equals(medicamentId, that.medicamentId) &&
                Objects.equals(medicamentAnnihilationId, that.medicamentAnnihilationId) &&
                Objects.equals(quantity, that.quantity) &&
                Objects.equals(uselessReason, that.uselessReason) &&
                Objects.equals(destructionMethod, that.destructionMethod);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(medicamentId, medicamentAnnihilationId, quantity, uselessReason, destructionMethod);
    }
}
