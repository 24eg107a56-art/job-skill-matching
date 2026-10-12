package com.jobskillmatch.repository;

import com.jobskillmatch.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {

    List<CareerRoadmap> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<CareerRoadmap> findByUserIdAndTargetRoleIgnoreCase(Long userId, String targetRole);

    Optional<CareerRoadmap> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
