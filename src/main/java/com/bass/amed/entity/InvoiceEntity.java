package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "invoices", schema = "amed", catalog = "")
public class InvoiceEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Basic
	@Column(name = "invoice_date", nullable = true)
	private Timestamp invoiceDate;

	@Basic
	@Column(name = "invoice_number")
	private String invoice_number;

	@Basic
	@Column(name = "basis_for_invoice")
	private String basisForInvoice;

	@Basic
	@Column(name = "customs_declaration_date", nullable = true)
	private Timestamp customsDeclarationDate;

	@Basic
	@Column(name = "customs_declaration_number")
	private String customsDeclarationNumber;

	@Basic
	@Column(name = "customs_code")
	private NmCustomsCodesEntity customsCodesEntity;

	@Basic
	@Column(name = "specification")
	private String specification;

//	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
//	@JoinColumn(name = "medicament_id")
//	private MedicamentEntity medicament;

	@OneToMany( fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
	@JoinColumn(name = "invoices_id")
	private Set<InvoiceDetailsEntity> invoiceDetailsEntitySet;

}
