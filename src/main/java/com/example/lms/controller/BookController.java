package com.example.lms.controller;

import com.example.lms.dto.BookRequest;
import com.example.lms.entity.Book;
import com.example.lms.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService books;

    public BookController(BookService books) {
        this.books = books;
    }

    @GetMapping
    List<Book> all() { return books.findAll(); }

    @GetMapping("/{id}")
    Book one(@PathVariable Long id) { return books.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Book create(@Valid @RequestBody BookRequest request) { return books.create(request); }

    @PutMapping("/{id}")
    Book update(@PathVariable Long id, @Valid @RequestBody BookRequest request) { return books.update(id, request); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) { books.delete(id); }
}
