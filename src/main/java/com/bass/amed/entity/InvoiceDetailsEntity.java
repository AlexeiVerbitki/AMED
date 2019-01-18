package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Data
@Table(name = "invoice_details", schema = "amed", catalog = "")
public class InvoiceDetailsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Basic
	@Column(name = "quantity")
	private Integer quantity;

	@Basic
	@Column(name = "price")
	private Double price;

	@Basic
	@Column(name = "sum")
	private Double sum;

	@Basic
	@Column(name = "authorizations_number")
	private String authorizationsNumber;

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "medicament_id")
	private MedicamentEntity medicament;

//	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
//	@JoinColumn(name = "invoices_id")
//	private ImportAuthorizationDetailsEntity authorizationDetailsId;

}
