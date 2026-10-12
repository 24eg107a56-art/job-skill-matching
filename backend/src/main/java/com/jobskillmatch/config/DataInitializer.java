package com.jobskillmatch.config;

import com.jobskillmatch.entity.*;
import com.jobskillmatch.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final CareerRoadmapRepository roadmapRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CandidateProfileRepository profileRepository,
                           SkillRepository skillRepository,
                           CandidateSkillRepository candidateSkillRepository,
                           JobRepository jobRepository,
                           JobApplicationRepository applicationRepository,
                           CareerRoadmapRepository roadmapRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.candidateSkillRepository = candidateSkillRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.roadmapRepository = roadmapRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting JobSkillMatch DataInitializer check...");

        // 1. Seed Admin User
        if (!userRepository.existsByEmail("admin@jobskillmatch.com")) {
            User admin = new User(
                    "Administrator",
                    "admin@jobskillmatch.com",
                    passwordEncoder.encode("admin123"),
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
            log.info("Created default Admin user: admin@jobskillmatch.com / admin123");
        }

        // 2. Seed Demo Candidate User & Profile
        if (!userRepository.existsByEmail("arun.candidate@example.com")) {
            User candidate = new User(
                    "Arun Kumar",
                    "arun.candidate@example.com",
                    passwordEncoder.encode("candidate123"),
                    Role.ROLE_CANDIDATE
            );
            candidate = userRepository.save(candidate);

            CandidateProfile profile = new CandidateProfile(candidate);
            profile.setPhone("+91 98765 43210");
            profile.setDegree("B.Tech in Computer Science & Engineering");
            profile.setUniversity("Anna University, Chennai");
            profile.setGraduationYear(2024);
            profile.setYearsOfExperience(1);
            profile.setPreferredRole("Full Stack Java Developer");
            profile.setPreferredLocation("Bengaluru / Remote");
            profile.setEmploymentPreference("Full-time");
            profile.setWorkExperience("1 year Junior Software Engineer at TechVision Labs working on Spring Boot microservices, REST APIs, and React dashboards.");
            profile.setCertifications("Oracle Certified Associate Java SE 8 Programmer, AWS Certified Cloud Practitioner");

            // Attach core verified candidate skills
            List<String> coreSkills = Arrays.asList("Java", "Spring Boot", "React", "MySQL", "Git", "REST APIs");
            for (String skillName : coreSkills) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                        .orElseGet(() -> skillRepository.save(new Skill(skillName, "Software Development", null)));
                CandidateSkill cs = new CandidateSkill(profile, skill, "Intermediate");
                cs.setVerified(true);
                profile.getCandidateSkills().add(cs);
            }

            profile.calculateProfileCompletion();
            profile = profileRepository.save(profile);
            log.info("Created default Candidate user: arun.candidate@example.com with profile and {} skills", profile.getCandidateSkills().size());

            // Create Career Roadmap
            CareerRoadmap roadmap = new CareerRoadmap(candidate, "Full Stack Java Developer");
            roadmap.addItem(new RoadmapItem(roadmap, "Docker & Containerization", 1, "2 Weeks", "High", "Intermediate",
                    "Containerize Java and React apps, create multi-stage Dockerfiles.", "https://docs.docker.com/get-started/", "Official Docker Documentation"));
            roadmap.addItem(new RoadmapItem(roadmap, "AWS Cloud Fundamentals", 2, "4 Weeks", "High", "Challenging",
                    "Master core AWS services: EC2, S3, RDS, IAM, and ECS.", "https://aws.amazon.com/training/", "AWS Skill Builder Official"));
            roadmap.addItem(new RoadmapItem(roadmap, "Microservices Architecture", 3, "3 Weeks", "Medium", "Intermediate",
                    "Implement API Gateway, service discovery, and circuit breakers with Resilience4j.", "https://spring.io/guides", "Spring Microservices Guides"));
            roadmap.addItem(new RoadmapItem(roadmap, "Apache Kafka Event Streaming", 4, "3 Weeks", "Medium", "Challenging",
                    "Understand topic partitions, producer/consumer configurations, and event streams.", "https://kafka.apache.org/documentation/", "Apache Kafka Quickstart"));
            roadmapRepository.save(roadmap);

            // Create initial application for demo
            List<Job> jobs = jobRepository.findAll();
            if (!jobs.isEmpty()) {
                Job targetJob = jobs.get(0);
                JobApplication app = new JobApplication(candidate, targetJob, 85, "I am excited to apply for this Full Stack role at " + targetJob.getCompany() + ". My background matches your tech stack.");
                app.setStatus("Under Review");
                app.setAppliedDate(LocalDate.now().minusDays(3));
                applicationRepository.save(app);
            }
        }

        log.info("JobSkillMatch DataInitializer completed successfully.");
    }
}
