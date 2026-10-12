$ErrorActionPreference = 'Stop'

# 1. Login as Admin
$adminLoginBody = @{
    email = "admin@jobskillmatch.com"
    password = "admin123"
} | ConvertTo-Json

$adminResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $adminLoginBody
$adminToken = $adminResp.data.token
Write-Host "Admin Token Acquired Successfully: $($adminToken.Substring(0, 20))..."

$headers = @{
    Authorization = "Bearer $adminToken"
}

# 2. Test GET /api/admin/stats
$statsResp = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/stats" -Method Get -Headers $headers
Write-Host "`nAdmin Stats:"
Write-Host "Total Candidates: $($statsResp.data.totalCandidates)"
Write-Host "Total Jobs: $($statsResp.data.totalJobs)"
Write-Host "Total Applications: $($statsResp.data.totalApplications)"
Write-Host "Total Skills: $($statsResp.data.totalSkills)"
Write-Host "Total Resumes: $($statsResp.data.totalResumes)"
Write-Host "Applications Status Distribution:"
$statsResp.data.applicationsByStatus | Format-Table

# 3. Test GET /api/admin/candidates
$candidatesResp = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/candidates" -Method Get -Headers $headers
Write-Host "`nAdmin Candidates List (Count: $($candidatesResp.data.Count)):"
$candidatesResp.data | ForEach-Object {
    Write-Host "- $($_.name) ($($_.email)) | Degree: $($_.degree) | Skills: $($_.skillsCount) | Completion: $($_.profileCompletion)%"
}

# 4. Test GET /api/admin/applications
$appsResp = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/applications" -Method Get -Headers $headers
Write-Host "`nAdmin Applications List (Count: $($appsResp.data.Count)):"
$appsResp.data | ForEach-Object {
    Write-Host "App #$($_.id) - Candidate: $($_.applicantName) | Job: $($_.jobTitle) @ $($_.company) | Score: $($_.matchScore)% | Status: $($_.status)"
}

Write-Host "`nPhase 13 Admin APIs Smoke Test: SUCCESS"
