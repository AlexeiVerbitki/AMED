package com.bass.amed.utils;

import com.bass.amed.dto.LdapUserDetailsDTO;
import org.springframework.ldap.core.AttributesMapper;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import java.util.ArrayList;
import java.util.List;


public class UserAttributeMapper implements AttributesMapper
{
    @Override
    public Object mapFromAttributes(Attributes attributes) throws NamingException
    {
        LdapUserDetailsDTO ldapUserDetailsDTO = new LdapUserDetailsDTO();

        Attribute userAccountControl = attributes.get("userAccountControl");
        if (userAccountControl != null)
        {
            ldapUserDetailsDTO.setUserAccountControl((String) userAccountControl.get());
        }

        Attribute username = attributes.get("sAMAccountName");
        if (username != null)
        {
            ldapUserDetailsDTO.setUsername((String) username.get());
        }

        Attribute mail = attributes.get("mail");
        if (mail != null)
        {
            ldapUserDetailsDTO.setEmail((String) mail.get());
        }

        Attribute fullName = attributes.get("name");
        if (fullName != null)
        {
            ldapUserDetailsDTO.setFullName((String) fullName.get());
        }

        Attribute firstName = attributes.get("givenName");
        if (firstName != null)
        {
            ldapUserDetailsDTO.setFirstName((String) firstName.get());
        }

        Attribute lastName = attributes.get("sn");
        if (lastName != null)
        {
            ldapUserDetailsDTO.setLastName((String) lastName.get());
        }

        Attribute role = attributes.get("memberOf");
        if (role != null)
        {
            List<String>      roles     = new ArrayList<>();
            NamingEnumeration groupList = role.getAll();
            while (groupList.hasMoreElements())
            {
                String[] groupIdentity    = groupList.nextElement().toString().split(",");
                String   preparedRoleCode = ("ROLE_" + groupIdentity[0].substring(3)).toUpperCase();
                roles.add(preparedRoleCode);
            }
            ldapUserDetailsDTO.setRoles(roles);
        }

        Attribute userGroup = attributes.get("distinguishedName");
        if (userGroup != null)
        {
            String[] arrayOfGroups     = ((String) userGroup.get()).split(",");
            String   preparedRoleGroup = arrayOfGroups[1].substring(3);
            ldapUserDetailsDTO.setUserGroup(preparedRoleGroup);
        }

        Attribute telephoneNumber = attributes.get("telephoneNumber");
        if (telephoneNumber != null)
        {
            ldapUserDetailsDTO.setTelephoneNumber((String) telephoneNumber.get());
        }

        Attribute title = attributes.get("title");
        ldapUserDetailsDTO.setDepartmentChief(title == null ? false : true);
        ldapUserDetailsDTO.setTitle(title == null ? "" : (String) title.get());

        return ldapUserDetailsDTO;
    }
}
