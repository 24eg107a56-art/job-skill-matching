package com.jobskillmatch.dto;

import java.util.ArrayList;
import java.util.List;

public class JobMatchResultDto {

    private JobDto job;
    private int matchPercentage;
    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private List<String> preferredSkillsMatched = new ArrayList<>();
    private boolean isApplied;
    private boolean isSaved;

    public JobMatchResultDto() {
    }

    public JobMatchResultDto(JobDto job, int matchPercentage, List<String> matchedSkills,
                             List<String> missingSkills, List<String> preferredSkillsMatched) {
        this.job = job;
        this.matchPercentage = matchPercentage;
        this.matchedSkills = matchedSkills != null ? matchedSkills : new ArrayList<>();
        this.missingSkills = missingSkills != null ? missingSkills : new ArrayList<>();
        this.preferredSkillsMatched = preferredSkillsMatched != null ? preferredSkillsMatched : new ArrayList<>();
    }

    public JobDto getJob() {
        return job;
    }

    public void setJob(JobDto job) {
        this.job = job;
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

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getPreferredSkillsMatched() {
        return preferredSkillsMatched;
    }

    public void setPreferredSkillsMatched(List<String> preferredSkillsMatched) {
        this.preferredSkillsMatched = preferredSkillsMatched;
    }

    public boolean isApplied() {
        return isApplied;
    }

    public void setApplied(boolean applied) {
        isApplied = applied;
    }

    public boolean isSaved() {
        return isSaved;
    }

    public void setSaved(boolean saved) {
        isSaved = saved;
    }
}
