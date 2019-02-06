package com.bass.amed.utils;

import com.bass.amed.dto.ScheduledModuleRequest;
import com.bass.amed.dto.ScheduledModuleResponse;
import com.bass.amed.entity.MedicamentDivisionHistoryEntity;
import com.bass.amed.entity.MedicamentEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public final class Utils {
    public static String generateMedicamentCode(Integer orderNr) {
        LocalDate now = LocalDate.now();
        return "9" + intToString(2, now.getYear() % 100) + intToString(2, now.getMonth().getValue()) + intToString(5, orderNr);
    }

    public static String intToString(int length, int value) {
        String str = String.valueOf(value);
        while (str.length() < length) {
            str = "0" + str;
        }
        return str;
    }

    public static boolean areDivisionsEquals(MedicamentEntity medicament, MedicamentEntity medDB) {
        return ((medicament.getDivision() == null && medDB.getDivision() == null) || (medicament.getDivision() != null && medicament.getDivision().equals(medDB.getDivision())))
                &&
                ((medicament.getVolume() == null && medDB.getVolume() == null) || (medicament.getVolume() != null && medicament.getVolume().equals(medDB.getVolume())))
                &&
                ((medicament.getVolumeQuantityMeasurement() == null && medDB.getVolumeQuantityMeasurement() == null)) || (medicament.getVolumeQuantityMeasurement() != null && medicament.getVolumeQuantityMeasurement().equals(medDB.getVolumeQuantityMeasurement()));
    }

    public static boolean areDivisionHistoryEqualsWithMedicament(MedicamentDivisionHistoryEntity divisionHistory, MedicamentEntity med) {
        return ((divisionHistory.getDescription() == null && med.getDivision() == null) || (divisionHistory.getDescription() != null && divisionHistory.getDescription().equals(med.getDivision())))
                &&
                ((divisionHistory.getVolume() == null && med.getVolume() == null) || (divisionHistory.getVolume() != null && divisionHistory.getVolume().equals(med.getVolume())))
                &&
                ((divisionHistory.getVolumeQuantityMeasurement() == null && med.getVolumeQuantityMeasurement() == null)) || (divisionHistory.getVolumeQuantityMeasurement() != null && divisionHistory.getVolumeQuantityMeasurement().equals(med.getVolumeQuantityMeasurement()));
    }

    public static String getConcatenatedDivisionHistory(MedicamentDivisionHistoryEntity division) {
        String concatenatedDivision = "";
        if (division.getDescription() != null && division.getDescription().length() > 0 && division.getVolume() != null && division.getVolume().length() > 0 &&
                division.getVolumeQuantityMeasurement() != null && division.getVolumeQuantityMeasurement().getDescription().length() > 0) {
            concatenatedDivision = concatenatedDivision + division.getDescription() + ' ' + division.getVolume() + ' ' + division.getVolumeQuantityMeasurement().getDescription();
        } else if (division.getVolume() != null && division.getVolume().length() > 0 &&
                division.getVolumeQuantityMeasurement() != null && division.getVolumeQuantityMeasurement().getDescription().length() > 0) {
            concatenatedDivision = concatenatedDivision + division.getVolume() + ' ' + division.getVolumeQuantityMeasurement().getDescription();
        } else {
            concatenatedDivision = concatenatedDivision + division.getDescription();
        }
        return concatenatedDivision;
    }

    public static String getConcatenatedDivision(MedicamentEntity med) {
        String concatenatedDivision = "";
        if (med.getDivision() != null && med.getDivision().length() > 0 && med.getVolume() != null && med.getVolume().length() > 0 &&
                med.getVolumeQuantityMeasurement() != null && med.getVolumeQuantityMeasurement().getDescription().length() > 0) {
            concatenatedDivision = concatenatedDivision + med.getDivision() + ' ' + med.getVolume() + ' ' + med.getVolumeQuantityMeasurement().getDescription();
        } else if (med.getVolume() != null && med.getVolume().length() > 0 &&
                med.getVolumeQuantityMeasurement() != null && med.getVolumeQuantityMeasurement().getDescription().length() > 0) {
            concatenatedDivision = concatenatedDivision + med.getVolume() + ' ' + med.getVolumeQuantityMeasurement().getDescription();
        } else {
            concatenatedDivision = concatenatedDivision + med.getDivision();
        }
        return concatenatedDivision;
    }

    public static boolean validateIdnp(String idnp) {
        if (idnp.length() != 13 || !isStringDigits(idnp)) {
            return false;
        }

        final int[] weightFunctionConstant = {7, 3, 1};
        int sum = 0;
        int j = 0;

        for (int i = 0; i < (idnp.length() - 1); i++, j++) {
            sum = sum + (Integer.parseInt(String.valueOf(idnp.charAt(i))) * weightFunctionConstant[j]);
            if (weightFunctionConstant.length <= (j + 1)) {
                j = -1;
            }
        }

        int checkSum = sum % 10;
        boolean valid = checkSum == Integer.parseInt(String.valueOf(idnp.charAt(idnp.length() - 1)));

        return valid;
    }

    public static boolean isStringDigits(String str) {
        if (str == null) {
            return false;
        }
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) < '0' || str.charAt(i) > '9') {
                return false;
            }
        }

        return true;
    }

    public static ResponseEntity<String> jobUnschedule(String schedulerRestApiHost, String methodName, int requestId) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> mapRequest = new HashMap<>();
        mapRequest.put("requestId", requestId);
        mapRequest.put("methodName", methodName);
        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromUriString(schedulerRestApiHost + "/unscheduleWaitingJob").queryParam("requestId", requestId)
                .queryParam("methodName", methodName);
        return restTemplate.getForEntity(uriComponentsBuilder.toUriString(), String.class);
    }

    public static ResponseEntity<ScheduledModuleResponse> jobSchedule(int scheduledTime, String criticalMethodName, String expiredMethodName, int requestId, String requestNumber,
                                                                      Integer entityId, String schedulerRestApiHost) {
        RestTemplate restTemplate = new RestTemplate();
        ScheduledModuleRequest scheduledModuleRequest = new ScheduledModuleRequest();
        scheduledModuleRequest.setEmail(SecurityUtils.getCurrentUser().orElse(""));
        scheduledModuleRequest.setExpirationDateTime(LocalDateTime.now().plusDays(scheduledTime));
        scheduledModuleRequest.setCriticalMethodName(criticalMethodName);
        scheduledModuleRequest.setExpiredMethodName(expiredMethodName);
        scheduledModuleRequest.setRequestId(requestId);
        scheduledModuleRequest.setRequestNumber(requestNumber);
        scheduledModuleRequest.setEntityId(entityId);
        return restTemplate.postForEntity(schedulerRestApiHost + "/scheduleModuleWaitTimeout", scheduledModuleRequest,
                ScheduledModuleResponse.class);
    }

    public static ResponseEntity<ScheduledModuleResponse> jobSchedule(int scheduledTime, String criticalMethodName, String expiredMethodName, int requestId, String requestNumber,
                                                                      Integer entityId, String schedulerRestApiHost, String mailBody) {
        RestTemplate restTemplate = new RestTemplate();
        ScheduledModuleRequest scheduledModuleRequest = new ScheduledModuleRequest();
        scheduledModuleRequest.setEmail(SecurityUtils.getCurrentUser().orElse(""));
        scheduledModuleRequest.setMailBody(mailBody);
        scheduledModuleRequest.setExpirationDateTime(LocalDateTime.now().plusDays(scheduledTime));
        scheduledModuleRequest.setCriticalMethodName(criticalMethodName);
        scheduledModuleRequest.setExpiredMethodName(expiredMethodName);
        scheduledModuleRequest.setRequestId(requestId);
        scheduledModuleRequest.setRequestNumber(requestNumber);
        scheduledModuleRequest.setEntityId(entityId);
        return restTemplate.postForEntity(schedulerRestApiHost + "/scheduleModuleWaitTimeout", scheduledModuleRequest,
                ScheduledModuleResponse.class);
    }
}
