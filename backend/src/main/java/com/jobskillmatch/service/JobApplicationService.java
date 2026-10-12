package com.jobskillmatch.service;

import com.jobskillmatch.dto.JobApplicationDto;
import com.jobskillmatch.dto.JobApplicationRequest;
import com.jobskillmatch.dto.JobDto;
import com.jobskillmatch.dto.JobMatchResultDto;
import com.jobskillmatch.entity.Job;
import com.jobskillmatch.entity.JobApplication;
import com.jobskillmatch.entity.SavedJob;
import com.jobskillmatch.entity.User;
import com.jobskillmatch.exception.BadRequestException;
import com.jobskillmatch.exception.ResourceNotFoundException;
import com.jobskillmatch.repository.JobApplicationRepository;
import com.jobskillmatch.repository.JobRepository;
import com.jobskillmatch.repository.SavedJobRepository;
import com.jobskillmatch.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;
    private final JobService jobService;

    public JobApplicationService(JobApplicationRepository applicationRepository,
                                 SavedJobRepository savedJobRepository,
                                 JobRepository jobRepository,
                                 UserRepository userRepository,
                                 MatchingService matchingService,
                                 JobService jobService) {
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
        this.jobService = jobService;
    }

    @Transactional
    public JobApplicationDto applyForJob(Long userId, JobApplicationRequest request) {
        if (applicationRepository.existsByUserIdAndJobId(userId, request.getJobId())) {
            throw new BadRequestException("You have already submitted an application for this position.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        JobMatchResultDto matchResult = matchingService.matchJob(job.getId(), userId);
        int matchScore = matchResult.getMatchPercentage();

        JobApplication application = new JobApplication(user, job, matchScore, request.getCoverNote());
        JobApplication saved = applicationRepository.save(application);

        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDto> getCandidateApplications(Long userId) {
        return applicationRepository.findByUserIdOrderByAppliedDateDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDto> getAllApplications() {
        return applicationRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationDto updateApplicationStatus(Long applicationId, String newStatus) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", applicationId));

        application.setStatus(newStatus);
        JobApplication updated = applicationRepository.save(application);
        return toDto(updated);
    }

    @Transactional
    public void saveJob(Long userId, Long jobId) {
        if (savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        savedJobRepository.save(new SavedJob(user, job));
    }

    @Transactional
    public void unsaveJob(Long userId, Long jobId) {
        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
    }

    @Transactional(readOnly = true)
    public List<JobDto> getSavedJobs(Long userId) {
        return savedJobRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(savedJob -> jobService.toDto(savedJob.getJob()))
                .collect(Collectors.toList());
    }

    private JobApplicationDto toDto(JobApplication app) {
        JobApplicationDto dto = new JobApplicationDto();
        dto.setId(app.getId());
        dto.setJobId(app.getJob().getId());
        dto.setJobTitle(app.getJob().getTitle());
        dto.setCompany(app.getJob().getCompany());
        dto.setLocation(app.getJob().getLocation());
        dto.setUserId(app.getUser().getId());
        dto.setApplicantName(app.getUser().getName());
        dto.setApplicantEmail(app.getUser().getEmail());
        dto.setAppliedDate(app.getAppliedDate());
        dto.setStatus(app.getStatus());
        dto.setCoverNote(app.getCoverNote());
        dto.setMatchScore(app.getMatchScore());
        return dto;
    }
}
