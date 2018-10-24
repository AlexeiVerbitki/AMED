package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "import_materia_prima", schema = "amed", catalog = "")
public class ImportAmbalaj {

	private Integer                             id;
	private String                              name;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	public Integer getId() { return id; }

	public void setId(Integer id) { this.id = id; }

	@Basic
	@Column(name = "name", nullable = true, length = 200)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof ImportAmbalaj)) return false;

		ImportAmbalaj that = (ImportAmbalaj) o;

		if (id != null ? !id.equals(that.id) : that.id != null) return false;
		return name != null ? name.equals(that.name) : that.name == null;
	}

	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (name != null ? name.hashCode() : 0);
		return result;
	}
}
