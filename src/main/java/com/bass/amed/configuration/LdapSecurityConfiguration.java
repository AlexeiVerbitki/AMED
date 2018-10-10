package com.bass.amed.configuration;

import com.bass.amed.security.CustomHeaderFilter;
import com.bass.amed.security.JWTConfigurer;
import com.bass.amed.security.TokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class LdapSecurityConfiguration extends WebSecurityConfigurerAdapter
{
    private static final Logger LOGGER = LoggerFactory.getLogger(LdapSecurityConfiguration.class);

    @Value("${ldap.url}")
    private String LDAP_URL;
    @Value("${ldap.port}")
    private String LDAP_PORT;
    @Value("${ldap.base_search_dn}")
    private String LDAP_BASE_SEARCH_DN;
    @Value("${ldap.user_search_dn}")
    private String LDAP_USER_SEARCH_DN;
    @Value("${ldap.group_search_dn}")
    private String LDAP_GROUP_SEARCH_DN;

    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception
    {
        authenticationManagerBuilder.ldapAuthentication()
                .groupSearchBase(LDAP_GROUP_SEARCH_DN)
                .groupSearchFilter("uniqueMember={0}")
                .userSearchBase(LDAP_USER_SEARCH_DN)
                .userSearchFilter("(uid={0})")
                .contextSource(getContextSource());


    }

    @Override
    public void configure(WebSecurity web)
    {
        web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**").antMatchers("/app/**/*.{js,html}");
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception
    {
        //        httpSecurity.httpBasic().and().authorizeRequests().anyRequest().authenticated().and().csrf().disable();


        httpSecurity.csrf().disable()
                .headers().xssProtection().block(true)
                .and().frameOptions().sameOrigin().httpStrictTransportSecurity().disable()
                .and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().authorizeRequests().antMatchers("/").permitAll()
                .antMatchers(HttpMethod.OPTIONS, "/").permitAll()
                .antMatchers("/api/authenticate").permitAll()
                .antMatchers("/api/reset-password").permitAll()
                .antMatchers("/api/**").permitAll()
//                .hasAnyRole("TEST")
                    .and().apply(securityConfigurerAdapter());
        //.hasAnyAuthority("ADMIN");
        //                .antMatchers("/actuator/**").hasAnyAuthority("ADMIN")
        //                .and( ).apply( securityConfigurerAdapter( ) );
    }

    @Bean
    public LdapTemplate ldapTemplate()
    {
        return new LdapTemplate(getContextSource());
    }

    @Bean
    public LdapContextSource getContextSource()
    {
        LdapContextSource contextSource = new LdapContextSource();
        contextSource.setUrl(LDAP_URL + ":" + LDAP_PORT);
        contextSource.setBase(LDAP_BASE_SEARCH_DN);
        contextSource.setReferral("follow");
        contextSource.afterPropertiesSet(); //needed otherwise you will have a NullPointerException in spring

        return contextSource;
    }

    private JWTConfigurer securityConfigurerAdapter()
    {
        return new JWTConfigurer(getTokenProvider());
    }

    @Bean
    public TokenProvider getTokenProvider()
    {
        return new TokenProvider();
    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean()
    {
        return new FilterRegistrationBean(new CustomHeaderFilter());
    }

}
