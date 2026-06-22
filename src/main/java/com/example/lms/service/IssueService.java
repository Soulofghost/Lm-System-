package com.example.lms.service;

import com.example.lms.dto.IssueRequest;
import com.example.lms.dto.ReturnRequest;
import com.example.lms.entity.*;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class IssueService {
    private final BookIssueRepository issues;
    private final BookRepository books;
    private final MemberRepository members;
    private final UserRepository users;
    private final FineSettingsRepository settings;

    public IssueService(BookIssueRepository issues, BookRepository books, MemberRepository members, UserRepository users, FineSettingsRepository settings) {
        this.issues = issues;
        this.books = books;
        this.members = members;
        this.users = users;
        this.settings = settings;
    }

    public List<BookIssue> findAll() {
        return issues.findAll();
    }

    public List<BookIssue> findOpenIssues() {
        return issues.findByStatus(IssueStatus.ISSUED);
    }

    @Transactional
    public BookIssue issueBook(IssueRequest request, Authentication authentication) {
        Book book = books.findById(request.getBookId()).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies for this book");
        }

        Member member = members.findById(request.getMemberId()).orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (!member.isActive()) {
            throw new IllegalStateException("Cannot issue books to an inactive member");
        }

        FineSettings fineSettings = currentSettings();
        LocalDate issueDate = request.getIssueDate() == null ? LocalDate.now() : request.getIssueDate();

        BookIssue issue = new BookIssue();
        issue.setBook(book);
        issue.setMember(member);
        issue.setIssueDate(issueDate);
        issue.setDueDate(issueDate.plusDays(fineSettings.getMaxBorrowDays()));
        if (authentication != null) {
            users.findByUsername(authentication.getName()).ifPresent(issue::setIssuedBy);
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        books.save(book);
        return issues.save(issue);
    }

    @Transactional
    public BookIssue returnBook(ReturnRequest request) {
        BookIssue issue = issues.findById(request.getIssueId()).orElseThrow(() -> new ResourceNotFoundException("Issue record not found"));
        if (issue.getStatus() == IssueStatus.RETURNED) {
            throw new IllegalStateException("This book has already been returned");
        }

        LocalDate returnDate = request.getReturnDate() == null ? LocalDate.now() : request.getReturnDate();
        long days = Math.max(0, ChronoUnit.DAYS.between(issue.getIssueDate(), returnDate));
        long overdueDays = Math.max(0, ChronoUnit.DAYS.between(issue.getDueDate(), returnDate));
        BigDecimal fine = currentSettings().getFinePerDay().multiply(BigDecimal.valueOf(overdueDays));

        issue.setReturnDate(returnDate);
        issue.setDaysKept((int) days);
        issue.setFineAmount(fine);
        issue.setStatus(IssueStatus.RETURNED);

        Book book = issue.getBook();
        book.setAvailableCopies(Math.min(book.getTotalCopies(), book.getAvailableCopies() + 1));
        books.save(book);
        return issues.save(issue);
    }

    private FineSettings currentSettings() {
        return settings.findAll().stream().findFirst().orElseGet(() -> {
            FineSettings fineSettings = new FineSettings();
            fineSettings.setMaxBorrowDays(14);
            fineSettings.setFinePerDay(BigDecimal.ONE);
            return settings.save(fineSettings);
        });
    }
}
