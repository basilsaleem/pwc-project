package com.assignment.pwc.complaintmanagement.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class APIErrorResponse {

    private HttpStatus status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private LocalDateTime timestamp;
    private String message;
    private String path = "/";

    public APIErrorResponse(HttpStatus status, String message) {
        timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
    }


    public int getStatus() {
        return status.value();
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public APIErrorResponse setPath(String path) {
        this.path = path;
        return this;
    }

    @Override
    public String toString() {
        return "{" +
                "'status':" + status +
                ", 'timestamp':" + timestamp +
                ", 'message':'" + message + '\'' +
                ", 'path':'" + path + '\'' +
                '}';
    }

    public String toStringJSON() {
        try {
            return new ObjectMapper().registerModule(new JSR310Module()).writeValueAsString(this);
        } catch (JsonProcessingException e) {
            return toString();
        }
    }
}
