package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "document_module_details", schema = "amed")
public class DocumentModuleDetailsEntity
{
    private Integer id;
    private String sender;
    private String recipient;
    private Timestamp executionDate;
    private String problemDescription;
    private RegistrationRequestsEntity registrationRequestsEntity;

//    @OneToOne(fetch = FetchType.LAZY)
//    @MapsId
//    public RegistrationRequestsEntity getRegistrationRequestsEntity()
//    {
//        return registrationRequestsEntity;
//    }
//
//    public void setRegistrationRequestsEntity(RegistrationRequestsEntity registrationRequestsEntity)
//    {
//        this.registrationRequestsEntity = registrationRequestsEntity;
//    }

    @Id
    @Column(name = "id", nullable = false)
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "sender", nullable = false, length = 30)
    public String getSender()
    {
        return sender;
    }

    public void setSender(String sender)
    {
        this.sender = sender;
    }

    @Basic
    @Column(name = "recipient", nullable = false, length = 30)
    public String getRecipient()
    {
        return recipient;
    }

    public void setRecipient(String recipient)
    {
        this.recipient = recipient;
    }

    @Basic
    @Column(name = "execution_date", nullable = false)
    public Timestamp getExecutionDate()
    {
        return executionDate;
    }

    public void setExecutionDate(Timestamp executionDate)
    {
        this.executionDate = executionDate;
    }

    @Basic
    @Column(name = "problem_description", nullable = true, length = 5000)
    public String getProblemDescription()
    {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription)
    {
        this.problemDescription = problemDescription;
    }



    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (sender != null ? sender.hashCode() : 0);
        result = 31 * result + (recipient != null ? recipient.hashCode() : 0);
        result = 31 * result + (executionDate != null ? executionDate.hashCode() : 0);
        result = 31 * result + (problemDescription != null ? problemDescription.hashCode() : 0);
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

        DocumentModuleDetailsEntity that = (DocumentModuleDetailsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (sender != null ? !sender.equals(that.sender) : that.sender != null)
        {
            return false;
        }
        if (recipient != null ? !recipient.equals(that.recipient) : that.recipient != null)
        {
            return false;
        }
        if (executionDate != null ? !executionDate.equals(that.executionDate) : that.executionDate != null)
        {
            return false;
        }
        if (problemDescription != null ? !problemDescription.equals(that.problemDescription) : that.problemDescription != null)
        {
            return false;
        }

        return true;
    }
}
