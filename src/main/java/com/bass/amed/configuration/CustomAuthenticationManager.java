package com.bass.amed.configuration;

import com.bass.amed.entity.ScrAuthorityEntity;
import com.bass.amed.entity.ScrRoleEntity;
import com.bass.amed.entity.ScrUserEntity;
import com.bass.amed.repository.SrcUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.ppolicy.PasswordPolicyControl;
import org.springframework.security.ldap.ppolicy.PasswordPolicyResponseControl;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.userdetails.LdapUserDetailsImpl;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Optional;

@Component
public class CustomAuthenticationManager implements AuthenticationManager
{

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomAuthenticationManager.class);
    private final SrcUserRepository srcUserRepository;
    private final LdapContextSource ldapContextSource;
    LdapAuthenticationProvider provider = null;

    @Value("${ldap.base_search_user}")
    private String LDAP_BASE_USER_SEARCH;


    public CustomAuthenticationManager(SrcUserRepository srcUserRepository, LdapContextSource ldapContextSource)
    {
        this.srcUserRepository = srcUserRepository;
        this.ldapContextSource = ldapContextSource;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException
    {
        LOGGER.debug("AUTHENTICATION Login: " + authentication.getName());
        LOGGER.debug("AUTHENTICATION Password: *************");

        ldapContextSource.setUserDn(authentication.getPrincipal().toString());
        ldapContextSource.setPassword(authentication.getCredentials().toString());
        BindAuthenticator bindAuth = new BindAuthenticator(ldapContextSource);

        AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectclass", "person"));
        filter.and(new EqualsFilter("userPrincipalName", authentication.getPrincipal().toString()));

        FilterBasedLdapUserSearch userSearch = new FilterBasedLdapUserSearch(LDAP_BASE_USER_SEARCH, filter.encode(),ldapContextSource);
        try
        {
            bindAuth.setUserSearch(userSearch);
            bindAuth.afterPropertiesSet();
        }
        catch (Exception ex)
        {
            throw new RuntimeException(ex.getMessage());

        }

        provider = new LdapAuthenticationProvider(bindAuth);
        provider.setUserDetailsContextMapper(new UserDetailsContextMapper()
        {
            @Override
            public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> clctn)
            {

                String dn = ctx.getNameInNamespace();

                LOGGER.debug("Mapping user details from context with DN: " + dn);

                Optional<ScrUserEntity> isUser = srcUserRepository.findOneWithAuthoritiesByUsername(username);
                final ScrUserEntity user = isUser.orElseThrow(() -> new UsernameNotFoundException(username + " nu este configurat in BD locala"));

                final ScrRoleEntity srcRole = user.getSrcRole();
                if (srcRole.getId() == null)
                {
                    throw new UsernameNotFoundException("Nu s-a gasit nici un role p/u utilizatorul: " + username);
                }

                if (srcRole.getAuthorities().isEmpty())
                {
                    throw new UsernameNotFoundException("Rolul: " + srcRole.getDescription() + ",  nu aveti autoritati");
                }

                LdapUserDetailsImpl.Essence essence = new LdapUserDetailsImpl.Essence();
                essence.setDn(dn);
                essence.setUsername(authentication.getPrincipal().toString());
                essence.addAuthority(new SimpleGrantedAuthority(srcRole.getRoleCode()));

                for (ScrAuthorityEntity authority : srcRole.getAuthorities())
                {
                    GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(authority.getCode());
                    essence.addAuthority(grantedAuthority);
                }

                PasswordPolicyResponseControl policy = (PasswordPolicyResponseControl) ctx.getObjectAttribute(PasswordPolicyControl.OID);

                if (policy != null)
                {
                    essence.setTimeBeforeExpiration(policy.getTimeBeforeExpiration());
                    essence.setGraceLoginsRemaining(policy.getGraceLoginsRemaining());
                }

                return essence.createUserDetails();
            }


            @Override
            public void mapUserToContext(UserDetails ud, DirContextAdapter dca)
            {

            }
        });
        return provider.authenticate(authentication);
    }
}
