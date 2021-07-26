package com.assignment.pwc.complaintmanagement.filter;

import com.assignment.pwc.complaintmanagement.controller.util.AuthUtil;
import com.assignment.pwc.complaintmanagement.controller.util.JwtGenerator;
import com.assignment.pwc.complaintmanagement.exception.APIErrorResponse;
import com.assignment.pwc.complaintmanagement.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtGenerator jwtUtil;

    @Autowired
    private AuthUtil authUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest,
                                    HttpServletResponse httpServletResponse,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = httpServletRequest.getHeader("Authorization");

        try{
            authUtil.extractJwtData(authorizationHeader)
                    .filter(jwtData -> Objects.nonNull(jwtData.getEmail()))
                    .filter(jwtData -> Objects.nonNull(jwtData.getAccessToken()))
                    .ifPresent(jwtData -> {

                        if (Objects.isNull(SecurityContextHolder.getContext().getAuthentication())) {

                            UserDetails userDetails = this.userDetailsService.loadUserByUsername(jwtData.getEmail());

                            if (jwtUtil.validateToken(jwtData.getAccessToken(), userDetails)) {

                                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());
                                usernamePasswordAuthenticationToken
                                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                            }
                        }
                    });
            filterChain.doFilter(httpServletRequest, httpServletResponse);

        } catch(Exception e){

            APIErrorResponse apiError = new APIErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
            apiError.setPath(httpServletRequest.getServletPath());
            httpServletResponse.setStatus(apiError.getStatus());
            httpServletResponse.setHeader("content-type", httpServletRequest.getContentType());
            httpServletResponse.getWriter().write(apiError.toStringJSON());

        }
    }
}
