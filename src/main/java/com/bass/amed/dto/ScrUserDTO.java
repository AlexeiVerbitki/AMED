package com.bass.amed.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ScrUserDTO implements Serializable
{
    private String username;
    private String password;

}
