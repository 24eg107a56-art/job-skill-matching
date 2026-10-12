package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.ApplicationStatusUpdateRequest;
import com.jobskillmatch.dto.JobApplicationDto;
import com.jobskillmatch.entity.CandidateProfile;
import com.jobskillmatch.entity.Role;
import com.jobskillmatch.entity.User;
import com.jobskillmatch.repository.*;
import com.jobskillmatch.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Transactional(readOnly = true)
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final SkillRepository skillRepository;
    private final ResumeRepository resumeRepository;
    private final CandidateProfileRepository profileRepository;
    private final JobApplicationService applicationService;

    public AdminController(UserRepository userRepository,
                           JobRepository jobRepository,
                           JobApplicationRepository applicationRepository,
                           SkillRepository skillRepository,
                           ResumeRepository resumeRepository,
                           CandidateProfileRepository profileRepository,
                           JobApplicationService applicationService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.skillRepository = skillRepository;
        this.resumeRepository = resumeRepository;
        this.profileRepository = profileRepository;
        this.applicationService = applicationService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        long totalCandidates = userRepository.countByRole(Role.ROLE_CANDIDATE);
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long totalSkills = skillRepository.count();
        long totalResumes = resumeRepository.count();

        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        statusDistribution.put("Applied", applicationRepository.countByStatus("Applied"));
        statusDistribution.put("Reviewing", applicationRepository.countByStatus("Reviewing"));
        statusDistribution.put("Shortlisted", applicationRepository.countByStatus("Shortlisted"));
        statusDistribution.put("Interview Scheduled", applicationRepository.countByStatus("Interview Scheduled"));
        statusDistribution.put("Accepted", applicationRepository.countByStatus("Accepted"));
        statusDistribution.put("Rejected", applicationRepository.countByStatus("Rejected"));

        List<JobApplicationDto> allApps = applicationService.getAllApplications();
        List<JobApplicationDto> recentApps = allApps.stream()
                .limit(6)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCandidates", totalCandidates);
        stats.put("totalJobs", totalJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("totalSkills", totalSkills);
        stats.put("totalResumes", totalResumes);
        stats.put("applicationsByStatus", statusDistribution);
        stats.put("recentApplications", recentApps);

        return ResponseEntity.ok(ApiResponse.success("Admin analytics fetched successfully", stats));
    }

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCandidates() {
        List<User> candidateUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_CANDIDATE)
                .collect(Collectors.toList());

        List<Map<String, Object>> candidateList = candidateUsers.stream()
                .map(user -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", user.getId());
                    map.put("name", user.getName());
                    map.put("email", user.getEmail());
                    map.put("registeredDate", user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate().toString() : "2026-10-01");

                    Optional<CandidateProfile> profileOpt = profileRepository.findByUserId(user.getId());
                    if (profileOpt.isPresent()) {
                        CandidateProfile p = profileOpt.get();
                        map.put("degree", p.getDegree() != null ? p.getDegree() : "N/A");
                        map.put("university", p.getUniversity() != null ? p.getUniversity() : "N/A");
                        map.put("preferredRole", p.getPreferredRole() != null ? p.getPreferredRole() : "Software Engineer");
                        map.put("skillsCount", p.getCandidateSkills() != null ? p.getCandidateSkills().size() : 0);
                        map.put("profileCompletion", p.getProfileCompletion() != null ? p.getProfileCompletion() : 0);
                    } else {
                        map.put("degree", "N/A");
                        map.put("university", "N/A");
                        map.put("preferredRole", "Software Engineer");
                        map.put("skillsCount", 0);
                        map.put("profileCompletion", 0);
                    }
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Candidates list retrieved successfully", candidateList));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<JobApplicationDto>>> getAllApplications() {
        List<JobApplicationDto> apps = applicationService.getAllApplications();
        return ResponseEntity.ok(ApiResponse.success("All applications retrieved successfully", apps));
    }

    @Transactional
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApiResponse<JobApplicationDto>> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody ApplicationStatusUpdateRequest request) {
        JobApplicationDto updated = applicationService.updateApplicationStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Application status updated to " + request.getStatus(), updated));
    }
}
