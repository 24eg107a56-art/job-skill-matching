package com.jobskillmatch.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type", length = 50)
    private String fileType;

    @Column(name = "file_size", length = 50)
    private String fileSize;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "parsed_text", columnDefinition = "LONGTEXT")
    private String parsedText;

    @Column(name = "parsed_skills", columnDefinition = "TEXT")
    private String parsedSkills;

    @Column(name = "parsed_education", columnDefinition = "TEXT")
    private String parsedEducation;

    @Column(name = "parsed_experience", columnDefinition = "TEXT")
    private String parsedExperience;

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    public Resume() {
    }

    public Resume(User user, String fileName, String fileType, String fileSize, String filePath) {
        this.user = user;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
    }

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getParsedText() {
        return parsedText;
    }

    public void setParsedText(String parsedText) {
        this.parsedText = parsedText;
    }

    public String getParsedSkills() {
        return parsedSkills;
    }

    public void setParsedSkills(String parsedSkills) {
        this.parsedSkills = parsedSkills;
    }

    public String getParsedEducation() {
        return parsedEducation;
    }

    public void setParsedEducation(String parsedEducation) {
        this.parsedEducation = parsedEducation;
    }

    public String getParsedExperience() {
        return parsedExperience;
    }

    public void setParsedExperience(String parsedExperience) {
        this.parsedExperience = parsedExperience;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
