package com.jobskillmatch.dto;

import java.util.ArrayList;
import java.util.List;

public class ResumeAnalysisDto {

    private Long id;
    private String fileName;
    private String fileSize;
    private String parsedDate;
    private List<String> extractedSkills = new ArrayList<>();
    private List<String> unrecognizedSkills = new ArrayList<>();
    private String extractedEducation;
    private String extractedExperience;
    private int score;
    private String rawTextSnippet;

    public ResumeAnalysisDto() {
    }

    public ResumeAnalysisDto(Long id, String fileName, String fileSize, String parsedDate,
                             List<String> extractedSkills, List<String> unrecognizedSkills,
                             String extractedEducation, String extractedExperience,
                             int score, String rawTextSnippet) {
        this.id = id;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.parsedDate = parsedDate;
        this.extractedSkills = extractedSkills != null ? extractedSkills : new ArrayList<>();
        this.unrecognizedSkills = unrecognizedSkills != null ? unrecognizedSkills : new ArrayList<>();
        this.extractedEducation = extractedEducation;
        this.extractedExperience = extractedExperience;
        this.score = score;
        this.rawTextSnippet = rawTextSnippet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getParsedDate() {
        return parsedDate;
    }

    public void setParsedDate(String parsedDate) {
        this.parsedDate = parsedDate;
    }

    public List<String> getExtractedSkills() {
        return extractedSkills;
    }

    public void setExtractedSkills(List<String> extractedSkills) {
        this.extractedSkills = extractedSkills;
    }

    public List<String> getUnrecognizedSkills() {
        return unrecognizedSkills;
    }

    public void setUnrecognizedSkills(List<String> unrecognizedSkills) {
        this.unrecognizedSkills = unrecognizedSkills;
    }

    public String getExtractedEducation() {
        return extractedEducation;
    }

    public void setExtractedEducation(String extractedEducation) {
        this.extractedEducation = extractedEducation;
    }

    public String getExtractedExperience() {
        return extractedExperience;
    }

    public void setExtractedExperience(String extractedExperience) {
        this.extractedExperience = extractedExperience;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getRawTextSnippet() {
        return rawTextSnippet;
    }

    public void setRawTextSnippet(String rawTextSnippet) {
        this.rawTextSnippet = rawTextSnippet;
    }
}
