package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.ResumeAnalysisDto;
import com.jobskillmatch.exception.UnauthorizedException;
import com.jobskillmatch.security.UserPrincipal;
import com.jobskillmatch.service.ResumeParserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeParserService resumeParserService;

    public ResumeController(ResumeParserService resumeParserService) {
        this.resumeParserService = resumeParserService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeAnalysisDto>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : null;
        ResumeAnalysisDto analysis = resumeParserService.parseAndSaveResume(file, userId);
        return ResponseEntity.ok(ApiResponse.success("Resume parsed and analyzed successfully", analysis));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ResumeAnalysisDto>>> getMyResumes(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        List<ResumeAnalysisDto> resumes = resumeParserService.getCandidateResumes(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Candidate resumes retrieved", resumes));
    }
}
