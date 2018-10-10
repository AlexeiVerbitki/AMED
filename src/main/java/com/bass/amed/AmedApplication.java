package com.bass.amed;

import com.bass.amed.entity.ScrAuthorityEntity;
import com.bass.amed.entity.ScrRoleEntity;
import com.bass.amed.entity.ScrUserEntity;
import com.bass.amed.repository.ScrAuthorityRepository;
import com.bass.amed.repository.ScrRoleRepository;
import com.bass.amed.repository.SrcUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class AmedApplication implements CommandLineRunner
{
    @Autowired
    private ScrRoleRepository scrRoleRepository;
    @Autowired
    private ScrAuthorityRepository scrAuthorityRepository;
    @Autowired
    private SrcUserRepository srcUserRepository;

    public static void main(String[] args)
    {
        SpringApplication app = new SpringApplication(AmedApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.run(args);
    }

    @Override
    public void run(String... args) throws Exception
    {
        ScrAuthorityEntity authorityEntity1 = new ScrAuthorityEntity();

        authorityEntity1.setCode("ATC3");
        authorityEntity1.setDescription("auth descr3");

        ScrRoleEntity scrRoleEntity1 = new ScrRoleEntity();
        scrRoleEntity1.setRoleCode("RC2");
        scrRoleEntity1.setDescription("role descr 2");
        Set<ScrAuthorityEntity> scrAuthorityEntities = new HashSet<>();
        scrAuthorityEntities.add(authorityEntity1);

        //ScrRoleEntity scrRoleEntity2 = scrRoleRepository.findById(11).get();
        //scrRoleEntity2.setAuthorities(scrAuthorityEntities);
        //scrRoleRepository.save(scrRoleEntity2);

//        ScrRoleEntity scrRoleEntity3 = scrRoleRepository.findById(11).get();
//        ScrUserEntity scrUserEntity3 = new ScrUserEntity();
//        scrUserEntity3.setFullname("hibernate");
//        scrUserEntity3.setUsername("another test");
//        scrUserEntity3.setSrcRole(scrRoleEntity3);
//
//        srcUserRepository.save(scrUserEntity3);



    }
}
