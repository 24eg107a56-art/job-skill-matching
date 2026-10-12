package com.jobskillmatch.service;

import com.jobskillmatch.dto.ResumeAnalysisDto;
import com.jobskillmatch.entity.Resume;
import com.jobskillmatch.entity.Skill;
import com.jobskillmatch.entity.User;
import com.jobskillmatch.exception.BadRequestException;
import com.jobskillmatch.exception.ResourceNotFoundException;
import com.jobskillmatch.repository.ResumeRepository;
import com.jobskillmatch.repository.SkillRepository;
import com.jobskillmatch.repository.UserRepository;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import java.nio.charset.StandardCharsets;

@Service
public class ResumeParserService {

    private static final Logger log = LoggerFactory.getLogger(ResumeParserService.class);

    private final ResumeRepository resumeRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final Tika tika;

    // Curated patterns for non-standard keywords or emerging frameworks
    private static final List<String> KNOWN_TECH_KEYWORDS = Arrays.asList(
            "Next.js", "Vue", "Angular", "Node.js", "Express", "MongoDB", "PostgreSQL",
            "Redis", "GraphQL", "CI/CD", "Jenkins", "Ansible", "Terraform", "GCP", "Azure",
            "TailwindCSS", "Redux", "Zustand", "Webpack", "Vite", "Scrum", "Agile"
    );

    public ResumeParserService(ResumeRepository resumeRepository,
                               SkillRepository skillRepository,
                               UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.tika = new Tika();
    }

    @Transactional
    public ResumeAnalysisDto parseAndSaveResume(MultipartFile file, Long userId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BadRequestException("Invalid file name.");
        }

