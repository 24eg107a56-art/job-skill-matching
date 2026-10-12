$ErrorActionPreference = 'Stop'

# 1. Login
$loginBody = @{
    email = "arun.candidate@example.com"
    password = "candidate123"
} | ConvertTo-Json

$loginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $loginResp.data.token
Write-Host "Obtained Candidate Token: $($token.Substring(0, 20))..."

# 2. Check GET /api/resume/my
$headers = @{
    Authorization = "Bearer $token"
}

$myResumes = Invoke-RestMethod -Uri "http://localhost:8080/api/resume/my" -Method Get -Headers $headers
Write-Host "Current Resumes Count: $($myResumes.data.Count)"

Write-Host "Phase 12 Smoke Test Part 1 SUCCESS"
