package com.jobskillmatch.service;

import com.jobskillmatch.dto.RoadmapDto;
import com.jobskillmatch.dto.RoadmapItemDto;
import com.jobskillmatch.entity.CareerRoadmap;
import com.jobskillmatch.entity.RoadmapItem;
import com.jobskillmatch.entity.User;
import com.jobskillmatch.exception.ResourceNotFoundException;
import com.jobskillmatch.exception.UnauthorizedException;
import com.jobskillmatch.repository.CareerRoadmapRepository;
import com.jobskillmatch.repository.RoadmapItemRepository;
import com.jobskillmatch.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private final CareerRoadmapRepository roadmapRepository;
    private final RoadmapItemRepository itemRepository;
    private final UserRepository userRepository;

    private static final Map<String, RoadmapItemTemplate> TEMPLATES = new HashMap<>();

    static {
        TEMPLATES.put("docker", new RoadmapItemTemplate("Docker & Containerization", "2 Weeks", "High", "Intermediate", "Containerize Java and Node apps, create multi-stage Dockerfiles, configure Docker compose for databases.", "https://docs.docker.com/get-started/", "Official Docker Documentation"));
        TEMPLATES.put("aws", new RoadmapItemTemplate("AWS Cloud Infrastructure", "4 Weeks", "High", "Challenging", "Master core AWS services: EC2, S3, RDS, IAM, ECS, and configure VPC networking.", "https://aws.amazon.com/training/", "AWS Skill Builder Official"));
        TEMPLATES.put("microservices", new RoadmapItemTemplate("Microservices Architecture", "3 Weeks", "Medium", "Intermediate", "Implement API Gateway, service discovery, configuration server, and resilience patterns with Resilience4j.", "https://spring.io/guides", "Spring Microservices Guides"));
        TEMPLATES.put("kafka", new RoadmapItemTemplate("Apache Kafka Event Streaming", "3 Weeks", "Medium", "Challenging", "Understand topic partitions, producer/consumer configurations, and stream processing basics.", "https://kafka.apache.org/documentation/", "Apache Kafka Quickstart"));
        TEMPLATES.put("kubernetes", new RoadmapItemTemplate("Kubernetes Orchestration", "4 Weeks", "High", "Challenging", "Deploy workloads using Pods, Deployments, Services, Ingress, and ConfigMaps.", "https://kubernetes.io/docs/tutorials/", "Kubernetes Official Tutorials"));
        TEMPLATES.put("linux", new RoadmapItemTemplate("Linux Fundamentals & Shell Scripting", "1 Week", "Medium", "Beginner", "Learn bash navigation, permissions, process management, and writing automation shell scripts.", "https://ubuntu.com/tutorials", "Ubuntu Linux Fundamentals"));
        TEMPLATES.put("react", new RoadmapItemTemplate("Modern React & State Management", "3 Weeks", "High", "Intermediate", "Component lifecycles, hooks (useState, useEffect, useContext), custom hooks, and React Router.", "https://react.dev/learn", "Official React Documentation"));
        TEMPLATES.put("typescript", new RoadmapItemTemplate("TypeScript for Enterprise", "2 Weeks", "High", "Intermediate", "Strong typing, interfaces, generics, type guards, and configuring tsconfig.json.", "https://www.typescriptlang.org/docs/", "Official TypeScript Handbook"));
        TEMPLATES.put("mysql", new RoadmapItemTemplate("Database Modeling & Indexing", "1.5 Weeks", "High", "Beginner", "Relational database normalization, indexing strategies, foreign keys, and query optimization.", "https://dev.mysql.com/doc/", "MySQL Documentation"));
    }

    public RoadmapService(CareerRoadmapRepository roadmapRepository,
                          RoadmapItemRepository itemRepository,
                          UserRepository userRepository) {
        this.roadmapRepository = roadmapRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RoadmapDto getCandidateRoadmap(Long userId, String targetRole) {
        if (targetRole != null && !targetRole.isBlank()) {
            Optional<CareerRoadmap> existing = roadmapRepository.findByUserIdAndTargetRoleIgnoreCase(userId, targetRole.trim());
            if (existing.isPresent()) {
                return toDto(existing.get());
            }
        }

        Optional<CareerRoadmap> latest = roadmapRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
        if (latest.isPresent()) {
            return toDto(latest.get());
        }

        return generateRoadmap(userId, targetRole != null && !targetRole.isBlank() ? targetRole : "Full Stack Java Developer", Arrays.asList("Docker", "AWS", "Microservices", "Kafka"));
    }

    @Transactional
    public RoadmapDto generateRoadmap(Long userId, String targetRole, List<String> skillsToInclude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String role = (targetRole != null && !targetRole.isBlank()) ? targetRole.trim() : "Full Stack Developer";

        // Remove existing roadmap for role if present
        roadmapRepository.findByUserIdAndTargetRoleIgnoreCase(userId, role)
                .ifPresent(roadmapRepository::delete);

        CareerRoadmap roadmap = new CareerRoadmap(user, role);
        roadmap = roadmapRepository.save(roadmap);

        List<String> skills = (skillsToInclude != null && !skillsToInclude.isEmpty())
                ? skillsToInclude
                : Arrays.asList("Docker", "AWS", "Microservices", "Kafka");

        int order = 1;
        for (String skill : skills) {
            String key = skill.toLowerCase().trim();
            RoadmapItemTemplate template = TEMPLATES.getOrDefault(
                    key,
                    new RoadmapItemTemplate(skill, "2 Weeks", "Medium", "Intermediate", "Core concepts, best practices, and practical project integration.", "https://developer.mozilla.org", "MDN / Free Developer Docs")
            );

            RoadmapItem item = new RoadmapItem(
                    roadmap,
                    template.title,
                    order++,
                    template.duration,
                    template.priority,
                    template.level,
                    template.objectives,
                    template.resourceUrl,
                    template.resourceName
            );
            roadmap.addItem(item);
        }

        CareerRoadmap saved = roadmapRepository.save(roadmap);
        return toDto(saved);
    }

    @Transactional
    public RoadmapItemDto toggleItemCompletion(Long userId, Long itemId) {
        RoadmapItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("RoadmapItem", "id", itemId));

        if (!item.getRoadmap().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this roadmap item.");
        }

        item.setCompleted(!Boolean.TRUE.equals(item.getCompleted()));
        RoadmapItem updated = itemRepository.save(item);

        return toItemDto(updated);
    }

    public RoadmapDto toDto(CareerRoadmap roadmap) {
        RoadmapDto dto = new RoadmapDto();
        dto.setId(roadmap.getId());
        dto.setUserId(roadmap.getUser().getId());
        dto.setTargetRole(roadmap.getTargetRole());
        dto.setCreatedAt(roadmap.getCreatedAt());

        List<RoadmapItemDto> itemDtos = roadmap.getItems().stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

        dto.setItems(itemDtos);
        int total = itemDtos.size();
        int completed = (int) itemDtos.stream().filter(i -> Boolean.TRUE.equals(i.getCompleted())).count();
        int progress = total > 0 ? Math.round(((float) completed / total) * 100) : 0;

        dto.setTotalSteps(total);
        dto.setCompletedSteps(completed);
        dto.setProgressPercentage(progress);

        return dto;
    }

    private RoadmapItemDto toItemDto(RoadmapItem item) {
        RoadmapItemDto dto = new RoadmapItemDto();
        dto.setId(item.getId());
        dto.setSkillName(item.getSkillName());
        dto.setStepOrder(item.getStepOrder());
        dto.setEstimatedDuration(item.getEstimatedDuration());
        dto.setPriority(item.getPriority());
        dto.setLevel(item.getLevel());
        dto.setObjectives(item.getObjectives());
        dto.setResourceUrl(item.getResourceUrl());
        dto.setResourceName(item.getResourceName());
        dto.setCompleted(item.getCompleted());
        return dto;
    }

    private static class RoadmapItemTemplate {
        String title;
        String duration;
        String priority;
        String level;
        String objectives;
        String resourceUrl;
        String resourceName;

        RoadmapItemTemplate(String title, String duration, String priority, String level, String objectives, String resourceUrl, String resourceName) {
            this.title = title;
            this.duration = duration;
            this.priority = priority;
            this.level = level;
            this.objectives = objectives;
            this.resourceUrl = resourceUrl;
            this.resourceName = resourceName;
        }
    }
}
