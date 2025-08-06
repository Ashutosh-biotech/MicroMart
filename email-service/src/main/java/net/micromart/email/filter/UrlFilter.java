package net.micromart.email.filter;

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
        
        boolean isValidRequest = false;
        
        // Only allow requests from internal microservices
        if ("localhost".equals(serverName) && (
            serverPort == 9000 ||  // auth-service
            serverPort == 9001 ||  // product-service  
            serverPort == 9002 ||  // order-service
            serverPort == 9004     // email-service itself
        )) {
            isValidRequest = true;
        }
        
        // Also check if request is coming FROM auth-service (port 9000)
        String remoteAddr = httpRequest.getRemoteAddr();
        if ("127.0.0.1".equals(remoteAddr) || "::1".equals(remoteAddr)) {
            isValidRequest = true;
        }
        
        if (!isValidRequest) {
            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            httpResponse.getWriter().write("Access denied: Only internal services allowed");
            return;
        }
        
        chain.doFilter(request, response);
    }
}