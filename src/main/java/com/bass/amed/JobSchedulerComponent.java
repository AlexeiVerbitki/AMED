package com.bass.amed;

import com.bass.amed.dto.ScheduledModuleRequest;
import com.bass.amed.dto.ScheduledModuleResponse;
import com.bass.amed.entity.ScrUserEntity;
import com.bass.amed.repository.SrcUserRepository;
import com.bass.amed.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class JobSchedulerComponent
{

    @Value("${scheduler.rest.api.host}")
    private String schedulerRestApiHost;

    @Autowired
    private SrcUserRepository srcUserRepository;

    public ResponseEntity<String> jobUnschedule(String methodName, int requestId) {
        RestTemplate        restTemplate = new RestTemplate();
        Map<String, Object> mapRequest   = new HashMap<>();
        mapRequest.put("requestId", requestId);
        mapRequest.put("methodName", methodName);
        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromUriString(schedulerRestApiHost + "/unscheduleWaitingJob").queryParam("requestId", requestId)
                .queryParam("methodName", methodName);
        return restTemplate.getForEntity(uriComponentsBuilder.toUriString(), String.class);
    }

    public ResponseEntity<ScheduledModuleResponse> jobSchedule(int scheduledTime, String criticalMethodName, String expiredMethodName, int requestId, String requestNumber,
                                                                      Integer entityId) {
        RestTemplate restTemplate = new RestTemplate();
        ScheduledModuleRequest scheduledModuleRequest = new ScheduledModuleRequest();

        String email = "";
        if (SecurityUtils.getCurrentUser().isPresent())
        {
            ScrUserEntity scrUserEntity = srcUserRepository.findOneWithAuthoritiesByUsername(SecurityUtils.getCurrentUser().get()).get();
            email = scrUserEntity.getEmail();
        }
        scheduledModuleRequest.setEmail(email);
        scheduledModuleRequest.setExpirationDateTime(LocalDateTime.now().plusDays(scheduledTime));
        scheduledModuleRequest.setCriticalMethodName(criticalMethodName);
        scheduledModuleRequest.setExpiredMethodName(expiredMethodName);
        scheduledModuleRequest.setRequestId(requestId);
        scheduledModuleRequest.setRequestNumber(requestNumber);
        scheduledModuleRequest.setEntityId(entityId);
        return restTemplate.postForEntity(schedulerRestApiHost + "/scheduleModuleWaitTimeout", scheduledModuleRequest,
                ScheduledModuleResponse.class);
    }

    public ResponseEntity<ScheduledModuleResponse> jobSchedule(int scheduledTime, String criticalMethodName, String expiredMethodName, int requestId, String requestNumber,
                                                                      Integer entityId, String mailBody) {

        RestTemplate           restTemplate           = new RestTemplate();
        ScheduledModuleRequest scheduledModuleRequest = new ScheduledModuleRequest();
        String email = "";
        if (SecurityUtils.getCurrentUser().isPresent())
        {
            ScrUserEntity scrUserEntity = srcUserRepository.findOneWithAuthoritiesByUsername(SecurityUtils.getCurrentUser().get()).get();
            email = scrUserEntity.getEmail();
        }
        scheduledModuleRequest.setEmail(email);
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
