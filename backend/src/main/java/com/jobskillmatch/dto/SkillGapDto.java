package com.jobskillmatch.dto;

import java.util.ArrayList;
import java.util.List;

public class SkillGapDto {

    private Long jobId;
    private String targetRole;
    private String company;
    private int matchPercentage;
    private List<String> matchedSkills = new ArrayList<>();
    private List<SkillGapItemDto> missingSkills = new ArrayList<>();

    public static class SkillGapItemDto {
        private String skill;
        private String priority;
        private String difficulty;
        private String duration;
        private String resource;
        private String resourceName;

        public SkillGapItemDto() {
        }

        public SkillGapItemDto(String skill, String priority, String difficulty, String duration, String resource, String resourceName) {
            this.skill = skill;
            this.priority = priority;
            this.difficulty = difficulty;
            this.duration = duration;
            this.resource = resource;
            this.resourceName = resourceName;
        }

        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getResource() {
            return resource;
        }

        public void setResource(String resource) {
            this.resource = resource;
        }

        public String getResourceName() {
            return resourceName;
        }

        public void setResourceName(String resourceName) {
            this.resourceName = resourceName;
        }
    }

    public SkillGapDto() {
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public int getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(int matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<SkillGapItemDto> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<SkillGapItemDto> missingSkills) {
        this.missingSkills = missingSkills;
    }
}
