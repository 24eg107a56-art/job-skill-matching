pdf_content = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 235 >>
stream
BT
/F1 12 Tf
72 700 Td
(Arun Kumar - Full Stack Developer) Tj
0 -20 Td
(Skills: Java, Spring Boot, React, MySQL, Docker, AWS, REST APIs) Tj
0 -20 Td
(Education: Bachelor of Technology in Computer Science) Tj
0 -20 Td
(Experience: Developer Intern at InnovateTech) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000530 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
605
%%EOF
"""

with open("sample_resume.pdf", "wb") as f:
    f.write(pdf_content)

print("Created sample_resume.pdf successfully")
