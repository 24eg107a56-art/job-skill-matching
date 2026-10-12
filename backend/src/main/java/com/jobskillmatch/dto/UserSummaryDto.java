package com.jobskillmatch.dto;

public class UserSummaryDto {

    private Long id;
    private String name;
    private String email;
    private String role;
    private Integer profileCompletion;

    public UserSummaryDto() {
    }

    public UserSummaryDto(Long id, String name, String email, String role, Integer profileCompletion) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.profileCompletion = profileCompletion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getProfileCompletion() {
        return profileCompletion;
    }

    public void setProfileCompletion(Integer profileCompletion) {
        this.profileCompletion = profileCompletion;
    }
}
