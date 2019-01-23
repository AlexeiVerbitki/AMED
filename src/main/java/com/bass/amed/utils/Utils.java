package com.bass.amed.utils;

import com.bass.amed.entity.MedicamentDivisionHistoryEntity;
import com.bass.amed.entity.MedicamentEntity;

import java.util.Random;

public final class Utils
{
    public static String generateMedicamentCode()
    {
        int leftLimit = 48; // letter '0'
        int rightLimit = 57; // letter '9'
        int targetStringLength = 10;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++)
        {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }

    public static boolean areDivisionsEquals(MedicamentEntity medicament, MedicamentEntity medDB)
    {
        return ((medicament.getDivision() == null && medDB.getDivision() == null) || (medicament.getDivision() != null && medicament.getDivision().equals(medDB.getDivision())))
                &&
                ((medicament.getVolume() == null && medDB.getVolume() == null) || (medicament.getVolume() != null && medicament.getVolume().equals(medDB.getVolume())))
                &&
                ((medicament.getVolumeQuantityMeasurement() == null && medDB.getVolumeQuantityMeasurement() == null)) || (medicament.getVolumeQuantityMeasurement() != null && medicament.getVolumeQuantityMeasurement().equals(medDB.getVolumeQuantityMeasurement()));
    }

    public static boolean areDivisionHistoryEqualsWithMedicament(MedicamentDivisionHistoryEntity divisionHistory, MedicamentEntity med)
    {
        return ((divisionHistory.getDescription() == null && med.getDivision() == null) || (divisionHistory.getDescription() != null && divisionHistory.getDescription().equals(med.getDivision())))
                &&
                ((divisionHistory.getVolume() == null && med.getVolume() == null) || (divisionHistory.getVolume() != null && divisionHistory.getVolume().equals(med.getVolume())))
                &&
                ((divisionHistory.getVolumeQuantityMeasurement() == null && med.getVolumeQuantityMeasurement() == null)) || (divisionHistory.getVolumeQuantityMeasurement() != null && divisionHistory.getVolumeQuantityMeasurement().equals(med.getVolumeQuantityMeasurement()));
    }

    public static String getConcatenatedDivisionHistory(MedicamentDivisionHistoryEntity division)
    {
        String concatenatedDivision = "";
        if (division.getDescription() != null && division.getDescription().length() > 0 && division.getVolume() != null && division.getVolume().length() > 0 &&
                division.getVolumeQuantityMeasurement() != null && division.getVolumeQuantityMeasurement().getDescription().length() > 0)
        {
            concatenatedDivision = concatenatedDivision + division.getDescription() + ' ' + division.getVolume() + ' ' + division.getVolumeQuantityMeasurement().getDescription();
        }
        else if (division.getVolume() != null && division.getVolume().length() > 0 &&
                division.getVolumeQuantityMeasurement() != null && division.getVolumeQuantityMeasurement().getDescription().length() > 0)
        {
            concatenatedDivision = concatenatedDivision + division.getVolume() + ' ' + division.getVolumeQuantityMeasurement().getDescription();
        }
        else
        {
            concatenatedDivision = concatenatedDivision + division.getDescription();
        }
        return concatenatedDivision;
    }

    public static String getConcatenatedDivision(MedicamentEntity med) {
        String concatenatedDivision = "";
        if (med.getDivision()!=null && med.getDivision().length()>0 && med.getVolume()!=null && med.getVolume().length()>0 &&
                med.getVolumeQuantityMeasurement()!=null && med.getVolumeQuantityMeasurement().getDescription().length()>0) {
            concatenatedDivision = concatenatedDivision + med.getDivision() + ' ' + med.getVolume() + ' ' + med.getVolumeQuantityMeasurement().getDescription();
        } else if (med.getVolume()!=null && med.getVolume().length()>0 &&
                med.getVolumeQuantityMeasurement()!=null && med.getVolumeQuantityMeasurement().getDescription().length()>0) {
            concatenatedDivision = concatenatedDivision + med.getVolume() + ' ' + med.getVolumeQuantityMeasurement().getDescription();
        } else {
            concatenatedDivision = concatenatedDivision + med.getDivision();
        }
        return concatenatedDivision;
    }

    public static String getVariationTypeStr(String variationType)
    {
        String variationTypeStr = "";
        switch (variationType)
        {
            case "I" : variationTypeStr = "Tip I"; break;
            case "II" : variationTypeStr = "Tip II"; break;
            case "C" : variationTypeStr = "Transfer de certificat"; break;
        }
        return  variationTypeStr;
    }
}
