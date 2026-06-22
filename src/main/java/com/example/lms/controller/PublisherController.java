package com.example.lms.controller;

import com.example.lms.entity.Publisher;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.PublisherRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publishers")
public class PublisherController {
    private final PublisherRepository publishers;

    public PublisherController(PublisherRepository publishers) {
        this.publishers = publishers;
    }

    @GetMapping
    List<Publisher> all() { return publishers.findAll(); }

    @GetMapping("/{id}")
    Publisher one(@PathVariable Long id) {
        return publishers.findById(id).orElseThrow(() -> new ResourceNotFoundException("Publisher not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Publisher create(@Valid @RequestBody Publisher publisher) { return publishers.save(publisher); }

    @PutMapping("/{id}")
    Publisher update(@PathVariable Long id, @Valid @RequestBody Publisher request) {
        Publisher publisher = one(id);
        publisher.setName(request.getName());
        publisher.setEmail(request.getEmail());
        publisher.setPhone(request.getPhone());
        publisher.setAddress(request.getAddress());
        return publishers.save(publisher);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) { publishers.delete(one(id)); }
}
