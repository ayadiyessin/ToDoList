package tn.startchange.dto;

import lombok.Data;

@Data
public class AuthResponse {
	private String token;
	private String email;
	private String username;

	public AuthResponse(String token) {
		this.token = token;
	}

	public AuthResponse(String token, String email, String username) {
		super();
		this.token = token;
		this.email = email;
		this.username = username;
	}

}
