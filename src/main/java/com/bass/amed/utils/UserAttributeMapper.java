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

        Attribute username = attributes.get("userPrincipalName");
        if (username != null)
        {
            ldapUserDetailsDTO.setEmail((String) username.get());
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
                String[] groupIdentity = groupList.nextElement().toString().split(",");
                roles.add(groupIdentity[0]);
            }
            ldapUserDetailsDTO.setRoles(roles);
        }

        Attribute userGroup = attributes.get("distinguishedName");
        if (userGroup != null)
        {
            String[] arrayOfGroups = ((String) userGroup.get()).split(",");
            ldapUserDetailsDTO.setUserGroup(arrayOfGroups[1]);
        }

        Attribute telephoneNumber = attributes.get("telephoneNumber");
        if (telephoneNumber != null)
        {
            ldapUserDetailsDTO.setTelephoneNumber((String) telephoneNumber.get());
        }

        Attribute title = attributes.get("title");
        if (title != null)
        {
            final String titleValue = (String) title.get();
            ldapUserDetailsDTO.setTitle(titleValue);
            ldapUserDetailsDTO.setDepartmentChief(!titleValue.isEmpty());
        }
        return ldapUserDetailsDTO;
    }
}
