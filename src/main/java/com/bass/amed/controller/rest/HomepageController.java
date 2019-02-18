package com.bass.amed.controller.rest;

import com.bass.amed.projection.TaskDetailsProjectionDTO;
import com.bass.amed.service.HomepageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/homepage")
public class HomepageController {

    private static final Logger LOGGER = LoggerFactory.getLogger(HomepageController.class);

    @Autowired
    HomepageService homepageService;

    @GetMapping(value = "/get-unfinished-tasks")
    public ResponseEntity<List<TaskDetailsProjectionDTO>> getUnfinishedTasks() {
        LOGGER.debug("Get unfinished tasks");
        List<TaskDetailsProjectionDTO> unfinishedTaskProjections = homepageService.retreiveUnfinishedTask();
        return new ResponseEntity<>(unfinishedTaskProjections, HttpStatus.OK);
    }

}
