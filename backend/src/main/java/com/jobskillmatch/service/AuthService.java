package com.jobskillmatch.service;

import com.jobskillmatch.dto.AuthResponse;
import com.jobskillmatch.dto.LoginRequest;
import com.jobskillmatch.dto.RegisterRequest;
import com.jobskillmatch.dto.UserSummaryDto;
import com.jobskillmatch.entity.CandidateProfile;
import com.jobskillmatch.entity.Role;
import com.jobskillmatch.entity.User;
import com.jobskillmatch.exception.BadRequestException;
import com.jobskillmatch.exception.ResourceNotFoundException;
import com.jobskillmatch.repository.CandidateProfileRepository;
import com.jobskillmatch.repository.UserRepository;
import com.jobskillmatch.security.JwtTokenProvider;
import com.jobskillmatch.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       CandidateProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email '" + email + "' already exists.");
        }

        Role role = Role.ROLE_CANDIDATE;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
            role = Role.ROLE_ADMIN;
        }

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                role
        );

        User savedUser = userRepository.save(user);

        if (role == Role.ROLE_CANDIDATE) {
            CandidateProfile profile = new CandidateProfile(savedUser);
            profileRepository.save(profile);
        }

        String jwt = tokenProvider.generateTokenFromDetails(
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getId()
        );

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Integer completion = 0;
        if (user.getRole() == Role.ROLE_CANDIDATE) {
            completion = profileRepository.findByUserId(user.getId())
                    .map(CandidateProfile::getProfileCompletion)
                    .orElse(0);
        }

        return new UserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                completion
        );
    }
}
