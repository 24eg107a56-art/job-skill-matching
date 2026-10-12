package com.jobskillmatch.dto;

public class CandidateSkillDto {

    private Long id;
    private Long skillId;
    private String name;
    private String category;
    private String proficiency;
    private Boolean verified;

    public CandidateSkillDto() {
    }

    public CandidateSkillDto(Long id, Long skillId, String name, String category, String proficiency, Boolean verified) {
        this.id = id;
        this.skillId = skillId;
        this.name = name;
        this.category = category;
        this.proficiency = proficiency;
        this.verified = verified;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
