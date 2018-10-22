package com.bass.amed.controller.rest;

import com.bass.amed.dto.DistributionDispositionDTO;
import com.bass.amed.exception.CustomException;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentsController
{
    private static final Logger logger = LoggerFactory.getLogger(DocumentsController.class);

    @Autowired
    private StorageService storageService;
    @Autowired
    private GenerateDocNumberService generateDocNumberService;

    @Value("${final.documents.folder}")
    private String folder;

    @RequestMapping(value = "/pushFile", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FileResult> pushFileToServer(@RequestParam("file") MultipartFile file, @RequestParam("nrCerere") String nrCerere) throws CustomException
    {
        logger.debug("Store file with name=" + file.getOriginalFilename());
        StringBuilder sb = new StringBuilder(folder);
        sb.append("/");
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date date = new Date();
        sb.append(sdf.format(date));
        sb.append("/");
        sb.append(nrCerere);
        //        sb.append(date.getTime());

        storageService.store(sb.toString(), file);
        FileResult fr = new FileResult();
        fr.setPath(sb.append("/").append(file.getOriginalFilename()).toString());
        return new ResponseEntity<>(fr, HttpStatus.OK);

    }


    @RequestMapping(value = "/removeFile", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removeFile(@RequestParam("relativeFolder") String relativeFolder) throws CustomException
    {
        logger.debug("Remove files for folder=" + relativeFolder);
        storageService.remove(relativeFolder);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/generate-distribution-disposition", method = RequestMethod.GET)
    public ResponseEntity<String> generateDistributionDisposition(@RequestParam(value = "nrCerere") String nrCerere) throws CustomException, IOException
    {
        logger.debug("Generate Distribution Disposition");

        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");

        List<DistributionDispositionDTO> dataList = new ArrayList();
        DistributionDispositionDTO obj = new DistributionDispositionDTO();
        obj.setDispositionDate(Calendar.getInstance().getTime());
        String nrDisposition=String.valueOf(generateDocNumberService.getDocumentNumber());
        obj.setNrDisposition(nrDisposition);
        obj.setPath(res.getFile().getAbsolutePath());
        dataList.add(obj);

        StringBuilder sb = new StringBuilder(folder);
        sb.append("/");
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date date = new Date();
        sb.append(sdf.format(date));
        sb.append("/");
        sb.append(nrCerere);
        sb.append("/");
        sb.append("Dispozitie de distribuire Nr." + nrDisposition+ ".pdf");

        storageService.storePDFFile(dataList,sb.toString());

        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    }

    @RequestMapping(value = "/view-document", method = RequestMethod.GET)
    public ResponseEntity<InputStreamResource> generateBon(@RequestParam(value = "relativePath") String relativePath, HttpServletRequest request) throws FileNotFoundException
    {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + relativePath.substring(relativePath.lastIndexOf("/") + 1));

        File file = storageService.loadFile(relativePath);

        InputStreamResource isr = new InputStreamResource(new FileInputStream(file));

        // Try to determine file's content type
        String contentType = null;
        try
        {
            contentType = request.getServletContext().getMimeType(file.getAbsolutePath());
        }
        catch (Exception ex)
        {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null)
        {
            contentType = "application/octet-stream";
        }       

        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(contentType)).body(isr);
    }


    static class FileResult
    {

        private String path;

        public String getPath()
        {
            return path;
        }

        public FileResult setPath(String path)
        {
            this.path = path;
            return this;
        }
    }

}
