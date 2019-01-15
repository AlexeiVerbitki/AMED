package com.bass.amed;

import com.bass.amed.service.XchangeUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.net.UnknownHostException;

@SpringBootApplication
public class AmedApplication implements CommandLineRunner
{

    @Autowired
    XchangeUpdateService xchangeUpdateService;

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
//        xchangeUpdateService.updateCurrencies();
    }
}
