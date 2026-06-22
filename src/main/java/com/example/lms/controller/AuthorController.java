package com.example.lms.controller;

import com.example.lms.entity.Author;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.AuthorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {
    private final AuthorRepository authors;

    public AuthorController(AuthorRepository authors) {
        this.authors = authors;
    }

    @GetMapping
    List<Author> all() { return authors.findAll(); }

    @GetMapping("/{id}")
    Author one(@PathVariable Long id) {
        return authors.findById(id).orElseThrow(() -> new ResourceNotFoundException("Author not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Author create(@Valid @RequestBody Author author) { return authors.save(author); }

    @PutMapping("/{id}")
    Author update(@PathVariable Long id, @Valid @RequestBody Author request) {
        Author author = one(id);
        author.setName(request.getName());
        author.setEmail(request.getEmail());
        author.setPhone(request.getPhone());
        author.setBiography(request.getBiography());
        return authors.save(author);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) { authors.delete(one(id)); }
}
