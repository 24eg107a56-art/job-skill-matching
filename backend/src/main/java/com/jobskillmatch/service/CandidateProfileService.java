package com.jobskillmatch.service;

import com.jobskillmatch.dto.CandidateProfileDto;
import com.jobskillmatch.dto.CandidateProfileUpdateRequest;
import com.jobskillmatch.dto.CandidateSkillDto;
import com.jobskillmatch.entity.CandidateProfile;
import com.jobskillmatch.entity.CandidateSkill;
import com.jobskillmatch.entity.Skill;
import com.jobskillmatch.entity.User;
import com.jobskillmatch.exception.ResourceNotFoundException;
import com.jobskillmatch.repository.CandidateProfileRepository;
import com.jobskillmatch.repository.CandidateSkillRepository;
import com.jobskillmatch.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;

    public CandidateProfileService(CandidateProfileRepository profileRepository,
                                   CandidateSkillRepository candidateSkillRepository,
                                   UserRepository userRepository,
                                   SkillService skillService) {
        this.profileRepository = profileRepository;
        this.candidateSkillRepository = candidateSkillRepository;
        this.userRepository = userRepository;
        this.skillService = skillService;
    }

    @Transactional
    public CandidateProfileDto getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> profileRepository.save(new CandidateProfile(user)));

        return toDto(profile);
    }

    @Transactional
    public CandidateProfile getOrCreateProfileEntity(User user) {
        return profileRepository.findByUserId(user.getId())
                .orElseGet(() -> profileRepository.save(new CandidateProfile(user)));
    }

    @Transactional
    public CandidateProfileDto updateProfile(Long userId, CandidateProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
            userRepository.save(user);
        }

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new CandidateProfile(user));

        profile.setPhone(request.getPhone());
        profile.setDegree(request.getDegree());
        profile.setUniversity(request.getUniversity());
        profile.setGraduationYear(request.getGraduationYear());
        profile.setYearsOfExperience(request.getYearsOfExperience());
        profile.setPreferredRole(request.getPreferredRole());
        profile.setPreferredLocation(request.getPreferredLocation());
        profile.setEmploymentPreference(request.getEmploymentPreference());
        profile.setWorkExperience(request.getWorkExperience());
        profile.setCertifications(request.getCertifications());

        // Update skills if provided
        if (request.getSkills() != null) {
            profile.getCandidateSkills().clear();
            for (CandidateProfileUpdateRequest.SkillProficiencyRequest item : request.getSkills()) {
                if (item.getSkillName() != null && !item.getSkillName().isBlank()) {
                    Skill skill = skillService.getOrCreateSkill(item.getSkillName().trim(), "General");
                    CandidateSkill cs = new CandidateSkill(profile, skill, item.getProficiency());
                    profile.getCandidateSkills().add(cs);
                }
            }
        }

        profile.calculateProfileCompletion();
        CandidateProfile saved = profileRepository.save(profile);
        return toDto(saved);
    }

    @Transactional
    public CandidateProfileDto addSkill(Long userId, String skillName, String proficiency) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile for user id " + userId));

        Skill skill = skillService.getOrCreateSkill(skillName.trim(), "General");

        boolean exists = profile.getCandidateSkills().stream()
                .anyMatch(cs -> cs.getSkill().getId().equals(skill.getId()));

        if (!exists) {
            CandidateSkill cs = new CandidateSkill(profile, skill, proficiency != null ? proficiency : "Intermediate");
            profile.getCandidateSkills().add(cs);
            profile.calculateProfileCompletion();
            profileRepository.save(profile);
        }

        return toDto(profile);
    }

    @Transactional
    public CandidateProfileDto removeSkill(Long userId, Long skillId) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile for user id " + userId));

        profile.getCandidateSkills().removeIf(cs -> cs.getSkill().getId().equals(skillId));
        profile.calculateProfileCompletion();
        profileRepository.save(profile);

        return toDto(profile);
    }

    public CandidateProfileDto toDto(CandidateProfile profile) {
        CandidateProfileDto dto = new CandidateProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getPhone());
        dto.setDegree(profile.getDegree());
        dto.setUniversity(profile.getUniversity());
        dto.setGraduationYear(profile.getGraduationYear());
        dto.setYearsOfExperience(profile.getYearsOfExperience());
        dto.setPreferredRole(profile.getPreferredRole());
        dto.setPreferredLocation(profile.getPreferredLocation());
        dto.setEmploymentPreference(profile.getEmploymentPreference());
        dto.setWorkExperience(profile.getWorkExperience());
        dto.setCertifications(profile.getCertifications());
        dto.setResumeText(profile.getResumeText());
        dto.setProfileCompletion(profile.getProfileCompletion());

        List<CandidateSkillDto> skillDtos = profile.getCandidateSkills().stream()
                .map(cs -> new CandidateSkillDto(
                        cs.getId(),
                        cs.getSkill().getId(),
                        cs.getSkill().getName(),
                        cs.getSkill().getCategory(),
                        cs.getProficiency(),
                        cs.getVerified()
                ))
                .collect(Collectors.toList());
        dto.setSkills(skillDtos);

        return dto;
    }
}
