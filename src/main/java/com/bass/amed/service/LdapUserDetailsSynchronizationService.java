package com.bass.amed.service;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.LdapUserDetailsDTO;
import com.bass.amed.entity.NmLdapUserStatusEntity;
import com.bass.amed.entity.ScrRoleEntity;
import com.bass.amed.entity.ScrUserEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.NmLdapUserStatusRepository;
import com.bass.amed.repository.ScrRoleRepository;
import com.bass.amed.repository.SrcUserRepository;
import com.bass.amed.utils.UserAttributeMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class LdapUserDetailsSynchronizationService
{
    @Autowired
    NmLdapUserStatusRepository nmLdapUserStatusRepository;
    @Autowired
    LdapContextSource          ldapContextSource;
    List<ScrRoleEntity> newRoles;
    @Autowired
    private LdapTemplate      ldapTemplate;
    @Autowired
    private SrcUserRepository srcUserRepository;
    @Autowired
    private ScrRoleRepository scrRoleRepository;
    @Value("${ldap.user_search_dn}")
    private String            LDAP_USER_SEARCH_DN;

    @Transactional
    public List<ScrUserEntity> synchronizeLdapUsers() throws CustomException
    {
        if(ldapContextSource.getPassword().isEmpty())
        {
            throw new CustomException("test", HttpStatus.UNAUTHORIZED);
        }
        List<LdapUserDetailsDTO> ldapUserDetails = getAllLdapUserDetails();
        newRoles = syncronizeRoles(ldapUserDetails);
        List<ScrUserEntity> newUsers = syncronizeUsers(ldapUserDetails);

        return newUsers; // "Sincronizarea a fost efectuata cu succes!"
    }

    private List<LdapUserDetailsDTO> getAllLdapUserDetails()
    {
        AndFilter andFilter = new AndFilter();
        andFilter.and(new EqualsFilter("objectclass", "person"));

        List<LdapUserDetailsDTO> userDetailsResult = ldapTemplate.search(LDAP_USER_SEARCH_DN, andFilter.encode(), new UserAttributeMapper());

        //userDetailsResult.removeIf(elem -> !Constants.LDAP_ENABLED_ACCOUNT_STATUS.isAccountEnabled(elem.getUserAccountControl()));
        //        Map<String, Long> result = userDetailsResult.stream().collect(Collectors.groupingBy(LdapUserDetailsDTO::getUserAccountControl, Collectors.counting()));
        //        System.out.println(result);

        userDetailsResult.removeIf(elem -> !Constants.LDAP_ENABLED_ACCOUNT_STATUS.isAccountEnabled(elem.getUserAccountControl()) || elem.getRoles() == null);

        return userDetailsResult;

    }

    private List<ScrRoleEntity> syncronizeRoles(List<LdapUserDetailsDTO> ldapUserDetails)
    {
        Set<ScrRoleEntity> result =
                ldapUserDetails.stream().map(LdapUserDetailsDTO::getRoles).flatMap(roleList -> roleList.stream())
                        .map(role -> new ScrRoleEntity(role.substring(5), role)).collect(Collectors.toSet());

        List<ScrRoleEntity> scrRoleDetails = scrRoleRepository.findAll();

        result.forEach(roleItem -> {
            if (!scrRoleDetails.contains(roleItem))
            {
                scrRoleDetails.add(roleItem);
            }
        });

        return scrRoleRepository.saveAll(scrRoleDetails);
    }

    private List<ScrUserEntity> syncronizeUsers(List<LdapUserDetailsDTO> ldapUserDetails) throws CustomException
    {
        Set<ScrUserEntity> scrUserEntities = srcUserRepository.findAllUsersWithRoles();

        for (LdapUserDetailsDTO ldapUserDetailsDTO : ldapUserDetails)
        {
            boolean userDoesntExist = true;
            for (ScrUserEntity scrUserEntity : scrUserEntities)
            {
                if (scrUserEntity.getUsername().equals(ldapUserDetailsDTO.getUsername()))
                {
                    userDoesntExist = false;
                    ldapUserDetailsDTO.getRoles().removeIf(role -> scrUserEntity.getSrcRole().contains(role));
                    prepareUserEntity(ldapUserDetailsDTO, scrUserEntity);
                    continue;
                }
            }
            if (userDoesntExist)
            {
                ScrUserEntity newUserEntity = new ScrUserEntity();

                prepareUserEntity(ldapUserDetailsDTO, newUserEntity);
                scrUserEntities.add(newUserEntity);
            }
        }
        return srcUserRepository.saveAll(scrUserEntities);
    }

    private void prepareUserEntity(LdapUserDetailsDTO ldapUserDetailsDTO, ScrUserEntity scrUserEntity) throws CustomException
    {
        scrUserEntity.setDepartmentChief(!ldapUserDetailsDTO.getTitle().isEmpty());
        scrUserEntity.setEmail(ldapUserDetailsDTO.getEmail());
        scrUserEntity.setFirstName(ldapUserDetailsDTO.getFirstName());
        scrUserEntity.setFullname(ldapUserDetailsDTO.getFullName());
        scrUserEntity.setLastName(ldapUserDetailsDTO.getLastName());
        scrUserEntity.setPhoneNumber(ldapUserDetailsDTO.getTelephoneNumber());
        scrUserEntity.setUsername(ldapUserDetailsDTO.getUsername());
        scrUserEntity.setUserGroup(ldapUserDetailsDTO.getUserGroup());

        final String statusCode = ldapUserDetailsDTO.getUserAccountControl();

        List<NmLdapUserStatusEntity> nmLdapUserStatusEntities = retrieveLdapUserStatus();

        scrUserEntity.setNmLdapUserStatusEntity(nmLdapUserStatusEntities.stream()
                .filter(statusObj -> String.valueOf(statusObj.getCod()).equals(statusCode)).findFirst()
                .orElseThrow(() -> new CustomException("Nu s-a gasit nici statut in tabel nm_ldap_user_status p/u: " + statusCode)));

        addOrUpdateUserRoles(ldapUserDetailsDTO, scrUserEntity.getSrcRole());

    }

    private void addOrUpdateUserRoles(LdapUserDetailsDTO ldapUserDetailsDTO, Set<ScrRoleEntity> currentUserRoles)
    {
        List<String> ldapUserRoles = ldapUserDetailsDTO.getRoles();
        for (ScrRoleEntity roleItem : newRoles)
        {
            if (!currentUserRoles.contains(roleItem) && ldapUserRoles.contains(roleItem.getRoleCode()))
            {
                currentUserRoles.add(roleItem);
            }
        }
    }

    public List<NmLdapUserStatusEntity> retrieveLdapUserStatus()
    {
        return nmLdapUserStatusRepository.findAll();
    }
}
