package com.bass.amed;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication
public class AmedApplication
{
    public static void main(String[] args)
    {
        SpringApplication app = new SpringApplication(AmedApplication.class);
        app.setBannerMode(Banner.Mode.OFF);

        app.run(args);
    }


}
