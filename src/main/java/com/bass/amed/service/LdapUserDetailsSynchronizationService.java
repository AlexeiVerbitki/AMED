package com.bass.amed.service;

import com.bass.amed.dto.LdapUserDetailsDTO;
import com.bass.amed.entity.ScrUserEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.SrcUserRepository;
import com.bass.amed.utils.UserAttributeMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class LdapUserDetailsSynchronizationService
{
    @Autowired
    private LdapTemplate      ldapTemplate;
    @Autowired
    private SrcUserRepository srcUserRepository;


    @Value("${ldap.user_search_dn}")
    private String LDAP_USER_SEARCH_DN;

    private List<LdapUserDetailsDTO> getAllUserDetails()
    {
        AndFilter andFilter = new AndFilter();
        andFilter.and(new EqualsFilter("objectclass", "person"));

        List<LdapUserDetailsDTO> userDetailsResult = ldapTemplate.search(LDAP_USER_SEARCH_DN, andFilter.encode(), new UserAttributeMapper());

        //        Map<String, Long> result = userDetailsResult.stream().collect(Collectors.groupingBy(LdapUserDetailsDTO::getUserAccountControl, Collectors.counting()));
        //        System.out.println(result);

        return userDetailsResult;
    }

    @Autowired
    private LdapContextSource contextSource;

    public void getUserDetails() throws CustomException
    {
        try
        {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            contextSource.setUserDn("dumitru.ginu@bass.md");
            contextSource.setPassword("Mind2Mind");

            List<LdapUserDetailsDTO> list = getAllUserDetails();
            System.out.println("LDAP users: " + list.toString());

            Set<ScrUserEntity> getUsers = srcUserRepository.findAllUsersWithRoles();
            System.out.println("DB users: " + getUsers);


        }
        catch (Exception e)
        {
            LOGGER.info("Failed to retrieve users", e.getMessage());
            LOGGER.error(e.getMessage(), e);
            throw new CustomException(e.getMessage());
        }


    }

}
