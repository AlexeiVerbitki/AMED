package com.bass.amed.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

public class AmountUtils
{
    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = new BigDecimal(Double.toString(value));
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }


    public static String beautify(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        StringBuilder sb = new StringBuilder("######0");

        if (places > 0)
        {
            sb.append(",");
            for (int i=0;i< places; i++){
                sb.append("0");
            }
        }

        DecimalFormat df = new DecimalFormat(sb.toString());
        DecimalFormatSymbols dfs = df.getDecimalFormatSymbols();

        dfs.setDecimalSeparator(',');
        df.setDecimalFormatSymbols(dfs);
        return df.format(value);
    }
}
