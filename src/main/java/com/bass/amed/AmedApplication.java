package com.bass.amed;

import com.bass.amed.controller.rest.PriceController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AmedApplication implements CommandLineRunner
{
    @Autowired
    PriceController priceController;

    public static void main(String[] args)
    {
        SpringApplication app = new SpringApplication(AmedApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.run(args);
    }

    @Override
    public void run(String... args) throws Exception
    {
//        ResponseEntity<List<Tuple>> responseEntity = priceController.getPricesByFilter(new PricesDTO());
//        List<Tuple> list = responseEntity.getBody();
    }
}
