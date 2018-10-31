package com.bass.amed.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LdapErrorMappingUtils
{
    private static final Logger LOGGER = LoggerFactory.getLogger(LdapErrorMappingUtils.class);
    private static final Pattern SUB_ERROR_CODE = Pattern.compile(".*data\\s([0-9a-f]{3,4}).*");

    // Error codes
    private static final int USERNAME_NOT_FOUND = 0x525;
    private static final int INVALID_PASSWORD = 0x52e;
    private static final int NOT_PERMITTED = 0x530;
    private static final int PASSWORD_EXPIRED = 0x532;
    private static final int ACCOUNT_DISABLED = 0x533;
    private static final int ACCOUNT_EXPIRED = 0x701;
    private static final int PASSWORD_NEEDS_RESET = 0x773;
    private static final int ACCOUNT_LOCKED = 0x775;

    public static String getLdapAuthErrorMessage(String exception)
    {
        int errorCode = parseErrorCode(exception);

        if (errorCode <= 0)
        {
            LOGGER.debug("Failed to locate AD-specific error code in message");
            return exception;
        }
        return codeToLogMessage(errorCode);
    }

    private static int parseErrorCode(String message)
    {
        Matcher m = SUB_ERROR_CODE.matcher(message);

        if (m.matches())
        {
            return Integer.parseInt(m.group(1), 16);
        }

        return -1;
    }

    private static String codeToLogMessage(int code)
    {
        switch (code)
        {
            case USERNAME_NOT_FOUND:
                return "Ldap user was not found in directory";
            case INVALID_PASSWORD:
                return "Ldap password was invalid";
            case NOT_PERMITTED:
                return "Ldap user not permitted to logon at this time";
            case PASSWORD_EXPIRED:
                return "Ldap password has expired";
            case ACCOUNT_DISABLED:
                return "Ldap account is disabled";
            case ACCOUNT_EXPIRED:
                return "Ldap account expired";
            case PASSWORD_NEEDS_RESET:
                return "Ldap user must reset password";
            case ACCOUNT_LOCKED:
                return "Ldap account locked";
        }
        return "Unknown (error code " + Integer.toHexString(code) + ")";
    }
}