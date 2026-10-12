package com.jobskillmatch.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmap_items")
public class RoadmapItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private CareerRoadmap roadmap;

    @Column(name = "skill_name", nullable = false, length = 150)
    private String skillName;

    @Column(name = "step_order")
    private Integer stepOrder = 1;

    @Column(name = "estimated_duration", length = 50)
    private String estimatedDuration;

    @Column(length = 50)
    private String priority = "Medium";

    @Column(length = 50)
    private String level = "Intermediate";

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(name = "resource_url", length = 500)
    private String resourceUrl;

    @Column(name = "resource_name", length = 200)
    private String resourceName;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RoadmapItem() {
    }

    public RoadmapItem(CareerRoadmap roadmap, String skillName, Integer stepOrder, String estimatedDuration,
                       String priority, String level, String objectives, String resourceUrl, String resourceName) {
        this.roadmap = roadmap;
        this.skillName = skillName;
        this.stepOrder = stepOrder != null ? stepOrder : 1;
        this.estimatedDuration = estimatedDuration;
        this.priority = priority != null ? priority : "Medium";
        this.level = level != null ? level : "Intermediate";
        this.objectives = objectives;
        this.resourceUrl = resourceUrl;
        this.resourceName = resourceName;
        this.completed = false;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.completed == null) {
            this.completed = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CareerRoadmap getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(CareerRoadmap roadmap) {
        this.roadmap = roadmap;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getStepOrder() {
        return stepOrder;
    }

    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getObjectives() {
        return objectives;
    }

    public void setObjectives(String objectives) {
        this.objectives = objectives;
    }

    public String getResourceUrl() {
        return resourceUrl;
    }

    public void setResourceUrl(String resourceUrl) {
        this.resourceUrl = resourceUrl;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
