package com.bass.amed.service;

import com.bass.amed.dto.xchange.ValCurs;
import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.repository.CurrencyHistoryRepository;
import com.bass.amed.repository.CurrencyRepository;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class XchangeUpdateService {

    private Unmarshaller unmarshaller;

    private Date today = new Date();
    SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");

    @Autowired
    private CurrencyHistoryRepository currenciesHistoryRepository;
    @Autowired
    private CurrencyRepository currencyRepository;

    public void updateCurrencies() {
        ValCurs currencies = getTodayXchangeRates();

        if(currencies != null) {
            List<NmCurrenciesHistoryEntity> nmCurrencies = valCursToNm(currencies);
            currenciesHistoryRepository.saveAll(nmCurrencies);
        }
    }

    public ValCurs getTodayXchangeRates() {
        try {
            JAXBContext jc = JAXBContext.newInstance(ValCurs.class);
            unmarshaller = jc.createUnmarshaller();

            String todayFormatingDate = sdf.format(today);

            String url = "https://www.bnm.md/ro/official_exchange_rates?date=" + todayFormatingDate;

            File file = new File("C:\\Users\\gheorghe.guzun\\Desktop\\official_exchange_rates.xml");

            ValCurs currencies = (ValCurs) unmarshaller.unmarshal(file);//new URL(url));
            return currencies;
        } catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Transactional
    List<NmCurrenciesHistoryEntity> valCursToNm(ValCurs valCurrencies) {
        List<NmCurrenciesHistoryEntity> nmCurrencies = new ArrayList<>(valCurrencies.getValutes().size());

        valCurrencies.getValutes().forEach(c -> {
            NmCurrenciesEntity currency = currencyRepository.findByCode(c.getNumCode());
            NmCurrenciesHistoryEntity currencyHistory = new NmCurrenciesHistoryEntity();
            currencyHistory.setCurrency(currency);
            currencyHistory.setMultiplicity(c.getNominal());
            currencyHistory.setValue(c.getValue());
            currencyHistory.setPeriod(today);
            nmCurrencies.add(currencyHistory);
        });

        return nmCurrencies;
    }

    // oldCurrencies.xls contains currencies exchange from BNM: https://www.bnm.md/bdi/pages/reports/dovre/DOVRE7.xhtml
    public void insertOldBNMCurrencyValuesFromXLS() {
        try {
            File file = new File("C:\\Users\\gheorghe.guzun\\Downloads\\oldCurrencies.xls");
            POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(file));
            HSSFWorkbook wb = new HSSFWorkbook(fs);
            HSSFSheet sheet = wb.getSheetAt(0);
            HSSFRow row;

            int rows;
            rows = sheet.getPhysicalNumberOfRows();

            row = sheet.getRow(1);
            if(row == null) return;

            int collsQuantity = row.getPhysicalNumberOfCells();
            if(collsQuantity < 2) return;
            List<NmCurrenciesHistoryEntity> currencies = new ArrayList<>(collsQuantity * rows);

            for(int col = 1; col < collsQuantity; col++) {
                row = sheet.getRow(2);
                String code = row.getCell(col).getStringCellValue();
                row = sheet.getRow(4);
                double rate = row.getCell(col).getNumericCellValue();
                NmCurrenciesEntity currency = currencyRepository.findByCode(code);
                if(currency == null)
                    continue;

                for(int r = 5; r <= rows; r++) {
                    row = sheet.getRow(r);
                    if(row == null || row.getPhysicalNumberOfCells() < 2)
                        break;
                    double value = row.getCell(col).getNumericCellValue();
                    if(value == 0.0) {
                        continue;
                    }
                    Date date = row.getCell(0).getDateCellValue();

                    NmCurrenciesHistoryEntity curr = new NmCurrenciesHistoryEntity();
                    curr.setPeriod(date);
                    curr.setValue(value);
                    curr.setMultiplicity((int)rate);
                    curr.setCurrency(currency);

                    currencies.add(curr);
                }
            }

            System.out.println("begin");
            currenciesHistoryRepository.saveAll(currencies);
            System.out.println("end");

        } catch(Exception ioe) {
            ioe.printStackTrace();
        }
    }
}