package com.jobskillmatch.repository;

import com.jobskillmatch.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByNameIgnoreCase(String name);

    List<Skill> findByNameInIgnoreCase(Collection<String> names);

    List<Skill> findByCategoryIgnoreCase(String category);

    List<Skill> findAllByOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT s.category FROM Skill s WHERE s.category IS NOT NULL ORDER BY s.category ASC")
    List<String> findDistinctCategories();
}
