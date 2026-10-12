package com.jobskillmatch.service;

import com.jobskillmatch.dto.JobDto;
import com.jobskillmatch.dto.JobMatchResultDto;
import com.jobskillmatch.dto.SkillGapDto;
import com.jobskillmatch.entity.*;
import com.jobskillmatch.exception.ResourceNotFoundException;
import com.jobskillmatch.repository.CandidateProfileRepository;
import com.jobskillmatch.repository.JobApplicationRepository;
import com.jobskillmatch.repository.JobRepository;
import com.jobskillmatch.repository.SavedJobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final JobRepository jobRepository;
    private final CandidateProfileRepository profileRepository;
    private final JobApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobService jobService;

    // Static curated learning resources dictionary for popular technologies
    private static final Map<String, SkillMetadata> SKILL_METADATA = new HashMap<>();

    static {
        SKILL_METADATA.put("docker", new SkillMetadata("High", "Moderate", "2 Weeks", "https://docs.docker.com/get-started/", "Official Docker Documentation"));
        SKILL_METADATA.put("aws", new SkillMetadata("High", "Challenging", "4 Weeks", "https://aws.amazon.com/training/", "AWS Skill Builder Official"));
        SKILL_METADATA.put("microservices", new SkillMetadata("Medium", "Moderate", "3 Weeks", "https://spring.io/guides", "Spring Microservices Guides"));
        SKILL_METADATA.put("kafka", new SkillMetadata("Medium", "Challenging", "3 Weeks", "https://kafka.apache.org/documentation/", "Apache Kafka Quickstart"));
        SKILL_METADATA.put("kubernetes", new SkillMetadata("High", "Challenging", "4 Weeks", "https://kubernetes.io/docs/tutorials/", "Kubernetes Official Tutorials"));
        SKILL_METADATA.put("linux", new SkillMetadata("Medium", "Easy", "1 Week", "https://ubuntu.com/tutorials", "Ubuntu Linux Fundamentals"));
        SKILL_METADATA.put("fastapi", new SkillMetadata("Medium", "Easy", "1.5 Weeks", "https://fastapi.tiangolo.com/tutorial/", "FastAPI Interactive Tutorial"));
        SKILL_METADATA.put("tensorflow", new SkillMetadata("High", "Challenging", "5 Weeks", "https://www.tensorflow.org/tutorials", "TensorFlow Core Tutorials"));
        SKILL_METADATA.put("machine learning", new SkillMetadata("High", "Challenging", "6 Weeks", "https://developers.google.com/machine-learning/crash-course", "Google Machine Learning Crash Course"));
        SKILL_METADATA.put("react", new SkillMetadata("High", "Moderate", "3 Weeks", "https://react.dev/learn", "Official React Documentation"));
        SKILL_METADATA.put("java", new SkillMetadata("High", "Moderate", "4 Weeks", "https://dev.java/learn/", "Official Dev.Java Tutorials"));
        SKILL_METADATA.put("spring boot", new SkillMetadata("High", "Moderate", "3 Weeks", "https://spring.io/guides", "Spring Boot Guides"));
        SKILL_METADATA.put("python", new SkillMetadata("High", "Easy", "2 Weeks", "https://docs.python.org/3/tutorial/", "Official Python Tutorial"));
        SKILL_METADATA.put("mysql", new SkillMetadata("High", "Easy", "1.5 Weeks", "https://dev.mysql.com/doc/", "MySQL Documentation"));
        SKILL_METADATA.put("typescript", new SkillMetadata("High", "Moderate", "2 Weeks", "https://www.typescriptlang.org/docs/", "Official TypeScript Handbook"));
        SKILL_METADATA.put("git", new SkillMetadata("High", "Easy", "1 Week", "https://git-scm.com/doc", "Git Official Documentation"));
    }

    public MatchingService(JobRepository jobRepository,
                           CandidateProfileRepository profileRepository,
                           JobApplicationRepository applicationRepository,
                           SavedJobRepository savedJobRepository,
                           JobService jobService) {
        this.jobRepository = jobRepository;
        this.profileRepository = profileRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.jobService = jobService;
    }

    @Transactional(readOnly = true)
    public List<JobMatchResultDto> getRecommendedJobs(Long userId, Integer minScoreThreshold) {
        Set<String> candidateSkills = getCandidateSkillNames(userId);
        int threshold = minScoreThreshold != null ? minScoreThreshold : 0;

        List<Job> allJobs = jobRepository.findByIsActiveTrueOrderByPostedDateDesc();

        return allJobs.stream()
                .map(job -> matchCandidateWithJob(job, candidateSkills, userId))
                .filter(res -> res.getMatchPercentage() >= threshold)
                .sorted((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobMatchResultDto matchJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        Set<String> candidateSkills = userId != null ? getCandidateSkillNames(userId) : Collections.emptySet();
        return matchCandidateWithJob(job, candidateSkills, userId);
    }

    @Transactional(readOnly = true)
    public SkillGapDto getSkillGap(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        Set<String> candidateSkills = userId != null ? getCandidateSkillNames(userId) : Collections.emptySet();
        JobMatchResultDto match = matchCandidateWithJob(job, candidateSkills, userId);

        SkillGapDto dto = new SkillGapDto();
        dto.setJobId(job.getId());
        dto.setTargetRole(job.getTitle());
        dto.setCompany(job.getCompany());
        dto.setMatchPercentage(match.getMatchPercentage());
        dto.setMatchedSkills(match.getMatchedSkills());

        List<SkillGapDto.SkillGapItemDto> missingItems = new ArrayList<>();
        for (String skill : match.getMissingSkills()) {
            SkillMetadata meta = SKILL_METADATA.getOrDefault(
                    skill.toLowerCase().trim(),
                    new SkillMetadata("Medium", "Moderate", "2 Weeks", "https://developer.mozilla.org", "MDN / Free Developer Resources")
            );
            missingItems.add(new SkillGapDto.SkillGapItemDto(
                    skill, meta.priority, meta.difficulty, meta.duration, meta.resource, meta.resourceName
            ));
        }

        dto.setMissingSkills(missingItems);
        return dto;
    }

    private JobMatchResultDto matchCandidateWithJob(Job job, Set<String> candidateSkills, Long userId) {
        Set<String> candidateSkillsLower = candidateSkills.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        List<String> requiredNames = job.getRequiredSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toList());

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String req : requiredNames) {
            if (candidateSkillsLower.contains(req.toLowerCase().trim())) {
                matchedSkills.add(req);
            } else {
                missingSkills.add(req);
            }
        }

        List<String> preferredMatched = new ArrayList<>();
        if (job.getPreferredSkills() != null) {
            for (Skill pref : job.getPreferredSkills()) {
                if (candidateSkillsLower.contains(pref.getName().toLowerCase().trim())) {
                    preferredMatched.add(pref.getName());
                }
            }
        }

        int totalRequired = requiredNames.size();
        int matchPercentage = totalRequired > 0
                ? Math.round(((float) matchedSkills.size() / totalRequired) * 100)
                : 0;

        JobDto jobDto = jobService.toDto(job);
        JobMatchResultDto result = new JobMatchResultDto(jobDto, matchPercentage, matchedSkills, missingSkills, preferredMatched);

        if (userId != null) {
            result.setApplied(applicationRepository.existsByUserIdAndJobId(userId, job.getId()));
            result.setSaved(savedJobRepository.existsByUserIdAndJobId(userId, job.getId()));
        }

        return result;
    }

    private Set<String> getCandidateSkillNames(Long userId) {
        return profileRepository.findByUserId(userId)
                .map(profile -> profile.getCandidateSkills().stream()
                        .map(cs -> cs.getSkill().getName())
                        .collect(Collectors.toSet()))
                .orElse(Collections.emptySet());
    }

    private static class SkillMetadata {
        String priority;
        String difficulty;
        String duration;
        String resource;
        String resourceName;

        SkillMetadata(String priority, String difficulty, String duration, String resource, String resourceName) {
            this.priority = priority;
            this.difficulty = difficulty;
            this.duration = duration;
            this.resource = resource;
            this.resourceName = resourceName;
        }
    }
}
