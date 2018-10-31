package com.bass.amed.projection;

import java.time.LocalDateTime;

public interface TaskProjection
{
    Integer getRequestNumber();
    LocalDateTime getSartDate();
    LocalDateTime getEndDate();
    String getProcessName();
    String getRequestType();
    String getStep();
    String getNavigationUrl();
    String getUsername();
}
