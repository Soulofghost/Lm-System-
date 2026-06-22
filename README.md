# Library Management System

A responsive Library Management System built with Spring Boot, MySQL, HTML5, CSS3, JavaScript, Bootstrap 5, and DataTables.

## Features

- Secure login/logout with Spring Security sessions
- Dashboard with module cards
- CRUD pages for categories, authors, publishers, books, and members
- Book issuing with available-copy validation
- Book returns with days-kept and late-fine calculation
- Searchable, sortable, paginated tables with DataTables

## Requirements

- Java 17+
- Maven 3.9+
- MySQL 8+

## Setup

1. Create the database:

```sql
CREATE DATABASE IF NOT EXISTS library_management_system;
```

2. Update database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=change_me
```

3. Start the app:

```bash
mvn spring-boot:run
```

4. Open the site:

```text
http://localhost:8080
```

Default login:

```text
Username: admin
Password: admin123
```

Spring Boot will create/update tables automatically through JPA. The full SQL schema is also available in `schema.sql` if you prefer to initialize MySQL manually.

For deployment steps, see `DEPLOYMENT.md`.
