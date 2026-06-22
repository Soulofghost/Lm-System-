package com.example.lms.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ReturnRequest {
    @NotNull
    private Long issueId;
    private LocalDate returnDate;

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
}
