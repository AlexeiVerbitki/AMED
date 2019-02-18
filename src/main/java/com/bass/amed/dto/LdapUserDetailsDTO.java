package com.bass.amed.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class LdapUserDetailsDTO implements Serializable
{
    private String       username;
    private String       email;
    private List<String> roles;
    private String       fullName;
    private String       firstName;
    private String       lastName;
    private String       userGroup;
    private String       userAccountControl;  // 512 544 66048 262656
    private String       telephoneNumber;
    private String       title;
    private boolean      departmentChief = false;


}
