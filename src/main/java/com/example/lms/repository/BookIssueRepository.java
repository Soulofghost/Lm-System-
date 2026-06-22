package com.example.lms.repository;

import com.example.lms.entity.BookIssue;
import com.example.lms.entity.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {
    List<BookIssue> findByStatus(IssueStatus status);
}
