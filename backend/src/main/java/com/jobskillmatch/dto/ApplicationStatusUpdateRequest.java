package com.jobskillmatch.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplicationStatusUpdateRequest {

    @NotBlank(message = "Status cannot be blank")
    private String status;

    public ApplicationStatusUpdateRequest() {
    }

    public ApplicationStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
