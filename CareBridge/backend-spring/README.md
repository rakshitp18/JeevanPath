# MediVault Spring Boot Backend Migration

This repository contains the enterprise Spring Boot backend for MediVault, migrating from the original Node.js/Express implementation.

## Features Implemented
- **Foundation**: Spring Boot, PostgreSQL, Flyway, Common Exceptions/Responses.
- **Authentication**: JWT based Stateless Auth (Login, Register Patient, Register Doctor, Refresh Token).
- **Core User Domain**: Normalized entities for `User`, `Patient`, and `Doctor` using UUIDs.
- **Patient Domain**: Fully normalized Patient profile containing Medical Information, multiple Emergency Contacts, Insurance Information, and Family Members.
- **Provider Domain**: Highly relational Doctor ecosystem including Hospitals, Departments, Doctor Availability, Leaves, and Professional Documents.
- **Appointment Domain**: Smart scheduling engine featuring dynamic slot generation, strict state machine lifecycle, immutable audit history, and QR-based check-ins.
- **Medical Domain**: Comprehensive Digital Health Records, Prescription generation, Medicine Reminders, unified Health Timelines, and AI-powered OCR document extraction.
- **Platform Services**: Event-driven architecture, robust Notification engine, highly-secure and audited Emergency Profile system, Government Scheme module, and aggregated Dashboard APIs.
- **Security**: Method and endpoint-level security via Spring Security. Passwords hashed using BCrypt.

## Architecture

This project strictly follows a **Modular Monolith** pattern with **Clean Architecture** principles.

- **Config**: Contains Spring Bean configurations (Security, Swagger, Cors).
- **Common**: Holds base classes such as `BaseEntity`, and unified response wrappers (`ApiResponse`, `ErrorResponse`).
- **Constants**: Application-wide final strings and Enums.
- **Security**: Contains Spring Security overrides, JWT utilities, and custom entry points.
- **Exception**: A centralized `@RestControllerAdvice` handling all standard and custom exceptions.
- **Util**: Helper methods that do not depend on business logic.
- **Auth/Patient/Doctor**: Feature modules containing specialized Controllers, Services, DTOs, Mappers, Repositories, and Entities.

## Flow of Data
All requests will strictly flow through:
1. `Controller` (Handles HTTP Request, returns standard `ApiResponse<T>`)
2. `Service` (Business logic, transactions)
3. `Repository` (Spring Data JPA)
4. `Entity` (Database mapping via Hibernate)

**Important**: Entities are NEVER exposed to the Controller layer. All input and output must be mapped to DTOs.

## Database
We use **PostgreSQL** and **Flyway**. Hibernate's automatic schema generation is completely disabled to ensure safe, version-controlled migrations in production.

## Running the Application
The active profile defaults to `dev`. 
Ensure PostgreSQL is running and update `application-dev.yml` with your local credentials, or set them via environment variables:
`DB_USER` and `DB_PASSWORD`.

Run:
```bash
mvn spring-boot:run
```

Access Swagger UI at:
`http://localhost:8080/swagger-ui/index.html`
