package com.example.common.exception;

public class AppException extends RuntimeException {
    
    private final String message;
    private final String details;

    public AppException(String message, String details) {
        super(message);
        this.message = message;
        this.details = details;
    }

    public AppException(String message) {
        this(message, null);
    }

    @Override
    public String getMessage() {
        return message;
    }

    public String getDetails() {
        return details;
    }
}
