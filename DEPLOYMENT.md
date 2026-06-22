# Deployment Guide

This project has two deployable versions:

1. The full Spring Boot + MySQL LMS application.
2. The standalone retro OS preview HTML file.

## Option A: Deploy The Full Spring Boot + MySQL App

Use this for the real LMS with login, database records, CRUD operations, issuing books, returning books, and fines.

### Server Requirements

- Java 17 or newer
- Maven 3.9 or newer
- MySQL 8 or newer
- A VPS/cloud server such as AWS EC2, DigitalOcean, Render, Railway, Azure, or a local server

### 1. Create The Database

Log in to MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS library_management_system;
```

You can also run the full schema from:

```text
schema.sql
```

### 2. Configure Database Credentials

Edit:

```text
src/main/resources/application.properties
```

Set your live MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_management_system?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Also change the default admin password before real deployment:

```properties
lms.default-admin.username=admin
lms.default-admin.password=CHANGE_THIS_PASSWORD
```

### 3. Build The Application

From the project root:

```bash
mvn clean package
```

This creates a `.jar` file inside:

```text
target/
```

### 4. Run The Application

```bash
java -jar target/library-management-system-1.0.0.jar
```

Then open:

```text
http://your-server-ip:8080
```

### 5. Production Notes

For a public deployment, you should ideally:

- Use HTTPS with Nginx or Apache as a reverse proxy.
- Change the default admin password.
- Use a non-root MySQL user.
- Keep database credentials outside source control using environment variables.
- Configure firewall rules to expose only HTTP/HTTPS, not MySQL.

## Option B: Deploy The Retro OS Preview

Use this for a simple UI demo without backend setup. It works as a single HTML file and stores data in the browser using local storage.

Deploy this file:

```text
outputs/LMS-Preview.html
```

You can upload it to:

- GitHub Pages
- Netlify
- Vercel
- Any static web hosting service
- A normal web server folder

Default preview login:

```text
admin / admin123
```

Important: this preview is not a real shared database app. Each browser keeps its own local data.

## Recommended Combined Deployment

For both:

1. Deploy `outputs/LMS-Preview.html` as a quick public demo.
2. Deploy the Spring Boot app separately as the real production system.
3. Share the preview link for UI demonstration.
4. Share the Spring Boot link for actual LMS use.

Example structure:

```text
https://your-demo-site.com              -> Retro preview
https://lms.your-domain.com             -> Real Spring Boot LMS
```

## Vercel Deployment For Retro Preview

Deploy this folder:

```text
outputs/vercel-preview
```

Vercel will serve:

```text
index.html
```

The included `vercel.json` maps the site root to the retro LMS preview.

## Render Deployment For Full Spring Boot App

This project includes:

```text
Dockerfile
render.yaml
```

On Render:

1. Create or connect a Git repository containing this project.
2. Create a new Blueprint from `render.yaml`, or create a new Web Service using Docker.
3. Add a MySQL database. Render commonly provides PostgreSQL directly, so for MySQL use an external MySQL provider such as PlanetScale, Aiven, Railway MySQL, DigitalOcean Managed MySQL, or a VPS MySQL server.
4. Set these environment variables:

```text
DATABASE_URL=jdbc:mysql://HOST:PORT/library_management_system?createDatabaseIfNotExist=true&useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=your_mysql_user
DATABASE_PASSWORD=your_mysql_password
LMS_ADMIN_PASSWORD=change_this_admin_password
```

5. Deploy the service.

After deployment, open the Render service URL and log in with:

```text
admin / your LMS_ADMIN_PASSWORD
```
