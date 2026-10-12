package com.jobskillmatch.dto;

import java.util.List;

public class CandidateProfileUpdateRequest {

    private String name;
    private String phone;
    private String degree;
    private String university;
    private Integer graduationYear;
    private Integer yearsOfExperience;
    private String preferredRole;
    private String preferredLocation;
    private String employmentPreference;
    private String workExperience;
    private String certifications;
    private List<SkillProficiencyRequest> skills;

    public static class SkillProficiencyRequest {
        private String skillName;
        private String proficiency;

        public SkillProficiencyRequest() {
        }

        public SkillProficiencyRequest(String skillName, String proficiency) {
            this.skillName = skillName;
            this.proficiency = proficiency;
        }

        public String getSkillName() {
            return skillName;
        }

        public void setSkillName(String skillName) {
            this.skillName = skillName;
        }

        public String getProficiency() {
            return proficiency;
        }

        public void setProficiency(String proficiency) {
            this.proficiency = proficiency;
        }
    }

    public CandidateProfileUpdateRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getPreferredRole() {
        return preferredRole;
    }

    public void setPreferredRole(String preferredRole) {
        this.preferredRole = preferredRole;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    public String getEmploymentPreference() {
        return employmentPreference;
    }

    public void setEmploymentPreference(String employmentPreference) {
        this.employmentPreference = employmentPreference;
    }

    public String getWorkExperience() {
        return workExperience;
    }

    public void setWorkExperience(String workExperience) {
        this.workExperience = workExperience;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public List<SkillProficiencyRequest> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillProficiencyRequest> skills) {
        this.skills = skills;
    }
}
