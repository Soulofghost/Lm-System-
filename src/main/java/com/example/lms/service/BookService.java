package com.example.lms.service;

import com.example.lms.dto.BookRequest;
import com.example.lms.entity.Book;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.AuthorRepository;
import com.example.lms.repository.BookRepository;
import com.example.lms.repository.CategoryRepository;
import com.example.lms.repository.PublisherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {
    private final BookRepository books;
    private final CategoryRepository categories;
    private final AuthorRepository authors;
    private final PublisherRepository publishers;

    public BookService(BookRepository books, CategoryRepository categories, AuthorRepository authors, PublisherRepository publishers) {
        this.books = books;
        this.categories = categories;
        this.authors = authors;
        this.publishers = publishers;
    }

    public List<Book> findAll() {
        return books.findAll();
    }

    public Book findById(Long id) {
        return books.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
    }

    @Transactional
    public Book create(BookRequest request) {
        Book book = new Book();
        apply(book, request);
        return books.save(book);
    }

    @Transactional
    public Book update(Long id, BookRequest request) {
        Book book = findById(id);
        int issuedCopies = book.getTotalCopies() - book.getAvailableCopies();
        if (request.getTotalCopies() < issuedCopies) {
            throw new IllegalStateException("Total copies cannot be lower than currently issued copies");
        }
        apply(book, request);
        return books.save(book);
    }

    public void delete(Long id) {
        books.delete(findById(id));
    }

    private void apply(Book book, BookRequest request) {
        if (request.getAvailableCopies() > request.getTotalCopies()) {
            throw new IllegalStateException("Available copies cannot exceed total copies");
        }
        book.setTitle(request.getTitle());
        book.setIsbn(blankToNull(request.getIsbn()));
        book.setCategory(categories.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        book.setAuthor(authors.findById(request.getAuthorId()).orElseThrow(() -> new ResourceNotFoundException("Author not found")));
        book.setPublisher(publishers.findById(request.getPublisherId()).orElseThrow(() -> new ResourceNotFoundException("Publisher not found")));
        book.setEdition(request.getEdition());
        book.setPublicationYear(request.getPublicationYear());
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(request.getAvailableCopies());
        book.setShelfLocation(request.getShelfLocation());
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
