package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.JobMatchResultDto;
import com.jobskillmatch.dto.SkillGapDto;
import com.jobskillmatch.exception.UnauthorizedException;
import com.jobskillmatch.security.UserPrincipal;
import com.jobskillmatch.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<JobMatchResultDto>>> getRecommendedJobs(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "0") Integer minScore) {
        validateAuthenticated(principal);
        List<JobMatchResultDto> recommendations = matchingService.getRecommendedJobs(principal.getId(), minScore);
        return ResponseEntity.ok(ApiResponse.success("Job recommendations retrieved successfully", recommendations));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<JobMatchResultDto>> getJobMatch(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId) {
        Long userId = principal != null ? principal.getId() : null;
        JobMatchResultDto matchResult = matchingService.matchJob(jobId, userId);
        return ResponseEntity.ok(ApiResponse.success("Job match evaluated successfully", matchResult));
    }

    @GetMapping("/gap/{jobId}")
    public ResponseEntity<ApiResponse<SkillGapDto>> getSkillGap(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId) {
        validateAuthenticated(principal);
        SkillGapDto gapResult = matchingService.getSkillGap(jobId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis evaluated successfully", gapResult));
    }

    private void validateAuthenticated(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
    }
}
