---
title: "Building Production-Ready REST APIs with Spring Boot"
date: "2024-09-18"
description: "A practical guide to structuring, validating, and securing REST APIs using Spring Boot — from project setup to deployment-ready code."
tags: ["Java", "Spring Boot", "REST API", "Backend"]
---

# Building Production-Ready REST APIs with Spring Boot

Spring Boot remains the dominant choice for building REST APIs in the Java ecosystem. This guide covers the patterns and practices that separate a production-ready API from a tutorial project.

## Project Structure

A clean package structure matters more than you might think:

```
src/main/java/com/example/api/
├── controller/       # HTTP layer
├── service/          # Business logic
├── repository/       # Data access
├── model/
│   ├── entity/       # JPA entities
│   ├── dto/          # Request/response DTOs
│   └── mapper/       # Entity ↔ DTO mapping
├── exception/        # Custom exceptions & handlers
└── config/           # Security, CORS, etc.
```

Keeping DTOs separate from entities is critical — never expose your database schema directly through your API.

## Controller Layer

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        UserResponse created = userService.create(request);
        URI location = URI.create("/api/v1/users/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }
}
```

Key points:
- Use `@Valid` to trigger Bean Validation
- Return `ResponseEntity` to control HTTP status codes
- Version your API paths (`/api/v1/`)
- Return `201 Created` with a `Location` header for POST

## Request Validation with Bean Validation

```java
public record CreateUserRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    String name,

    @Email(message = "Invalid email address")
    @NotBlank
    String email,

    @NotNull
    @Min(value = 18, message = "Must be at least 18")
    Integer age
) {}
```

Java records work perfectly as immutable DTOs with Java 14+.

## Global Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage(), "NOT_FOUND"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .toList();

        return ResponseEntity.badRequest()
            .body(new ValidationErrorResponse("Validation failed", errors));
    }
}
```

A `@RestControllerAdvice` centralizes all error handling and ensures consistent error response structure.

## Service Layer with Transactions

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponse findById(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional  // Override readOnly for writes
    public UserResponse create(CreateUserRequest request) {
        User user = userMapper.toEntity(request);
        return userMapper.toResponse(userRepository.save(user));
    }
}
```

Mark the service class `readOnly = true` by default, then override with `@Transactional` on write methods. This gives you better database performance for read-heavy services.

## Security with Spring Security

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/users/**").hasRole("USER")
                .anyRequest().hasRole("ADMIN"))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

## Key Production Checklist

- [ ] DTOs separate from entities
- [ ] `@Valid` on all request bodies
- [ ] `@RestControllerAdvice` for centralized error handling
- [ ] API versioning in URL paths
- [ ] `readOnly = true` transactions for queries
- [ ] Stateless JWT-based authentication
- [ ] Structured logging with correlation IDs
- [ ] Actuator endpoints for health checks

Spring Boot makes it easy to get started — the discipline is in the structure you impose on top of it.
