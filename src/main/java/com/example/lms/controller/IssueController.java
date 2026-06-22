package com.example.lms.controller;

import com.example.lms.dto.IssueRequest;
import com.example.lms.dto.ReturnRequest;
import com.example.lms.entity.BookIssue;
import com.example.lms.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {
    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping
    List<BookIssue> all() { return issueService.findAll(); }

    @GetMapping("/open")
    List<BookIssue> open() { return issueService.findOpenIssues(); }

    @PostMapping
    BookIssue issue(@Valid @RequestBody IssueRequest request, Authentication authentication) {
        return issueService.issueBook(request, authentication);
    }

    @PostMapping("/return")
    BookIssue returnBook(@Valid @RequestBody ReturnRequest request) {
        return issueService.returnBook(request);
    }
}
