package com.jobskillmatch.dto;

import java.util.ArrayList;
import java.util.List;

public class RoadmapGenerateRequest {

    private String targetRole;
    private List<String> skills = new ArrayList<>();

    public RoadmapGenerateRequest() {
    }

    public RoadmapGenerateRequest(String targetRole, List<String> skills) {
        this.targetRole = targetRole;
        this.skills = skills != null ? skills : new ArrayList<>();
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
