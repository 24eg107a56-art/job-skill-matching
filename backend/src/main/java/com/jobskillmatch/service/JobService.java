package com.jobskillmatch.service;

import com.jobskillmatch.dto.JobCreateRequest;
import com.jobskillmatch.dto.JobDto;
import com.jobskillmatch.entity.Job;
import com.jobskillmatch.entity.Skill;
import com.jobskillmatch.exception.ResourceNotFoundException;
import com.jobskillmatch.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final SkillService skillService;

    public JobService(JobRepository jobRepository, SkillService skillService) {
        this.jobRepository = jobRepository;
        this.skillService = skillService;
    }

    @Transactional(readOnly = true)
    public List<JobDto> getAllJobs() {
        return jobRepository.findByIsActiveTrueOrderByPostedDateDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobDto getJobById(Long id) {
        Job job = getJobEntity(id);
        return toDto(job);
    }

    @Transactional(readOnly = true)
    public Job getJobEntity(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
    }

    @Transactional(readOnly = true)
    public List<JobDto> searchJobs(String keyword, String location, String employmentType) {
        return jobRepository.searchJobs(keyword, location, employmentType)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobDto createJob(JobCreateRequest request) {
        Job job = new Job();
        mapRequestToEntity(request, job);
        job.setPostedDate(LocalDate.now());
        job.setIsActive(true);
        job.setIsDemo(request.getIsDemo() != null ? request.getIsDemo() : false);

        Job saved = jobRepository.save(job);
        return toDto(saved);
    }

    @Transactional
    public JobDto updateJob(Long id, JobCreateRequest request) {
        Job job = getJobEntity(id);
        mapRequestToEntity(request, job);
        Job saved = jobRepository.save(job);
        return toDto(saved);
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = getJobEntity(id);
        jobRepository.delete(job);
    }

    private void mapRequestToEntity(JobCreateRequest request, Job job) {
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setMinExperience(request.getMinExperience());
        job.setMaxExperience(request.getMaxExperience());
        job.setSalaryRange(request.getSalaryRange());
        job.setDescription(request.getDescription());
        job.setEducationRequirement(request.getEducationRequirement());
        job.setApplicationUrl(request.getApplicationUrl());

        if (request.getRequiredSkills() != null) {
            Set<Skill> required = new HashSet<>();
            for (String s : request.getRequiredSkills()) {
                required.add(skillService.getOrCreateSkill(s, "General"));
            }
            job.setRequiredSkills(required);
        }

        if (request.getPreferredSkills() != null) {
            Set<Skill> preferred = new HashSet<>();
            for (String s : request.getPreferredSkills()) {
                preferred.add(skillService.getOrCreateSkill(s, "General"));
            }
            job.setPreferredSkills(preferred);
        }
    }

    public JobDto toDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setEmploymentType(job.getEmploymentType());
        dto.setMinExperience(job.getMinExperience());
        dto.setMaxExperience(job.getMaxExperience());
        dto.setSalaryRange(job.getSalaryRange());
        dto.setDescription(job.getDescription());
        dto.setEducationRequirement(job.getEducationRequirement());
        dto.setApplicationUrl(job.getApplicationUrl());
        dto.setIsDemo(job.getIsDemo());
        dto.setIsActive(job.getIsActive());
        dto.setPostedDate(job.getPostedDate());

        if (job.getRequiredSkills() != null) {
            dto.setRequiredSkills(job.getRequiredSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toSet()));
        }

        if (job.getPreferredSkills() != null) {
            dto.setPreferredSkills(job.getPreferredSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}
