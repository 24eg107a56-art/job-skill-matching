package com.jobskillmatch.dto;

public class JobApplicationRequest {

    private Long jobId;
    private String coverNote;

    public JobApplicationRequest() {
    }

    public JobApplicationRequest(Long jobId, String coverNote) {
        this.jobId = jobId;
        this.coverNote = coverNote;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverNote() {
        return coverNote;
    }

    public void setCoverNote(String coverNote) {
        this.coverNote = coverNote;
    }
}
