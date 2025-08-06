package net.micromart.auth.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class GatewaySecurityFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        
        // Check for X-Forwarded headers from gateway
        String forwardedHost = request.getHeader("X-Forwarded-Host");
        String forwardedPort = request.getHeader("X-Forwarded-Port");
        
        boolean isValidRequest = false;
        
        // Direct access from API Gateway (port 8080)
        if ("localhost".equals(serverName) && serverPort == 8080) {
            isValidRequest = true;
        }
        // Request through gateway (forwarded headers)
        else if ("localhost:8080".equals(forwardedHost) || 
                ("localhost".equals(forwardedHost) && "8080".equals(forwardedPort))) {
            isValidRequest = true;
        }
        // Direct access from Order Service (port 9002)
        else if ("localhost".equals(serverName) && serverPort == 9002) {
            isValidRequest = true;
        }
        // Request to auth service itself (port 9000)
        else if ("localhost".equals(serverName) && serverPort == 9000) {
            isValidRequest = true;
        }
        
        if (!isValidRequest) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Access denied: Only localhost:8080 and localhost:9002 are allowed");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}