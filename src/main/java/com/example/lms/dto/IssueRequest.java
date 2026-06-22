package com.example.lms.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class IssueRequest {
    @NotNull
    private Long memberId;
    @NotNull
    private Long bookId;
    private LocalDate issueDate;

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
}
