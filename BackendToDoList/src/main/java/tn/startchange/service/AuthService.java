package tn.startchange.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tn.startchange.dto.AuthResponse;
import tn.startchange.dto.LoginRequest;
import tn.startchange.dto.RegisterRequest;
import tn.startchange.entity.User;
import tn.startchange.repository.UserRepository;
import tn.startchange.security.JwtUtil;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final AuthenticationManager authenticationManager;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
			AuthenticationManager authenticationManager) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
		this.authenticationManager = authenticationManager;
	}

	public AuthResponse register(RegisterRequest request) {
		if (userRepository.findByUsername(request.getUsername()).isPresent()
				|| userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new RuntimeException("Username or email already exists"); 
		}
		User user = new User(request.getUsername(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
		userRepository.save(user);
		String token = jwtUtil.generateToken(user);
		return new AuthResponse(token);
	}

	public AuthResponse login(LoginRequest request) {
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		User user = (User) authentication.getPrincipal();
		String token = jwtUtil.generateToken(user);
		return new AuthResponse(token);
	}
}