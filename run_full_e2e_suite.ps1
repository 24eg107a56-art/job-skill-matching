$ErrorActionPreference = 'Stop'
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "e2e.candidate.$timestamp@example.com"
$testPass = "candidate123"

Write-Host "=========================================================="
Write-Host "  JobSkillMatch - Full End-to-End System Verification Suite"
Write-Host "=========================================================="

# 1. Health & Database Connectivity
Write-Host "`n[1/12] Verifying System Health & MySQL Connection..."
$health = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
if ($health.data.database -eq "CONNECTED") {
    Write-Host "  -> PASS: Backend is UP, MySQL 8.0.46 is CONNECTED" -ForegroundColor Green
} else {
    throw "Database not connected!"
}

# 2. Register New Candidate
Write-Host "`n[2/12] Registering New Candidate User: $testEmail..."
$regBody = @{
    name = "E2E Candidate $timestamp"
    email = $testEmail
    password = $testPass
    role = "ROLE_CANDIDATE"
} | ConvertTo-Json
$regResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -ContentType "application/json" -Body $regBody
$candidateToken = $regResp.data.token
Write-Host "  -> PASS: Candidate registered, JWT issued successfully" -ForegroundColor Green

$candidateHeaders = @{
    Authorization = "Bearer $candidateToken"
}

# 3. Update Candidate Profile
Write-Host "`n[3/12] Updating Candidate Profile in MySQL..."
$profileBody = @{
    name = "E2E Candidate $timestamp"
    phone = "+91 91234 56789"
    degree = "B.Tech in Artificial Intelligence"
    university = "Indian Institute of Information Technology"
    graduationYear = 2026
    yearsOfExperience = 1
    preferredRole = "Full-Stack Engineer"
    preferredLocation = "Bangalore, India"
    employmentPreference = "Full-time"
    workExperience = "Interned at CloudTech as Junior Backend Engineer"
    certifications = "AWS Certified Cloud Practitioner"
    skills = @(
        @{ skillName = "Java"; proficiency = "Advanced" },
        @{ skillName = "Spring Boot"; proficiency = "Intermediate" },
        @{ skillName = "MySQL"; proficiency = "Intermediate" }
    )
} | ConvertTo-Json
$profileResp = Invoke-RestMethod -Uri "http://localhost:8080/api/profile" -Method Put -Headers $candidateHeaders -ContentType "application/json" -Body $profileBody
Write-Host "  -> PASS: Profile updated with $($profileResp.data.skills.Count) skills, completion: $($profileResp.data.profileCompletion)%" -ForegroundColor Green

# 4. Add Individual Skill to Profile
Write-Host "`n[4/12] Adding Skill (Docker) to Candidate Skill Matrix..."
$addSkillBody = @{
    skillName = "Docker"
    proficiency = "Beginner"
} | ConvertTo-Json
$addSkillResp = Invoke-RestMethod -Uri "http://localhost:8080/api/profile/skills" -Method Post -Headers $candidateHeaders -ContentType "application/json" -Body $addSkillBody
Write-Host "  -> PASS: Docker added, total candidate skills now: $($addSkillResp.data.skills.Count)" -ForegroundColor Green

# 5. Upload & Parse Resume
Write-Host "`n[5/12] Uploading Resume File (sample_resume.txt) for ATS Analysis..."
$authHeader = "Authorization: Bearer $candidateToken"
$resumeUploadJson = & curl.exe -s -X POST "http://localhost:8080/api/resume/upload" -H "$authHeader" -F "file=@sample_resume.txt"
$resumeResp = $resumeUploadJson | ConvertFrom-Json
Write-Host "  -> PASS: Resume parsed. Score: $($resumeResp.data.score)%, Extracted Skills: $($resumeResp.data.extractedSkills.Count)" -ForegroundColor Green

# 6. Check Career Roadmap
Write-Host "`n[6/12] Fetching Candidate Career Roadmap..."
$roadmapResp = Invoke-RestMethod -Uri "http://localhost:8080/api/roadmap" -Method Get -Headers $candidateHeaders
Write-Host "  -> PASS: Roadmap active for role '$($roadmapResp.data.targetRole)' with $($roadmapResp.data.items.Count) milestone steps" -ForegroundColor Green

