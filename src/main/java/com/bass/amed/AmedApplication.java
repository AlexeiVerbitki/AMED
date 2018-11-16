package com.bass.amed;

import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AmedApplication implements CommandLineRunner
{


    public static void main(String[] args)
    {
        SpringApplication app = new SpringApplication(AmedApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.run(args);
    }

    @Override
    public void run(String... args) throws Exception
    {

    }
}
