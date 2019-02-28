package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_customs_points", schema = "amed", catalog = "")
public class NmCustomsPointsEntity {
	private Integer id;
	private String  code;
	private String  description;



	@Id
	@Column(name = "id")
	public Integer getId() {
		return id;
	}

	public void setId(
			Integer id) {
		this.id = id;
	}

	@Basic
	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(
			String code) {
		this.code = code;
	}

	@Basic
	@Column(name = "description")
	public String getDescription() {
		return description;
	}

	public void setDescription(
			String description) {
		this.description = description;
	}

	@Override
	public boolean equals(Object o)
	{
		if (this == o)
		{
			return true;
		}
		if (!(o instanceof NmCustomsPointsEntity))
		{
			return false;
		}

		NmCustomsPointsEntity that = (NmCustomsPointsEntity) o;

		if (id != null ? !id.equals(that.id) : that.id != null)
		{
			return false;
		}
		if (code != null ? !code.equals(that.code) : that.code != null)
		{
			return false;
		}
		return description != null ? description.equals(that.description) : that.description == null;
	}

	@Override
	public int hashCode()
	{
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (code != null ? code.hashCode() : 0);
		result = 31 * result + (description != null ? description.hashCode() : 0);
		return result;
	}
}
