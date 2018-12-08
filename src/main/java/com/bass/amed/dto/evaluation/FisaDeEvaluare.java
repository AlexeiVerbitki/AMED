package com.bass.amed.dto.evaluation;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class FisaDeEvaluare {
	private String cimOwner;
	private String countryOwner;
	private String manufacturer;
	private String countryManufacturer;
	private Date applicationDate;
	private List<FisaDeEvaluare4> medicamentClaimedPriceList;
	private String medicamentStatus;
	private List<FisaDeEvaluare6> medicamentOriginalPriceList;
	private Double averageRateEuro;
	private Double averageRateUsd;
	private List<FisaDeEvaluare8> medicamentReferenceCountryPriceList;
	// Fisa de evaluare 9
	private Double min1Mdl;
	private Double min2Mdl;
	private Double min3Mdl;
	private Double medMdl;

	private Double min1Eur;
	private Double min2Eur;
	private Double min3Eur;
	private Double medEur;

	private Double min1Usd;
	private Double min2Usd;
	private Double min3Usd;
	private Double medUsd;

	private List<FisaDeEvaluare10> previousPriceRegistrations;
	private List<FisaDeEvaluare11> originCountryMedicamentPriceList;
	private List<FisaDeEvaluare12> minimalPricesAverages;
	private List<FisaDeEvaluare13> similarRegisteredMedicaments;
	private Map<String, Double> sourceAveragePrices;
	private Map<Integer, Double> previousYearsPrices;

	private String expertName;
	private Date creationFileDate;
	private String chiefSectionName;

	public FisaDeEvaluare() {

	}

	public FisaDeEvaluare(String cimOwner, String countryOwner, String manufacturer, String countryManufacturer,
			Date applicationDate, List<FisaDeEvaluare4> medicamentClaimedPriceList, String medicamentStatus,
			List<FisaDeEvaluare6> medicamentOriginalPriceList, Double averageRateEuro, Double averageRateUsd,
			List<FisaDeEvaluare8> medicamentReferenceCountryPriceList, Double min1Mdl, Double min2Mdl, Double min3Mdl,
			Double medMdl, Double min1Eur, Double min2Eur, Double min3Eur, Double medEur, Double min1Usd,
			Double min2Usd, Double min3Usd, Double medUsd, List<FisaDeEvaluare10> previousPriceRegistrations,
			List<FisaDeEvaluare11> originCountryMedicamentPriceList, List<FisaDeEvaluare12> minimalPricesAverages,
			List<FisaDeEvaluare13> similarRegisteredMedicaments, Map<String, Double> sourceAveragePrices,
			Map<Integer, Double> previousYearsPrices, String expertName, Date creationFileDate,
			String chiefSectionName) {
		this.cimOwner = cimOwner;
		this.countryOwner = countryOwner;
		this.manufacturer = manufacturer;
		this.countryManufacturer = countryManufacturer;
		this.applicationDate = applicationDate;
		this.medicamentClaimedPriceList = medicamentClaimedPriceList;
		this.medicamentStatus = medicamentStatus;
		this.medicamentOriginalPriceList = medicamentOriginalPriceList;
		this.averageRateEuro = averageRateEuro;
		this.averageRateUsd = averageRateUsd;
		this.medicamentReferenceCountryPriceList = medicamentReferenceCountryPriceList;
		this.min1Mdl = min1Mdl;
		this.min2Mdl = min2Mdl;
		this.min3Mdl = min3Mdl;
		this.medMdl = medMdl;
		this.min1Eur = min1Eur;
		this.min2Eur = min2Eur;
		this.min3Eur = min3Eur;
		this.medEur = medEur;
		this.min1Usd = min1Usd;
		this.min2Usd = min2Usd;
		this.min3Usd = min3Usd;
		this.medUsd = medUsd;
		this.previousPriceRegistrations = previousPriceRegistrations;
		this.originCountryMedicamentPriceList = originCountryMedicamentPriceList;
		this.minimalPricesAverages = minimalPricesAverages;
		this.similarRegisteredMedicaments = similarRegisteredMedicaments;
		this.sourceAveragePrices = sourceAveragePrices;
		this.previousYearsPrices = previousYearsPrices;
		this.expertName = expertName;
		this.creationFileDate = creationFileDate;
		this.chiefSectionName = chiefSectionName;
	}

	public String getCimOwner() {
		return cimOwner;
	}

	public void setCimOwner(String cimOwner) {
		this.cimOwner = cimOwner;
	}

	public String getCountryOwner() {
		return countryOwner;
	}

	public void setCountryOwner(String countryOwner) {
		this.countryOwner = countryOwner;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	public String getCountryManufacturer() {
		return countryManufacturer;
	}

	public void setCountryManufacturer(String countryManufacturer) {
		this.countryManufacturer = countryManufacturer;
	}

	public Date getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(Date applicationDate) {
		this.applicationDate = applicationDate;
	}

	public List<FisaDeEvaluare4> getMedicamentClaimedPriceList() {
		return medicamentClaimedPriceList;
	}

	public void setMedicamentClaimedPriceList(List<FisaDeEvaluare4> medicamentClaimedPriceList) {
		this.medicamentClaimedPriceList = medicamentClaimedPriceList;
	}

	public String getMedicamentStatus() {
		return medicamentStatus;
	}

	public void setMedicamentStatus(String medicamentStatus) {
		this.medicamentStatus = medicamentStatus;
	}

	public List<FisaDeEvaluare6> getMedicamentOriginalPriceList() {
		return medicamentOriginalPriceList;
	}

	public void setMedicamentOriginalPriceList(List<FisaDeEvaluare6> medicamentOriginalPriceList) {
		this.medicamentOriginalPriceList = medicamentOriginalPriceList;
	}

	public Double getAverageRateEuro() {
		return averageRateEuro;
	}

	public void setAverageRateEuro(Double averageRateEuro) {
		this.averageRateEuro = averageRateEuro;
	}

	public Double getAverageRateUsd() {
		return averageRateUsd;
	}

	public void setAverageRateUsd(Double averageRateUsd) {
		this.averageRateUsd = averageRateUsd;
	}

	public List<FisaDeEvaluare8> getMedicamentReferenceCountryPriceList() {
		return medicamentReferenceCountryPriceList;
	}

	public void setMedicamentReferenceCountryPriceList(List<FisaDeEvaluare8> medicamentReferenceCountryPriceList) {
		this.medicamentReferenceCountryPriceList = medicamentReferenceCountryPriceList;
	}

	public Double getMin1Mdl() {
		return min1Mdl;
	}

	public void setMin1Mdl(Double min1Mdl) {
		this.min1Mdl = min1Mdl;
	}

	public Double getMin2Mdl() {
		return min2Mdl;
	}

	public void setMin2Mdl(Double min2Mdl) {
		this.min2Mdl = min2Mdl;
	}

	public Double getMin3Mdl() {
		return min3Mdl;
	}

	public void setMin3Mdl(Double min3Mdl) {
		this.min3Mdl = min3Mdl;
	}

	public Double getMedMdl() {
		return medMdl;
	}

	public void setMedMdl(Double medMdl) {
		this.medMdl = medMdl;
	}

	public Double getMin1Eur() {
		return min1Eur;
	}

	public void setMin1Eur(Double min1Eur) {
		this.min1Eur = min1Eur;
	}

	public Double getMin2Eur() {
		return min2Eur;
	}

	public void setMin2Eur(Double min2Eur) {
		this.min2Eur = min2Eur;
	}

	public Double getMin3Eur() {
		return min3Eur;
	}

	public void setMin3Eur(Double min3Eur) {
		this.min3Eur = min3Eur;
	}

	public Double getMedEur() {
		return medEur;
	}

	public void setMedEur(Double medEur) {
		this.medEur = medEur;
	}

	public Double getMin1Usd() {
		return min1Usd;
	}

	public void setMin1Usd(Double min1Usd) {
		this.min1Usd = min1Usd;
	}

	public Double getMin2Usd() {
		return min2Usd;
	}

	public void setMin2Usd(Double min2Usd) {
		this.min2Usd = min2Usd;
	}

	public Double getMin3Usd() {
		return min3Usd;
	}

	public void setMin3Usd(Double min3Usd) {
		this.min3Usd = min3Usd;
	}

	public Double getMedUsd() {
		return medUsd;
	}

	public void setMedUsd(Double medUsd) {
		this.medUsd = medUsd;
	}

	public List<FisaDeEvaluare10> getPreviousPriceRegistrations() {
		return previousPriceRegistrations;
	}

	public void setPreviousPriceRegistrations(List<FisaDeEvaluare10> previousPriceRegistrations) {
		this.previousPriceRegistrations = previousPriceRegistrations;
	}

	public List<FisaDeEvaluare11> getOriginCountryMedicamentPriceList() {
		return originCountryMedicamentPriceList;
	}

	public void setOriginCountryMedicamentPriceList(List<FisaDeEvaluare11> originCountryMedicamentPriceList) {
		this.originCountryMedicamentPriceList = originCountryMedicamentPriceList;
	}

	public List<FisaDeEvaluare12> getMinimalPricesAverages() {
		return minimalPricesAverages;
	}

	public void setMinimalPricesAverages(List<FisaDeEvaluare12> minimalPricesAverages) {
		this.minimalPricesAverages = minimalPricesAverages;
	}

	public List<FisaDeEvaluare13> getSimilarRegisteredMedicaments() {
		return similarRegisteredMedicaments;
	}

	public void setSimilarRegisteredMedicaments(List<FisaDeEvaluare13> similarRegisteredMedicaments) {
		this.similarRegisteredMedicaments = similarRegisteredMedicaments;
	}

	public Map<String, Double> getSourceAveragePrices() {
		return sourceAveragePrices;
	}

	public void setSourceAveragePrices(Map<String, Double> sourceAveragePrices) {
		this.sourceAveragePrices = sourceAveragePrices;
	}

	public Map<Integer, Double> getPreviousYearsPrices() {
		return previousYearsPrices;
	}

	public void setPreviousYearsPrices(Map<Integer, Double> previousYearsPrices) {
		this.previousYearsPrices = previousYearsPrices;
	}

	public String getExpertName() {
		return expertName;
	}

	public void setExpertName(String expertName) {
		this.expertName = expertName;
	}

	public Date getCreationFileDate() {
		return creationFileDate;
	}

	public void setCreationFileDate(Date creationFileDate) {
		this.creationFileDate = creationFileDate;
	}

	public String getChiefSectionName() {
		return chiefSectionName;
	}

	public void setChiefSectionName(String chiefSectionName) {
		this.chiefSectionName = chiefSectionName;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((applicationDate == null) ? 0 : applicationDate.hashCode());
		result = prime * result + ((averageRateEuro == null) ? 0 : averageRateEuro.hashCode());
		result = prime * result + ((averageRateUsd == null) ? 0 : averageRateUsd.hashCode());
		result = prime * result + ((chiefSectionName == null) ? 0 : chiefSectionName.hashCode());
		result = prime * result + ((cimOwner == null) ? 0 : cimOwner.hashCode());
		result = prime * result + ((countryManufacturer == null) ? 0 : countryManufacturer.hashCode());
		result = prime * result + ((countryOwner == null) ? 0 : countryOwner.hashCode());
		result = prime * result + ((creationFileDate == null) ? 0 : creationFileDate.hashCode());
		result = prime * result + ((expertName == null) ? 0 : expertName.hashCode());
		result = prime * result + ((manufacturer == null) ? 0 : manufacturer.hashCode());
		result = prime * result + ((medEur == null) ? 0 : medEur.hashCode());
		result = prime * result + ((medMdl == null) ? 0 : medMdl.hashCode());
		result = prime * result + ((medUsd == null) ? 0 : medUsd.hashCode());
		result = prime * result + ((medicamentClaimedPriceList == null) ? 0 : medicamentClaimedPriceList.hashCode());
		result = prime * result + ((medicamentOriginalPriceList == null) ? 0 : medicamentOriginalPriceList.hashCode());
		result = prime * result
				+ ((medicamentReferenceCountryPriceList == null) ? 0 : medicamentReferenceCountryPriceList.hashCode());
		result = prime * result + ((medicamentStatus == null) ? 0 : medicamentStatus.hashCode());
		result = prime * result + ((min1Eur == null) ? 0 : min1Eur.hashCode());
		result = prime * result + ((min1Mdl == null) ? 0 : min1Mdl.hashCode());
		result = prime * result + ((min1Usd == null) ? 0 : min1Usd.hashCode());
		result = prime * result + ((min2Eur == null) ? 0 : min2Eur.hashCode());
		result = prime * result + ((min2Mdl == null) ? 0 : min2Mdl.hashCode());
		result = prime * result + ((min2Usd == null) ? 0 : min2Usd.hashCode());
		result = prime * result + ((min3Eur == null) ? 0 : min3Eur.hashCode());
		result = prime * result + ((min3Mdl == null) ? 0 : min3Mdl.hashCode());
		result = prime * result + ((min3Usd == null) ? 0 : min3Usd.hashCode());
		result = prime * result + ((minimalPricesAverages == null) ? 0 : minimalPricesAverages.hashCode());
		result = prime * result
				+ ((originCountryMedicamentPriceList == null) ? 0 : originCountryMedicamentPriceList.hashCode());
		result = prime * result + ((previousPriceRegistrations == null) ? 0 : previousPriceRegistrations.hashCode());
		result = prime * result + ((previousYearsPrices == null) ? 0 : previousYearsPrices.hashCode());
		result = prime * result
				+ ((similarRegisteredMedicaments == null) ? 0 : similarRegisteredMedicaments.hashCode());
		result = prime * result + ((sourceAveragePrices == null) ? 0 : sourceAveragePrices.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FisaDeEvaluare other = (FisaDeEvaluare) obj;
		if (applicationDate == null) {
			if (other.applicationDate != null)
				return false;
		} else if (!applicationDate.equals(other.applicationDate))
			return false;
		if (averageRateEuro == null) {
			if (other.averageRateEuro != null)
				return false;
		} else if (!averageRateEuro.equals(other.averageRateEuro))
			return false;
		if (averageRateUsd == null) {
			if (other.averageRateUsd != null)
				return false;
		} else if (!averageRateUsd.equals(other.averageRateUsd))
			return false;
		if (chiefSectionName == null) {
			if (other.chiefSectionName != null)
				return false;
		} else if (!chiefSectionName.equals(other.chiefSectionName))
			return false;
		if (cimOwner == null) {
			if (other.cimOwner != null)
				return false;
		} else if (!cimOwner.equals(other.cimOwner))
			return false;
		if (countryManufacturer == null) {
			if (other.countryManufacturer != null)
				return false;
		} else if (!countryManufacturer.equals(other.countryManufacturer))
			return false;
		if (countryOwner == null) {
			if (other.countryOwner != null)
				return false;
		} else if (!countryOwner.equals(other.countryOwner))
			return false;
		if (creationFileDate == null) {
			if (other.creationFileDate != null)
				return false;
		} else if (!creationFileDate.equals(other.creationFileDate))
			return false;
		if (expertName == null) {
			if (other.expertName != null)
				return false;
		} else if (!expertName.equals(other.expertName))
			return false;
		if (manufacturer == null) {
			if (other.manufacturer != null)
				return false;
		} else if (!manufacturer.equals(other.manufacturer))
			return false;
		if (medEur == null) {
			if (other.medEur != null)
				return false;
		} else if (!medEur.equals(other.medEur))
			return false;
		if (medMdl == null) {
			if (other.medMdl != null)
				return false;
		} else if (!medMdl.equals(other.medMdl))
			return false;
		if (medUsd == null) {
			if (other.medUsd != null)
				return false;
		} else if (!medUsd.equals(other.medUsd))
			return false;
		if (medicamentClaimedPriceList == null) {
			if (other.medicamentClaimedPriceList != null)
				return false;
		} else if (!medicamentClaimedPriceList.equals(other.medicamentClaimedPriceList))
			return false;
		if (medicamentOriginalPriceList == null) {
			if (other.medicamentOriginalPriceList != null)
				return false;
		} else if (!medicamentOriginalPriceList.equals(other.medicamentOriginalPriceList))
			return false;
		if (medicamentReferenceCountryPriceList == null) {
			if (other.medicamentReferenceCountryPriceList != null)
				return false;
		} else if (!medicamentReferenceCountryPriceList.equals(other.medicamentReferenceCountryPriceList))
			return false;
		if (medicamentStatus == null) {
			if (other.medicamentStatus != null)
				return false;
		} else if (!medicamentStatus.equals(other.medicamentStatus))
			return false;
		if (min1Eur == null) {
			if (other.min1Eur != null)
				return false;
		} else if (!min1Eur.equals(other.min1Eur))
			return false;
		if (min1Mdl == null) {
			if (other.min1Mdl != null)
				return false;
		} else if (!min1Mdl.equals(other.min1Mdl))
			return false;
		if (min1Usd == null) {
			if (other.min1Usd != null)
				return false;
		} else if (!min1Usd.equals(other.min1Usd))
			return false;
		if (min2Eur == null) {
			if (other.min2Eur != null)
				return false;
		} else if (!min2Eur.equals(other.min2Eur))
			return false;
		if (min2Mdl == null) {
			if (other.min2Mdl != null)
				return false;
		} else if (!min2Mdl.equals(other.min2Mdl))
			return false;
		if (min2Usd == null) {
			if (other.min2Usd != null)
				return false;
		} else if (!min2Usd.equals(other.min2Usd))
			return false;
		if (min3Eur == null) {
			if (other.min3Eur != null)
				return false;
		} else if (!min3Eur.equals(other.min3Eur))
			return false;
		if (min3Mdl == null) {
			if (other.min3Mdl != null)
				return false;
		} else if (!min3Mdl.equals(other.min3Mdl))
			return false;
		if (min3Usd == null) {
			if (other.min3Usd != null)
				return false;
		} else if (!min3Usd.equals(other.min3Usd))
			return false;
		if (minimalPricesAverages == null) {
			if (other.minimalPricesAverages != null)
				return false;
		} else if (!minimalPricesAverages.equals(other.minimalPricesAverages))
			return false;
		if (originCountryMedicamentPriceList == null) {
			if (other.originCountryMedicamentPriceList != null)
				return false;
		} else if (!originCountryMedicamentPriceList.equals(other.originCountryMedicamentPriceList))
			return false;
		if (previousPriceRegistrations == null) {
			if (other.previousPriceRegistrations != null)
				return false;
		} else if (!previousPriceRegistrations.equals(other.previousPriceRegistrations))
			return false;
		if (previousYearsPrices == null) {
			if (other.previousYearsPrices != null)
				return false;
		} else if (!previousYearsPrices.equals(other.previousYearsPrices))
			return false;
		if (similarRegisteredMedicaments == null) {
			if (other.similarRegisteredMedicaments != null)
				return false;
		} else if (!similarRegisteredMedicaments.equals(other.similarRegisteredMedicaments))
			return false;
		if (sourceAveragePrices == null) {
			if (other.sourceAveragePrices != null)
				return false;
		} else if (!sourceAveragePrices.equals(other.sourceAveragePrices))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "FisaDeEvaluare [cimOwner=" + cimOwner + ", countryOwner=" + countryOwner + ", manufacturer="
				+ manufacturer + ", countryManufacturer=" + countryManufacturer + ", applicationDate=" + applicationDate
				+ ", medicamentClaimedPriceList=" + medicamentClaimedPriceList + ", medicamentStatus="
				+ medicamentStatus + ", medicamentOriginalPriceList=" + medicamentOriginalPriceList
				+ ", averageRateEuro=" + averageRateEuro + ", averageRateUsd=" + averageRateUsd
				+ ", medicamentReferenceCountryPriceList=" + medicamentReferenceCountryPriceList + ", min1Mdl="
				+ min1Mdl + ", min2Mdl=" + min2Mdl + ", min3Mdl=" + min3Mdl + ", medMdl=" + medMdl + ", min1Eur="
				+ min1Eur + ", min2Eur=" + min2Eur + ", min3Eur=" + min3Eur + ", medEur=" + medEur + ", min1Usd="
				+ min1Usd + ", min2Usd=" + min2Usd + ", min3Usd=" + min3Usd + ", medUsd=" + medUsd
				+ ", previousPriceRegistrations=" + previousPriceRegistrations + ", originCountryMedicamentPriceList="
				+ originCountryMedicamentPriceList + ", minimalPricesAverages=" + minimalPricesAverages
				+ ", similarRegisteredMedicaments=" + similarRegisteredMedicaments + ", sourceAveragePrices="
				+ sourceAveragePrices + ", previousYearsPrices=" + previousYearsPrices + ", expertName=" + expertName
				+ ", creationFileDate=" + creationFileDate + ", chiefSectionName=" + chiefSectionName + "]";
	}

}
