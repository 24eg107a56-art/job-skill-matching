package com.jobskillmatch.repository;

import com.jobskillmatch.entity.CandidateSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, Long> {

    List<CandidateSkill> findByProfileId(Long profileId);

    List<CandidateSkill> findByProfileUserId(Long userId);

    Optional<CandidateSkill> findByProfileIdAndSkillId(Long profileId, Long skillId);

    boolean existsByProfileIdAndSkillId(Long profileId, Long skillId);

    void deleteByProfileId(Long profileId);

    void deleteByProfileIdAndSkillId(Long profileId, Long skillId);
}
