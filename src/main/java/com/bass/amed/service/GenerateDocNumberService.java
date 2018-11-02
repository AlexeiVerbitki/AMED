package com.bass.amed.service;


public interface GenerateDocNumberService
{
    public Integer getDocumentNumber();
    default Integer getRandomNumber(){
        return (int)(Math.random() * 10000);
    }
}
