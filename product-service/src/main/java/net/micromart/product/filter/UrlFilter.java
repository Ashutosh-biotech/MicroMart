package net.micromart.product.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class UrlFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String serverName = httpRequest.getServerName();
        int serverPort = httpRequest.getServerPort();
        
        // Check for X-Forwarded headers from gateway
        String forwardedHost = httpRequest.getHeader("X-Forwarded-Host");
        String forwardedPort = httpRequest.getHeader("X-Forwarded-Port");
        
        boolean isValidRequest = false;
        
        // Direct access to gateway
        if ("localhost".equals(serverName) && serverPort == 8080) {
            isValidRequest = true;
        }
        // Request through gateway (forwarded headers)
        else if ("localhost:8080".equals(forwardedHost) || 
                ("localhost".equals(forwardedHost) && "8080".equals(forwardedPort))) {
            isValidRequest = true;
        }
        // Request from gateway to product service
        else if ("localhost".equals(serverName) && serverPort == 9001) {
            isValidRequest = true;
        }
        
        if (!isValidRequest) {
            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            httpResponse.getWriter().write("Access denied: Only localhost:8080 is allowed");
            return;
        }
        
        chain.doFilter(request, response);
    }
}