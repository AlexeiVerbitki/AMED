package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "license_details", schema = "amed")
public class LicenseDetailsEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "registration_id")
    private Integer registrationId;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_detail_id")
    private Set<LicenseResolutionEntity> resolutions;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "LICENSE_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "license_detail_id")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    private Set<DocumentsEntity> documents;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_detail_id")
    private Set<LicenseCommisionResponseEntity> commisionResponses;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_detail_id")
    private Set<LicenseMandatedContactEntity> licenseMandatedContacts;


    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "license_payments_orders", joinColumns = {
            @JoinColumn(name = "license_detail_id")}, inverseJoinColumns = {
            @JoinColumn(name = "payment_order_id")})
    private Set<PaymentOrdersEntity> paymentOrders;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "license_receipts", joinColumns = {
            @JoinColumn(name = "license_detail_id")}, inverseJoinColumns = {
            @JoinColumn(name = "receipt_id")})
    private Set<ReceiptsEntity> receipts;


    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }


    public Integer getRegistrationId()
    {
        return registrationId;
    }

    public void setRegistrationId(Integer registrationId)
    {
        this.registrationId = registrationId;
    }


    public Set<LicenseResolutionEntity> getResolutions()
    {
        return resolutions;
    }

    public void setResolutions(Set<LicenseResolutionEntity> resolutions)
    {
        this.resolutions = resolutions;
    }

    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }

    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }

    public Set<LicenseCommisionResponseEntity> getCommisionResponses()
    {
        return commisionResponses;
    }

    public void setCommisionResponses(Set<LicenseCommisionResponseEntity> commisionResponses)
    {
        this.commisionResponses = commisionResponses;
    }

    public Set<LicenseMandatedContactEntity> getLicenseMandatedContacts()
    {
        return licenseMandatedContacts;
    }

    public void setLicenseMandatedContacts(Set<LicenseMandatedContactEntity> licenseMandatedContacts)
    {
        this.licenseMandatedContacts = licenseMandatedContacts;
    }

    public Set<PaymentOrdersEntity> getPaymentOrders()
    {
        return paymentOrders;
    }

    public void setPaymentOrders(Set<PaymentOrdersEntity> paymentOrders)
    {
        this.paymentOrders = paymentOrders;
    }

    public Set<ReceiptsEntity> getReceipts()
    {
        return receipts;
    }

    public void setReceipts(Set<ReceiptsEntity> receipts)
    {
        this.receipts = receipts;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseDetailsEntity that = (LicenseDetailsEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(registrationId, that.registrationId) &&
                Objects.equals(resolutions, that.resolutions) &&
                Objects.equals(documents, that.documents) &&
                Objects.equals(commisionResponses, that.commisionResponses) &&
                Objects.equals(licenseMandatedContacts, that.licenseMandatedContacts) &&
                Objects.equals(paymentOrders, that.paymentOrders) &&
                Objects.equals(receipts, that.receipts);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, registrationId, resolutions, documents, commisionResponses, licenseMandatedContacts, paymentOrders, receipts);
    }
}
