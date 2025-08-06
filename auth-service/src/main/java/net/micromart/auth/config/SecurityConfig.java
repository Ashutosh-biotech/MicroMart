package net.micromart.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import net.micromart.auth.filter.GatewaySecurityFilter;
import net.micromart.auth.filter.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final GatewaySecurityFilter gatewaySecurityFilter;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, GatewaySecurityFilter gatewaySecurityFilter) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.gatewaySecurityFilter = gatewaySecurityFilter;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
			.csrf(csrf -> csrf.disable())
			.cors(cors -> cors.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/validate", "/api/auth/refresh", "/api/auth/logout", "/api/auth/verify-email", "/api/auth/health").permitAll()
				.anyRequest().authenticated()
			)
			.addFilterBefore(gatewaySecurityFilter, UsernamePasswordAuthenticationFilter.class)
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
			.build();
	}



	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
}
