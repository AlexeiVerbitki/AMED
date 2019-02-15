package com.bass.amed.controller.rest;

import com.bass.amed.configuration.CustomAuthenticationManager;
import com.bass.amed.dto.ScrUserDTO;
import com.bass.amed.exception.CustomException;
import com.bass.amed.security.JWTConfigurer;
import com.bass.amed.security.TokenProvider;
import com.bass.amed.utils.LdapErrorMappingUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api")
public class AutheticationJWTController
{
    private final TokenProvider               tokenProvider;
    private final CustomAuthenticationManager customAuthenticationManager;

    @Value("${ldap.user_domain_suffix}")
    private String USER_DOMAIN_SUFFIX;

    public AutheticationJWTController(TokenProvider tokenProvider, CustomAuthenticationManager customAuthenticationManager)
    {
        this.tokenProvider = tokenProvider;
        this.customAuthenticationManager = customAuthenticationManager;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authenticate(HttpServletRequest request, @Valid @RequestBody ScrUserDTO scrUserDTO) throws CustomException
    {
        LOGGER.debug("Try to authenticate user: " + scrUserDTO.getUsername());
        LOGGER.debug("ip address: " + request.getRemoteAddr());

        String                              dnUser              = scrUserDTO.getUsername() + USER_DOMAIN_SUFFIX;
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(dnUser, scrUserDTO.getPassword());
        Authentication                      authentication;

        try
        {
            authentication = this.customAuthenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        catch (RuntimeException ce)
        {
            LOGGER.error(ce.getMessage(), ce);
            throw new CustomException(LdapErrorMappingUtils.getLdapAuthErrorMessage(ce.getMessage()), HttpStatus.UNAUTHORIZED);
        }

        String      jwt         = tokenProvider.createToken(authentication);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTConfigurer.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken
    {
        private String idToken;

        JWTToken(String idToken)
        {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken()
        {
            return idToken;
        }

        void setIdToken(String idToken)
        {
            this.idToken = idToken;
        }
    }


}
