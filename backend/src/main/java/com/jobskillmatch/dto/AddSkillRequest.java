package com.jobskillmatch.dto;

import jakarta.validation.constraints.NotBlank;

public class AddSkillRequest {

    @NotBlank(message = "Skill name is required")
    private String skillName;

    private String proficiency = "Intermediate";

    public AddSkillRequest() {
    }

    public AddSkillRequest(String skillName, String proficiency) {
        this.skillName = skillName;
        this.proficiency = proficiency != null ? proficiency : "Intermediate";
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
