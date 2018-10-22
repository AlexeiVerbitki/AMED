package com.bass.amed.service;

import com.bass.amed.exception.CustomException;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collection;
import java.util.Comparator;

@Service
public class StorageService
{

    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);

    @Value("${root.location.folder}")
    private String rootFolder;


    public void store(String relativeFolder, MultipartFile file) throws CustomException
    {
        Path rootLocation = Paths.get(rootFolder);
        initIfNeeded(rootLocation, relativeFolder);
        try
        {
            Files.copy(file.getInputStream(), rootLocation.resolve(relativeFolder).resolve(file.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e)
        {
            throw new CustomException("Failed to store file!", e);
        }
    }

    public void remove(String relativeFolder)
    {
        Path rootLocation = Paths.get(rootFolder);
        try
        {
            Path dir = rootLocation.resolve(relativeFolder);
            Files.walk(dir)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        }
        catch (Exception e)
        {
            logger.warn(e.getMessage(), e);
        }
    }

    public void moveFile(String relativeFolder) throws CustomException
    {
        Path rootLocation = Paths.get(rootFolder);

        try
        {
            Files.move(rootLocation.resolve(Paths.get(relativeFolder)), rootLocation.resolve(Paths.get("/prod/asd/model.xlsx")), StandardCopyOption.REPLACE_EXISTING);
        }
        catch(IOException e)
        {
            logger.error(e.getMessage(), e);
            throw new CustomException(e.getMessage());
        }

    }
    private void initIfNeeded(Path rootFolder, String relativeFolder) throws CustomException
    {
        try
        {
            Path location = rootFolder.resolve(relativeFolder);
            if (!Files.exists(location))
            {
                Files.createDirectories(location);
            }
        }
        catch (IOException e)
        {
            throw new CustomException("Could not initialize storage!", e);
        }
    }

    public File loadFile(String relativePath)
    {
        Path rootLocation = Paths.get(rootFolder);
        Path relLoc = Paths.get(relativePath);
        File file = rootLocation.resolve(relLoc).toFile();

        return file;
    }

    public void storePDFFile(Collection<?> list, String fileName) throws CustomException
    {
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts\\distributionDisposition.jrxml");
            JasperReport report = JasperCompileManager.compileReport(new FileInputStream(res.getFile()));
            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(list);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, null, beanColDataSource);
            JasperExportManager.exportReportToPdfFile(jasperPrint, rootFolder + "/"+fileName);
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }
    }
}