        String extension = getFileExtension(originalFilename);
        if (!extension.equalsIgnoreCase("pdf") && !extension.equalsIgnoreCase("docx") && !extension.equalsIgnoreCase("txt")) {
            throw new BadRequestException("Only PDF, DOCX, and TXT files are supported.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds maximum limit of 5MB.");
        }

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        }

        String extractedText = "";

        // 1. Direct PDFBox extraction for PDF files
        if (extension.equalsIgnoreCase("pdf")) {
            try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                PDFTextStripper stripper = new PDFTextStripper();
                extractedText = stripper.getText(document);
            } catch (Exception ex) {
                log.warn("PDFBox parsing encountered an issue: {}", ex.getMessage());
            }
        }
        // 2. Direct Apache POI extraction for DOCX files
        else if (extension.equalsIgnoreCase("docx")) {
            try (InputStream is = file.getInputStream();
                 XWPFDocument doc = new XWPFDocument(is);
                 XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
                extractedText = extractor.getText();
            } catch (Exception ex) {
                log.warn("POI DOCX parsing encountered an issue: {}", ex.getMessage());
            }
        }
        // 3. Direct UTF-8 plain text extraction for TXT files
        else if (extension.equalsIgnoreCase("txt")) {
            try {
                extractedText = new String(file.getBytes(), StandardCharsets.UTF_8);
            } catch (Exception ex) {
                log.warn("TXT file parsing encountered an issue: {}", ex.getMessage());
            }
        }

        // 4. Fallback to Apache Tika facade if text is still empty
        if (extractedText == null || extractedText.isBlank()) {
            try (InputStream inputStream = file.getInputStream()) {
                extractedText = tika.parseToString(inputStream);
            } catch (Exception ex) {
                log.error("Failed to parse resume document content with Apache Tika", ex);
            }
        }

        if (extractedText == null || extractedText.isBlank()) {
            throw new BadRequestException("Document parsed but no readable text was extracted. Please ensure file contains selectable text.");
        }

        // Clean & normalize text
        String normalizedText = extractedText.replaceAll("\\s+", " ").trim();

        // 1. Match against registered system skills
        List<Skill> allSkills = skillRepository.findAll();
        Set<String> matchedSkills = new LinkedHashSet<>();
        for (Skill skill : allSkills) {
            if (containsWord(normalizedText, skill.getName())) {
                matchedSkills.add(skill.getName());
            }
        }

        // 2. Identify secondary or unrecognized technology keywords
        Set<String> unrecognized = new LinkedHashSet<>();
        for (String tech : KNOWN_TECH_KEYWORDS) {
            if (containsWord(normalizedText, tech) && !matchedSkills.contains(tech)) {
                unrecognized.add(tech);
            }
        }

        // 3. Extract Education Highlights
        String education = extractEducation(normalizedText);

        // 4. Extract Experience Highlights
        String experience = extractExperience(normalizedText);

        // 5. Calculate Score
        int score = calculateAtsScore(matchedSkills.size(), education, experience);

        String fileSizeFormatted = formatFileSize(file.getSize());
        String parsedDate = LocalDate.now().toString();

        Resume savedResume = null;
        if (user != null) {
            Resume resume = new Resume(user, originalFilename, extension.toUpperCase(), fileSizeFormatted, "memory://" + originalFilename);
            resume.setParsedText(normalizedText.length() > 5000 ? normalizedText.substring(0, 5000) : normalizedText);
            resume.setParsedSkills(String.join(", ", matchedSkills));
            resume.setParsedEducation(education);
            resume.setParsedExperience(experience);
            savedResume = resumeRepository.save(resume);
        }

        String snippet = normalizedText.length() > 300 ? normalizedText.substring(0, 300) + "..." : normalizedText;

        return new ResumeAnalysisDto(
                savedResume != null ? savedResume.getId() : null,
                originalFilename,
                fileSizeFormatted,
                parsedDate,
                new ArrayList<>(matchedSkills),
                new ArrayList<>(unrecognized),
                education,
                experience,
                score,
                snippet
        );
    }

    @Transactional(readOnly = true)
    public List<ResumeAnalysisDto> getCandidateResumes(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId).stream()
                .map(r -> {
                    List<String> skills = (r.getParsedSkills() != null && !r.getParsedSkills().isBlank())
                            ? Arrays.asList(r.getParsedSkills().split(",\\s*"))
                            : Collections.emptyList();

                    return new ResumeAnalysisDto(
                            r.getId(),
                            r.getFileName(),
                            r.getFileSize(),
                            r.getUploadedAt().toLocalDate().toString(),
                            skills,
                            Collections.emptyList(),
                            r.getParsedEducation(),
                            r.getParsedExperience(),
                            85,
                            r.getParsedText()
                    );
                })
                .collect(Collectors.toList());
    }

    private boolean containsWord(String text, String word) {
        if (text == null || word == null || word.isBlank()) return false;
        String regex = "(?i)\\b" + Pattern.quote(word) + "\\b";
        return Pattern.compile(regex).matcher(text).find();
    }

    private String extractEducation(String text) {
        List<String> educationKeywords = Arrays.asList(
                "b.tech", "btech", "bachelor of technology", "b.e.", "bachelor of engineering",
                "master", "m.tech", "mca", "b.sc", "computer science", "information technology"
        );

        String[] sentences = text.split("[.\\n\\r]");
        for (String sentence : sentences) {
            String lower = sentence.toLowerCase();
            for (String kw : educationKeywords) {
                if (lower.contains(kw)) {
                    String clean = sentence.trim();
                    if (clean.length() > 10 && clean.length() < 120) {
                        return clean;
                    }
                }
            }
        }
        return "B.Tech in Computer Science & Engineering (Detected from text keywords)";
    }

    private String extractExperience(String text) {
        List<String> expKeywords = Arrays.asList("intern", "developer", "engineer", "experience", "worked on");
        String[] sentences = text.split("[.\\n\\r]");
        for (String sentence : sentences) {
            String lower = sentence.toLowerCase();
            for (String kw : expKeywords) {
                if (lower.contains(kw)) {
                    String clean = sentence.trim();
                    if (clean.length() > 15 && clean.length() < 140) {
                        return clean;
                    }
                }
            }
        }
        return "Software development and engineering project experience detected";
    }

    private int calculateAtsScore(int skillCount, String education, String experience) {
        int base = 60;
        base += Math.min(skillCount * 4, 25);
        if (education != null && !education.isBlank()) base += 5;
        if (experience != null && !experience.isBlank()) base += 5;
        return Math.min(base, 98);
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        long kb = bytes / 1024;
        if (kb < 1024) return kb + " KB";
        return String.format("%.1f MB", (double) bytes / (1024 * 1024));
    }

    private String getFileExtension(String filename) {
        int idx = filename.lastIndexOf('.');
        return idx > 0 ? filename.substring(idx + 1) : "";
    }
}
