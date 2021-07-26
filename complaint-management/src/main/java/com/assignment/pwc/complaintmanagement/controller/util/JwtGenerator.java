package com.assignment.pwc.complaintmanagement.controller.util;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtGenerator {

    @Value("${auth.jwtSecret}")
    private String jwtSecret;

    @Value("${auth.jwtExpirationMs}")
    private int jwtExpirationMs;

    public long getTokenExpirationTime(){
        return this.jwtExpirationMs;
    }
    public String generateJwtToken(UserDetails userPrincipal) {
        return generateTokenFromUsername(userPrincipal.getUsername());
    }

    public String generateTokenFromUsername(String username) {
        Date nowDate = Date.from(Instant.now());
        Date expirationDate = new Date(nowDate.getTime() + jwtExpirationMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(nowDate)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return getJwsClaims(token).map(claimsJws -> claimsJws.getBody().getSubject()).orElseThrow(IllegalStateException::new);
    }


    public boolean validateToken(String accessToken,
                                 UserDetails userDetails) {

        Optional<Jws<Claims>> claims = getJwsClaims(accessToken);
        return claims.filter(claimsJws -> validateToken(accessToken, userDetails.getUsername()) &&
                !claimsJws.getBody().getExpiration().before(Date.from(Instant.now()))).isPresent();

    }

    public Optional<Jws<Claims>> getJwsClaims(String accessToken)  {
        try {
            return Optional.of(Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(accessToken));
        } catch (SignatureException e) {
            throw new SignatureException("Invalid JWT signature: {} "+ e.getMessage());
        } catch (ExpiredJwtException e) {
            throw new ExpiredJwtException(e.getHeader(), e.getClaims(), e.getMessage());
        } catch (MalformedJwtException e) {
            throw new MalformedJwtException("Malformed Jwt", e);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public Boolean validateToken(String token,
                                 String userName) {
        final String username = getUserNameFromJwtToken(token);
        return (username.equals(userName));
    }
}
