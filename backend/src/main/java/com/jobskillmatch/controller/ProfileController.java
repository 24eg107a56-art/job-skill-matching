package com.jobskillmatch.controller;

import com.jobskillmatch.dto.AddSkillRequest;
import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.CandidateProfileDto;
import com.jobskillmatch.dto.CandidateProfileUpdateRequest;
import com.jobskillmatch.exception.UnauthorizedException;
import com.jobskillmatch.security.UserPrincipal;
import com.jobskillmatch.service.CandidateProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final CandidateProfileService profileService;

    public ProfileController(CandidateProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CandidateProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        validateAuthenticated(principal);
        CandidateProfileDto profile = profileService.getProfileByUserId(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<CandidateProfileDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CandidateProfileUpdateRequest request) {
        validateAuthenticated(principal);
        CandidateProfileDto updated = profileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<CandidateProfileDto>> addSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddSkillRequest request) {
        validateAuthenticated(principal);
        CandidateProfileDto updated = profileService.addSkill(principal.getId(), request.getSkillName(), request.getProficiency());
        return ResponseEntity.ok(ApiResponse.success("Skill added successfully", updated));
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<ApiResponse<CandidateProfileDto>> removeSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long skillId) {
        validateAuthenticated(principal);
        CandidateProfileDto updated = profileService.removeSkill(principal.getId(), skillId);
        return ResponseEntity.ok(ApiResponse.success("Skill removed successfully", updated));
    }

    private void validateAuthenticated(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
    }
}
