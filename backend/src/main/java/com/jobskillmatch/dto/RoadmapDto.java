package com.jobskillmatch.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RoadmapDto {

    private Long id;
    private Long userId;
    private String targetRole;
    private int totalSteps;
    private int completedSteps;
    private int progressPercentage;
    private LocalDateTime createdAt;
    private List<RoadmapItemDto> items = new ArrayList<>();

    public RoadmapDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public int getTotalSteps() {
        return totalSteps;
    }

    public void setTotalSteps(int totalSteps) {
        this.totalSteps = totalSteps;
    }

    public int getCompletedSteps() {
        return completedSteps;
    }

    public void setCompletedSteps(int completedSteps) {
        this.completedSteps = completedSteps;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<RoadmapItemDto> getItems() {
        return items;
    }

    public void setItems(List<RoadmapItemDto> items) {
        this.items = items;
    }
}
