package com.jobskillmatch.repository;

import com.jobskillmatch.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByIsActiveTrueOrderByPostedDateDesc();

    List<Job> findByIsActiveTrueAndTitleContainingIgnoreCase(String title);

    @Query("SELECT j FROM Job j WHERE j.isActive = true AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:employmentType IS NULL OR :employmentType = '' OR LOWER(j.employmentType) = LOWER(:employmentType)) " +
           "ORDER BY j.postedDate DESC")
    List<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("location") String location,
                         @Param("employmentType") String employmentType);

    long countByIsActiveTrue();
}
