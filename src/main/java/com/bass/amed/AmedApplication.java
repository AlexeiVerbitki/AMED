package com.bass.amed;

import org.bouncycastle.util.IPAddress;
import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.util.Properties;

@SpringBootApplication
public class AmedApplication implements CommandLineRunner
{


    public static void main(String[] args) throws UnknownHostException
    {


        SpringApplication app = new SpringApplication(AmedApplication.class);
        app.setBannerMode(Banner.Mode.OFF);

//        Properties properties = new Properties();
//        properties.put("server.address", Inet4Address.getLocalHost().getHostAddress());
//
//        app.setDefaultProperties(properties);
        app.run(args);
    }

    @Override
    public void run(String... args) throws Exception
    {

    }
}
