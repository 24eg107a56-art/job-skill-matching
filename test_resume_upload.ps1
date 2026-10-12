$ErrorActionPreference = 'Stop'

# 1. Login
$loginBody = @{
    email = "arun.candidate@example.com"
    password = "candidate123"
} | ConvertTo-Json

$loginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $loginResp.data.token
Write-Host "Obtained Candidate Token: $($token.Substring(0, 20))..."

# 2. Upload sample_resume.txt
$authHeader = "Authorization: Bearer $token"
$uploadRaw = & curl.exe -s -X POST "http://localhost:8080/api/resume/upload" -H "$authHeader" -F "file=@sample_resume.txt"

Write-Host "Upload API Response:"
Write-Host $uploadRaw

# 3. Retrieve Candidate Resumes
$myResumes = Invoke-RestMethod -Uri "http://localhost:8080/api/resume/my" -Method Get -Headers @{ Authorization = "Bearer $token" }
Write-Host "`nCandidate Saved Resumes in MySQL:"
$myResumes.data | ForEach-Object {
    Write-Host "ID: $($_.id) | File: $($_.fileName) | Size: $($_.fileSize) | Date: $($_.parsedDate) | Skills: $($_.extractedSkills.Count)"
}
