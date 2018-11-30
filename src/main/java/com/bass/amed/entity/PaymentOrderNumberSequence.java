package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table( name = "seq_payment_orders_numbers" )
public class PaymentOrderNumberSequence
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;

    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
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

        PaymentOrderNumberSequence that = (PaymentOrderNumberSequence) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode()
    {
        return id != null ? id.hashCode() : 0;
    }
}
