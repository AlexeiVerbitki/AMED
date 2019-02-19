package com.bass.amed.utils;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.Optional;

public final class SecurityUtils
{
    public static Optional<String> getCurrentUser()
    {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
                .map(authentication -> {
                    if (authentication.getPrincipal() instanceof User)
                    {
                        User user = (User) authentication.getPrincipal();
                        return user.getUsername();
                    }
                    else if (authentication.getPrincipal() instanceof String)
                    {
                        return ((String) authentication.getPrincipal());
                    }
                    return null;
                });
    }

    //    @Override
    //    public Optional<LdapUserDetails> getCurrentAuditor()
    //    {
    //        SecurityContext securityContext = SecurityContextHolder.getContext();
    //
    //        return Optional.ofNullable(securityContext.getAuthentication())
    //                .map(authentication -> {
    //                    if (authentication.getPrincipal() instanceof LdapUserDetails)
    //                    {
    //                        return (LdapUserDetails) authentication.getPrincipal();
    //                    }
    //
    //                    return null;
    //                });
    //    }

    //    @Override
    //    public Optional<LdapUserDetails> getCurrentAuditor()
    //    {
    //        LdapUserDetailsImpl.Essence ldapUserDetails = new LdapUserDetailsImpl.Essence();
    //        ldapUserDetails.setDn("bass");
    //
    //        ldapUserDetails.setAccountNonExpired(false);
    //        ldapUserDetails.setUsername("dumitrash");
    //        ldapUserDetails.setPassword("eu hz si pass ii");
    //        ldapUserDetails.setCredentialsNonExpired(false);
    //
    //        return Optional.of(ldapUserDetails.createUserDetails());
    //
    //        //        return Optional.of(new User("dima", "hz", new HashSet<GrantedAuthority>() {}));
    //
    //    }
}
