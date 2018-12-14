package com.bass.amed.dto.annihilation;

public class CommitteeMember {
	private String institution;
	private String function;
	private String firstName;
	private String lastName;
	private String fullName;
	private String jobDescription;
	private boolean isPresident = false;

	public CommitteeMember() {
		// TODO Auto-generated constructor stub
	}

	public CommitteeMember(String institution, String jobDescription, String function, String firstName,
			String lastName, boolean isPresident) {
		this.institution = institution;
		this.jobDescription = jobDescription;
		this.function = function;
		this.firstName = firstName;
		this.lastName = lastName;
		this.fullName = firstName + " " + lastName;
		this.isPresident = isPresident;
	}

	public CommitteeMember(String institution, String jobDescription, String function, String firstName,
			String lastName) {
		this.institution = institution;
		this.jobDescription = jobDescription;
		this.function = function;
		this.firstName = firstName;
		this.lastName = lastName;
		this.fullName = firstName + " " + lastName;
	}

	public CommitteeMember(String institution, String jobDescription, String function, String fullName,
			boolean isPresident) {
		this.institution = institution;
		this.jobDescription = jobDescription;
		this.function = function;
		this.fullName = fullName;
		this.firstName = fullName.split("\\s")[0];
		this.lastName = fullName.split("\\s")[1];
		this.isPresident = isPresident;
	}

	public CommitteeMember(String institution, String jobDescription, String function, String fullName) {
		this.institution = institution;
		this.jobDescription = jobDescription;
		this.function = function;
		this.fullName = fullName;
		this.firstName = fullName.split("\\s")[0];
		this.lastName = fullName.split("\\s")[1];
	}

	public String getInstitution() {
		return institution;
	}

	public void setInstitution(String institution) {
		this.institution = institution;
	}

	public String getFunction() {
		return function;
	}

	public void setFunction(String function) {
		this.function = function;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public boolean isPresident() {
		return isPresident;
	}

	public void setPresident(boolean isPresident) {
		this.isPresident = isPresident;
	}

	public String getJobDescription() {
		return jobDescription;
	}

	public void setJobDescription(String jobDescription) {
		this.jobDescription = jobDescription;
	}

}
