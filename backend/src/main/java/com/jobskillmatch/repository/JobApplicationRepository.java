package com.jobskillmatch.repository;

import com.jobskillmatch.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserIdOrderByAppliedDateDesc(Long userId);

    List<JobApplication> findByJobIdOrderByAppliedDateDesc(Long jobId);

    Optional<JobApplication> findByUserIdAndJobId(Long userId, Long jobId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    long countByUserId(Long userId);

    long countByStatus(String status);
}
