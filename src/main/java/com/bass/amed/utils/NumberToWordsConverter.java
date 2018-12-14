package com.bass.amed.utils;

public class NumberToWordsConverter
{
    private static final String[] units = { "", "unu", "doi", "trei", "patru",
            "cinci", "șase", "șapte", "opt", "nouă", "zece", "unsprezece", "doisprezece",
            "treisprezece", "patrusprezece", "cincisprezece", "șasesprezece", "șaptesprezece",
            "optsprezece", "nouăsprezece" };


    public static final String[] tens = {
            "", 		// 0
            "",		// 1
            "douăzeci", 	// 2
            "treizeci", 	// 3
            "patruzeci", 	// 4
            "cincizeci", 	// 5
            "șaizeci", 	// 6
            "șaptezeci",	// 7
            "optzeci", 	// 8
            "nouăzeci" 	// 9
    };

    public static String convert(final double n) {
        int intPart = (int) n;
        String rs1 = convert(intPart);
        double decimalPart = (n - intPart) * 100;
        String rs2 = convert((int)decimalPart);

        String cmp = rs2.isEmpty() ? "" : " și " + rs2 + " bani";


        return rs1 + " lei " + cmp;
    }

    public static String convert(final int n) {
        if (n < 0) {
            return "Minus " + convert(-n);
        }

        if (n < 20) {
            return units[n];
        }

        if (n < 100) {
            return tens[n / 10] + ((n % 10 != 0) ? " " : "") + units[n % 10];
        }

        if (n < 1000) {
            return units[n / 100] + " sute" + ((n % 100 != 0) ? " " : "") + convert(n % 100);
        }

        if (n < 100000) {
            return convert(n / 1000) + " mii" + ((n % 10000 != 0) ? " " : "") + convert(n % 1000);
        }

        if (n < 10000000) {
            return convert(n / 100000) + " sute de mii" + ((n % 100000 != 0) ? " " : "") + convert(n % 100000);
        }

        return convert(n / 10000000) + " milion" + ((n % 10000000 != 0) ? " " : "") + convert(n % 10000000);
    }
}
