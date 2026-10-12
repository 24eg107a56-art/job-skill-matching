package com.jobskillmatch.repository;

import com.jobskillmatch.entity.RoadmapItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapItemRepository extends JpaRepository<RoadmapItem, Long> {

    List<RoadmapItem> findByRoadmapIdOrderByStepOrderAsc(Long roadmapId);

    long countByRoadmapIdAndCompletedTrue(Long roadmapId);

    long countByRoadmapId(Long roadmapId);
}
