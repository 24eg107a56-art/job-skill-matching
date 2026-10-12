package com.jobskillmatch.service;

import com.jobskillmatch.dto.SkillDto;
import com.jobskillmatch.entity.Skill;
import com.jobskillmatch.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SkillDto> getSkillsByCategory(String category) {
        return skillRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return skillRepository.findDistinctCategories();
    }

    @Transactional
    public Skill getOrCreateSkill(String name, String category) {
        String trimmed = name.trim();
        return skillRepository.findByNameIgnoreCase(trimmed)
                .orElseGet(() -> skillRepository.save(new Skill(trimmed, category != null ? category : "General", null)));
    }

    private SkillDto toDto(Skill skill) {
        return new SkillDto(skill.getId(), skill.getName(), skill.getCategory(), skill.getDescription());
    }
}
