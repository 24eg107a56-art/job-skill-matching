package com.jobskillmatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidate_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"profile_id", "skill_id"})
})
public class CandidateSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private CandidateProfile profile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(length = 50)
    private String proficiency = "Intermediate";

    private Boolean verified = false;

    public CandidateSkill() {
    }

    public CandidateSkill(CandidateProfile profile, Skill skill, String proficiency) {
        this.profile = profile;
        this.skill = skill;
        this.proficiency = proficiency != null ? proficiency : "Intermediate";
        this.verified = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CandidateProfile getProfile() {
        return profile;
    }

    public void setProfile(CandidateProfile profile) {
        this.profile = profile;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
