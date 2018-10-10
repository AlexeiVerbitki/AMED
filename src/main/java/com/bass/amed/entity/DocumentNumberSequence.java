package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table( name = "doc_numbers" )
public class DocumentNumberSequence
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;

    @Column( name = "code" )
    private String code;

    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Override
    public String toString()
    {
        final StringBuilder sb = new StringBuilder("DocumentNumberSequence{");
        sb.append("id=").append(id);
        sb.append(", code='").append(code).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
