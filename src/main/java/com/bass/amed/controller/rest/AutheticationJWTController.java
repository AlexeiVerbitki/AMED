package com.bass.amed.controller.rest;

import com.bass.amed.configuration.CustomAuthenticationManager;
import com.bass.amed.dto.ScrUserDTO;
import com.bass.amed.exception.CustomException;
import com.bass.amed.security.JWTConfigurer;
import com.bass.amed.security.TokenProvider;
import com.bass.amed.utils.LdapErrorMappingUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.ldap.LdapUtils;
import org.springframework.web.bind.annotation.*;

import javax.naming.directory.DirContext;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AutheticationJWTController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(AutheticationJWTController.class);
    private final TokenProvider tokenProvider;
    private final CustomAuthenticationManager customAuthenticationManager;
    @Autowired
    private LdapContextSource contextSource;
    @Autowired
    private LdapTemplate ldapTemplate;
    private DirContext ctx = null;

    public AutheticationJWTController(TokenProvider tokenProvider, CustomAuthenticationManager customAuthenticationManager)
    {
        this.tokenProvider = tokenProvider;
        this.customAuthenticationManager = customAuthenticationManager;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authenticate(HttpServletRequest request, @Valid @RequestBody ScrUserDTO scrUserDTO) throws CustomException
    {
        LOGGER.debug("Try to authenticate user" + scrUserDTO.getUsername());
        LOGGER.debug("ip address: " + request.getRemoteAddr());

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(scrUserDTO.getUsername(), scrUserDTO.getPassword());
        Authentication authentication;

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

        String jwt = tokenProvider.createToken(authentication);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTConfigurer.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    public List getAllPersonNames()
    {
        return ldapTemplate.search("OU=DEV,OU=BASS", "(objectclass=person)",
                //                (AttributesMapper) attrs -> attrs.get("cn").);
                (AttributesMapper) attrs -> attrs.getAll());
    }

    @GetMapping("/getUserDetails")
    void getUserDetails() throws CustomException
    {
        try
        {
            String filterStr = new EqualsFilter("userPrincipalName", "dumitru.ginu@bass.md").encode();

            contextSource.setUserDn("dumitru.ginu@bass.md");
            contextSource.setPassword("Mind2Mind");

            boolean authed = ldapTemplate.authenticate("OU=BASS", filterStr, "Mind2Mind");
            System.out.println("Authenticated: " + authed);
            System.out.println(filterStr);

            List list = getAllPersonNames();
            System.out.println(list.toString());

            LOGGER.info("Login success");
        }
        catch (Exception e)
        {
            LOGGER.error("Login failed", e.getMessage());
            throw new CustomException(e.getMessage());
        }
        finally
        {
            LdapUtils.closeContext(ctx);
        }

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
