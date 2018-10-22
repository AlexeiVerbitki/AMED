package com.bass.amed;

import com.bass.amed.entity.*;
import com.bass.amed.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SpringBootApplication
public class AmedApplication implements CommandLineRunner {
    @Autowired
    private ScrRoleRepository scrRoleRepository;

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(AmedApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.run(args);
    }

    @Override
    public void run(String... args) throws Exception {
    }
}
