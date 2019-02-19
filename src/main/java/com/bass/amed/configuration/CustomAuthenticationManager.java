package com.bass.amed.configuration;

import com.bass.amed.common.Constants;
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
import java.util.Set;

@Component
public class CustomAuthenticationManager implements AuthenticationManager
{

    private static final Logger            LOGGER = LoggerFactory.getLogger(CustomAuthenticationManager.class);
    private final        SrcUserRepository srcUserRepository;
    private final        LdapContextSource ldapContextSource;
    LdapAuthenticationProvider provider = null;

    @Value("${ldap.base_search_user}")
    private String LDAP_BASE_USER_SEARCH;
    @Value("${ldap.user_domain_suffix}")
    private String USER_DOMAIN_SUFFIX;


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

        String ldapUsername = authentication.getPrincipal().toString() + USER_DOMAIN_SUFFIX;

        ldapContextSource.setUserDn(ldapUsername);
        ldapContextSource.setPassword(authentication.getCredentials().toString());

        BindAuthenticator bindAuth = new BindAuthenticator(ldapContextSource);

        AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectclass", "person"));
        filter.and(new EqualsFilter("userPrincipalName", ldapUsername));

        FilterBasedLdapUserSearch userSearch = new FilterBasedLdapUserSearch(LDAP_BASE_USER_SEARCH, filter.encode(), ldapContextSource);
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
        provider.setHideUserNotFoundExceptions(false);
        provider.setUserDetailsContextMapper(new UserDetailsContextMapper()
        {
            @Override
            public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> clctn)
            {

                String dn = ctx.getNameInNamespace();

                LOGGER.debug("Mapping user details from context with DN: " + dn);

                String                  user1  = username.replace(USER_DOMAIN_SUFFIX, Constants.DEFAULT_VALUES.STR_EMPTY);
                Optional<ScrUserEntity> isUser = srcUserRepository.findOneWithAuthoritiesByUsername(user1);
                final ScrUserEntity     user   = isUser.orElseThrow(() -> new UsernameNotFoundException(username + " nu este configurat in BD locala"));

                final Set<ScrRoleEntity> srcRole = user.getSrcRole();
                if (srcRole.isEmpty())
                {
                    throw new UsernameNotFoundException("Nu s-a gasit nici un role p/u utilizatorul: " + user1);
                }

                LdapUserDetailsImpl.Essence essence = new LdapUserDetailsImpl.Essence();
                essence.setDn(dn);
                essence.setUsername(authentication.getPrincipal().toString());

                boolean hasAuthoritiesConfig = false;
                for (ScrRoleEntity role : srcRole)
                {
                    GrantedAuthority grantedRoleAuthority = new SimpleGrantedAuthority(role.getRoleCode());
                    essence.addAuthority(grantedRoleAuthority);

                    for (ScrAuthorityEntity authority : role.getAuthorities())
                    {
                        GrantedAuthority grantedRightAuthority = new SimpleGrantedAuthority(authority.getCode());
                        essence.addAuthority(grantedRightAuthority);
                        hasAuthoritiesConfig = true;
                    }
                }

                if (!hasAuthoritiesConfig)
                {
                    throw new UsernameNotFoundException("nu aveti nici o autoritate configurata!!!");
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