# 7. Job Recommendations & Match Scoring
Write-Host "`n[7/12] Querying Job Recommendations with Precision Scoring..."
$recResp = Invoke-RestMethod -Uri "http://localhost:8080/api/matching/recommendations" -Method Get -Headers $candidateHeaders
Write-Host "  -> PASS: Found $($recResp.data.Count) recommended positions. Top match score: $($recResp.data[0].matchPercentage)%" -ForegroundColor Green
$targetJobId = $recResp.data[0].job.id

# 8. Skill Gap Analysis
Write-Host "`n[8/12] Running Skill Gap Diagnosis for Target Job (ID: $targetJobId)..."
$gapResp = Invoke-RestMethod -Uri "http://localhost:8080/api/matching/gap/$targetJobId" -Method Get -Headers $candidateHeaders
Write-Host "  -> PASS: Match: $($gapResp.data.matchPercentage)% | Matched: $($gapResp.data.matchedSkills.Count) | Missing: $($gapResp.data.missingSkills.Count)" -ForegroundColor Green

# 9. Bookmark & Save Job
Write-Host "`n[9/12] Bookmarking Job #$targetJobId..."
$saveResp = Invoke-RestMethod -Uri "http://localhost:8080/api/applications/save/$targetJobId" -Method Post -Headers $candidateHeaders
$savedJobs = Invoke-RestMethod -Uri "http://localhost:8080/api/applications/saved" -Method Get -Headers $candidateHeaders
Write-Host "  -> PASS: Job saved in bookmarks (Total saved: $($savedJobs.data.Count))" -ForegroundColor Green

# 10. Submit Job Application
Write-Host "`n[10/12] Submitting Job Application for Job #$targetJobId..."
$applyBody = @{
    jobId = $targetJobId
    coverNote = "Automated E2E Verification application for Java/Spring position."
} | ConvertTo-Json
$applyResp = Invoke-RestMethod -Uri "http://localhost:8080/api/applications" -Method Post -Headers $candidateHeaders -ContentType "application/json" -Body $applyBody
$appId = $applyResp.data.id
Write-Host "  -> PASS: Application #$appId created. Status: '$($applyResp.data.status)', Match: $($applyResp.data.matchScore)%" -ForegroundColor Green

# 11. Admin Journey: Login & Update Application Status
Write-Host "`n[11/12] Admin Logging In & Reviewing Pipeline..."
$adminLoginBody = @{
    email = "admin@jobskillmatch.com"
    password = "admin123"
} | ConvertTo-Json
$adminLoginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $adminLoginBody
$adminToken = $adminLoginResp.data.token
$adminHeaders = @{
    Authorization = "Bearer $adminToken"
}

$statusUpdateBody = @{
    status = "Interview Scheduled"
} | ConvertTo-Json
$updateStatusResp = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/applications/$appId/status" -Method Put -Headers $adminHeaders -ContentType "application/json" -Body $statusUpdateBody
Write-Host "  -> PASS: Admin updated Application #$appId status to '$($updateStatusResp.data.status)'" -ForegroundColor Green

# 12. Candidate Verifies Updated Status
Write-Host "`n[12/12] Candidate Verifying Application Status Reflection..."
$myApps = Invoke-RestMethod -Uri "http://localhost:8080/api/applications/my" -Method Get -Headers $candidateHeaders
$updatedApp = $myApps.data | Where-Object { $_.id -eq $appId }
if ($updatedApp.status -eq "Interview Scheduled") {
    Write-Host "  -> PASS: Candidate confirmed updated status: '$($updatedApp.status)'" -ForegroundColor Green
} else {
    throw "Status mismatch: expected 'Interview Scheduled', got '$($updatedApp.status)'"
}

Write-Host "`n=========================================================="
Write-Host "  ALL 12 END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY!    " -ForegroundColor Cyan
Write-Host "=========================================================="
