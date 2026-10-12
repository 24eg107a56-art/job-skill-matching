package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.JobDto;
import com.jobskillmatch.exception.UnauthorizedException;
import com.jobskillmatch.security.UserPrincipal;
import com.jobskillmatch.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobController {

    private final JobApplicationService applicationService;

    public SavedJobController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> saveJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId) {
        validateAuthenticated(principal);
        applicationService.saveJob(principal.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job bookmarked successfully", null));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId) {
        validateAuthenticated(principal);
        applicationService.unsaveJob(principal.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job removed from bookmarks", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobDto>>> getSavedJobs(
            @AuthenticationPrincipal UserPrincipal principal) {
        validateAuthenticated(principal);
        List<JobDto> savedJobs = applicationService.getSavedJobs(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Saved jobs retrieved successfully", savedJobs));
    }

    private void validateAuthenticated(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
    }
}
