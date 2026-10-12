package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.SkillDto;
import com.jobskillmatch.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillDto>>> getSkills(@RequestParam(required = false) String category) {
        List<SkillDto> skills;
        if (category != null && !category.isBlank()) {
            skills = skillService.getSkillsByCategory(category.trim());
        } else {
            skills = skillService.getAllSkills();
        }
        return ResponseEntity.ok(ApiResponse.success("Skills retrieved successfully", skills));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = skillService.getCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }
}
