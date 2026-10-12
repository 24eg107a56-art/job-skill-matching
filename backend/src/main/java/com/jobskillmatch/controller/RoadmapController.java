package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.RoadmapDto;
import com.jobskillmatch.dto.RoadmapGenerateRequest;
import com.jobskillmatch.dto.RoadmapItemDto;
import com.jobskillmatch.exception.UnauthorizedException;
import com.jobskillmatch.security.UserPrincipal;
import com.jobskillmatch.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<RoadmapDto>> getRoadmap(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String targetRole) {
        validateAuthenticated(principal);
        RoadmapDto roadmap = roadmapService.getCandidateRoadmap(principal.getId(), targetRole);
        return ResponseEntity.ok(ApiResponse.success("Career roadmap retrieved successfully", roadmap));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<RoadmapDto>> generateRoadmap(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody RoadmapGenerateRequest request) {
        validateAuthenticated(principal);
        RoadmapDto roadmap = roadmapService.generateRoadmap(
                principal.getId(),
                request != null ? request.getTargetRole() : null,
                request != null ? request.getSkills() : null
        );
        return ResponseEntity.ok(ApiResponse.success("Career roadmap generated successfully", roadmap));
    }

    @PatchMapping("/items/{itemId}/toggle")
    public ResponseEntity<ApiResponse<RoadmapItemDto>> toggleItemCompletion(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long itemId) {
        validateAuthenticated(principal);
        RoadmapItemDto updated = roadmapService.toggleItemCompletion(principal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.success("Roadmap step updated successfully", updated));
    }

    private void validateAuthenticated(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
    }
}
