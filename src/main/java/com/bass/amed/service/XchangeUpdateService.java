package com.bass.amed.service;

import com.bass.amed.dto.xchange.ValCurs;
import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.repository.CurrencyHistoryRepository;
import com.bass.amed.repository.CurrencyRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.time.DateUtils;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.io.FileInputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
public class XchangeUpdateService
{
    SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
    Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Europe/Chisinau"));
    @Autowired
    private CurrencyHistoryRepository currenciesHistoryRepository;
    @Autowired
    private CurrencyRepository        currencyRepository;
    private Unmarshaller              unmarshaller;
    private Date                      today = new Date();
    private Date                      lastUpdatedDate;


    public void execute() throws JAXBException, MalformedURLException
    {
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/Chisinau"));
        today = resetTime(today);

        LOGGER.info("Start updating currency exchange rate");
        lastUpdatedDate = currenciesHistoryRepository.findLastInsertedCurrencyDate();

        if (lastUpdatedDate == null)
        {
            LOGGER.info("Last updated date is null. I Try to extract today's currency rates..");
            lastUpdatedDate = new Date();
            updateCurrencies();
        }
        else if (DateUtils.isSameDay(lastUpdatedDate, today))
        {
            LOGGER.info("DB alredy contains today's currency rates..");
            return;
        }
        else if (lastUpdatedDate.before(today))
        {
            LOGGER.info("DB doesn't contain today's currency rates. Trying to extract...");
            updateCurrencies();
        }
    }

    private void updateCurrencies() throws JAXBException, MalformedURLException
    {
        do
        {
            lastUpdatedDate = addOneDay(lastUpdatedDate);
            calendar.setTime(lastUpdatedDate);
            if(calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY || calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
                LOGGER.info("Escape updating for weekend: " + lastUpdatedDate);
                continue;
            }
            ValCurs currencies = getTodayXchangeRates();

            if (currencies != null)
            {
                List<NmCurrenciesHistoryEntity> nmCurrencies = valCursToNm(currencies);
                currenciesHistoryRepository.saveAll(nmCurrencies);
            }

            LOGGER.info("Updated currency for: " + lastUpdatedDate);
        }
        while (today.after(lastUpdatedDate));
    }

    private ValCurs getTodayXchangeRates() throws JAXBException, MalformedURLException
    {
        JAXBContext jc = JAXBContext.newInstance(ValCurs.class);
        unmarshaller = jc.createUnmarshaller();

        String todayFormatingDate = sdf.format(lastUpdatedDate);

        String url = "https://www.bnm.md/ro/official_exchange_rates?date=" + todayFormatingDate;

        File file = new File("C:\\Users\\gheorghe.guzun\\Desktop\\official_exchange_rates.xml");

        LOGGER.info("Today currency extraction url: " + url);
        ValCurs currencies = (ValCurs) unmarshaller.unmarshal(new URL(url));
        return currencies;
    }

    Date addOneDay(Date date) {
        calendar.setTime(resetTime(date));
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        return calendar.getTime();
    }

    Date resetTime(Date date) {
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }



    @Transactional
    List<NmCurrenciesHistoryEntity> valCursToNm(ValCurs valCurrencies)
    {
        List<NmCurrenciesHistoryEntity> nmCurrencies = new ArrayList<>(valCurrencies.getValutes().size());

        valCurrencies.getValutes().forEach(c -> {
            NmCurrenciesEntity        currency        = currencyRepository.findByCode(c.getNumCode());
            NmCurrenciesHistoryEntity currencyHistory = new NmCurrenciesHistoryEntity();
            currencyHistory.setCurrency(currency);
            currencyHistory.setMultiplicity(c.getNominal());
            currencyHistory.setValue(c.getValue());
            currencyHistory.setPeriod(lastUpdatedDate);
            nmCurrencies.add(currencyHistory);
        });

        return nmCurrencies;
    }


    // oldCurrencies.xls contains currencies exchange from BNM: https://www.bnm.md/bdi/pages/reports/dovre/DOVRE7.xhtml
    public void insertOldBNMCurrencyValuesFromXLS()
    {
        try
        {
            File            file  = new File("C:\\Users\\gheorghe.guzun\\Downloads\\oldCurrencies.xls");
            POIFSFileSystem fs    = new POIFSFileSystem(new FileInputStream(file));
            HSSFWorkbook    wb    = new HSSFWorkbook(fs);
            HSSFSheet       sheet = wb.getSheetAt(0);
            HSSFRow         row;

            int rows;
            rows = sheet.getPhysicalNumberOfRows();

            row = sheet.getRow(1);
            if (row == null)
            {
                return;
            }

            int collsQuantity = row.getPhysicalNumberOfCells();
            if (collsQuantity < 2)
            {
                return;
            }
            List<NmCurrenciesHistoryEntity> currencies = new ArrayList<>(collsQuantity * rows);

            for (int col = 1; col < collsQuantity; col++)
            {
                row = sheet.getRow(2);
                String code = row.getCell(col).getStringCellValue();
                row = sheet.getRow(4);
                double             rate     = row.getCell(col).getNumericCellValue();
                NmCurrenciesEntity currency = currencyRepository.findByCode(code);
                if (currency == null)
                {
                    continue;
                }

                for (int r = 5; r <= rows; r++)
                {
                    row = sheet.getRow(r);
                    if (row == null || row.getPhysicalNumberOfCells() < 2)
                    {
                        break;
                    }
                    double value = 0;
                    try
                    {
                        DataFormatter formatter = new DataFormatter();
                        String        str       = formatter.formatCellValue(row.getCell(col));
                        NumberFormat  nf        = NumberFormat.getInstance(Locale.FRENCH);
                        value = nf.parse(str).doubleValue();
                        //                        value = Double.parseDouble(str );
                        //                        value = row.getCell(col).getNumericCellValue();
                    }
                    catch (IllegalStateException e)
                    {
                        continue;
                    }
                    if (value == 0.0)
                    {
                        continue;
                    }
                    Date date = row.getCell(0).getDateCellValue();

                    NmCurrenciesHistoryEntity curr = new NmCurrenciesHistoryEntity();
                    curr.setPeriod(date);
                    curr.setValue(value);
                    curr.setMultiplicity((int) rate);
                    curr.setCurrency(currency);

                    currencies.add(curr);
                }
            }

            System.out.println("begin currencies saving");
            currenciesHistoryRepository.saveAll(currencies);
            System.out.println("end currencies saving");

        }
        catch (Exception ioe)
        {
            ioe.printStackTrace();
        }
    }
}