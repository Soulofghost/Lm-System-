package com.example.lms.config;

import com.example.lms.entity.*;
import com.example.lms.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository users;
    private final CategoryRepository categories;
    private final AuthorRepository authors;
    private final PublisherRepository publishers;
    private final FineSettingsRepository fineSettings;
    private final PasswordEncoder passwordEncoder;

    @Value("${lms.default-admin.username}")
    private String adminUsername;

    @Value("${lms.default-admin.password}")
    private String adminPassword;

    @Value("${lms.default-admin.name}")
    private String adminName;

    @Value("${lms.fine.default-max-borrow-days}")
    private int maxBorrowDays;

    @Value("${lms.fine.default-fine-per-day}")
    private BigDecimal finePerDay;

    public DataSeeder(
        UserRepository users,
        CategoryRepository categories,
        AuthorRepository authors,
        PublisherRepository publishers,
        FineSettingsRepository fineSettings,
        PasswordEncoder passwordEncoder
    ) {
        this.users = users;
        this.categories = categories;
        this.authors = authors;
        this.publishers = publishers;
        this.fineSettings = fineSettings;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!users.existsByUsername(adminUsername)) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setFullName(adminName);
            admin.setRole(Role.ADMIN);
            users.save(admin);
        }

        if (fineSettings.count() == 0) {
            FineSettings settings = new FineSettings();
            settings.setMaxBorrowDays(maxBorrowDays);
            settings.setFinePerDay(finePerDay);
            fineSettings.save(settings);
        }

        if (categories.count() == 0) {
            Category fiction = new Category();
            fiction.setName("Fiction");
            fiction.setDescription("Fictional books and novels");
            categories.save(fiction);

            Category science = new Category();
            science.setName("Science");
            science.setDescription("Science and research books");
            categories.save(science);
        }

        if (authors.count() == 0) {
            Author author = new Author();
            author.setName("George Orwell");
            author.setEmail("orwell@example.com");
            authors.save(author);
        }

        if (publishers.count() == 0) {
            Publisher publisher = new Publisher();
            publisher.setName("Penguin Books");
            publisher.setEmail("contact@penguin.example");
            publishers.save(publisher);
        }
    }
}
