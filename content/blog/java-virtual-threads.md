---
title: "Java Virtual Threads: A Practical Guide to Project Loom"
date: "2024-03-25"
description: "Virtual Threads in Java 21 change the concurrency game. Here's what they are, how they work, and how to actually use them in Spring Boot applications."
tags: ["Java", "Virtual Threads", "Concurrency", "Spring Boot", "Java 21"]
---

# Java Virtual Threads: A Practical Guide to Project Loom

Java 21 made Virtual Threads a stable feature. They represent the biggest change to Java concurrency since the `java.util.concurrent` package arrived in Java 5.

## The Problem with Platform Threads

Traditional Java threads are expensive:

- Each thread maps 1:1 to an OS thread
- A typical thread consumes ~1MB of stack memory
- Thread creation is slow (system call overhead)
- Context switching is expensive

For I/O-bound applications (web servers, database clients, HTTP clients), threads spend most of their time *waiting*. A 10ms database query holds a platform thread for 10ms — even though the CPU is doing nothing.

To handle 10,000 concurrent requests at 10ms each, you'd need 10,000 platform threads — 10GB of memory just for thread stacks.

## Virtual Threads: Cheap, Abundant Threads

Virtual Threads are managed by the JVM, not the OS:

- Millions can exist simultaneously
- They yield automatically during blocking I/O
- Stack memory is small and heap-allocated
- No callback hell — write sequential, blocking code

```java
// Create 1 million virtual threads — works fine
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 1_000_000).forEach(i ->
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1)); // Blocks, but doesn't hold OS thread
            return i;
        })
    );
}
```

This would crash with platform threads. With virtual threads, it runs fine.

## How Virtual Threads Work

When a virtual thread blocks on I/O (database call, HTTP request, file read), the JVM automatically unmounts it from its carrier (platform) thread. The carrier thread is free to run other virtual threads. When the I/O completes, the virtual thread is scheduled back on a carrier thread.

This is cooperative scheduling at the JVM level — entirely transparent to your code.

## Using Virtual Threads in Spring Boot 3.2+

Enable virtual threads for all request handling with one configuration line:

```properties
# application.properties
spring.threads.virtual.enabled=true
```

That's it. Spring Boot 3.2+ will use `VirtualThreadTaskExecutor` for `@Async` methods and Tomcat's request handling automatically.

Or configure explicitly:

```java
@Configuration
public class ThreadConfig {

    @Bean
    public TomcatProtocolHandlerCustomizer<?> virtualThreadsCustomizer() {
        return protocolHandler ->
            protocolHandler.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
    }

    @Bean(TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_BEAN_NAME)
    public AsyncTaskExecutor asyncTaskExecutor() {
        return new TaskExecutorAdapter(Executors.newVirtualThreadPerTaskExecutor());
    }
}
```

## Writing Virtual-Thread-Friendly Code

The key: write sequential, blocking code. No reactive programming required.

```java
@Service
public class UserService {

    // This is perfectly fine with virtual threads
    // Blocking JDBC calls yield the virtual thread during I/O
    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id)          // blocks, yields VT
            .orElseThrow(() -> new NotFoundException(id));
        
        List<Order> orders = orderRepository.findByUserId(id); // blocks, yields VT
        
        Preferences prefs = prefsService.getPreferences(id);  // blocks, yields VT
        
        return UserResponse.from(user, orders, prefs);
    }
}
```

Compare this to WebFlux/Reactor:

```java
// Reactive equivalent — complex, hard to read, hard to debug
public Mono<UserResponse> getUser(Long id) {
    return userRepository.findById(id)
        .switchIfEmpty(Mono.error(new NotFoundException(id)))
        .zipWith(orderRepository.findByUserId(id).collectList())
        .zipWith(prefsService.getPreferences(id))
        .map(tuple -> UserResponse.from(
            tuple.getT1().getT1(),
            tuple.getT1().getT2(),
            tuple.getT2()
        ));
}
```

Both handle I/O concurrency — but virtual threads let you write the simple version.

## Caveats and Limitations

### Pinning

A virtual thread is "pinned" to its carrier thread when:
- It holds a `synchronized` lock
- It calls native code via JNI

Pinned virtual threads don't yield during blocking operations, defeating the purpose. Prefer `ReentrantLock` over `synchronized` in virtual-thread code:

```java
// Can pin the carrier thread
synchronized (lock) {
    doBlockingWork();
}

// Better for virtual threads
lock.lock();
try {
    doBlockingWork();
} finally {
    lock.unlock();
}
```

Spring's `@Transactional` and most modern libraries already use `ReentrantLock` internally.

### Thread Locals

Virtual threads support `ThreadLocal`, but per-thread state is less useful when you might have millions of threads. Consider `ScopedValue` (preview in Java 21, stable in Java 23+) as a better alternative.

### CPU-Bound Work

Virtual threads help with I/O-bound work only. For CPU-bound work (image processing, cryptography, heavy computation), platform threads or structured parallelism with `ForkJoinPool` remain the right choice.

## Summary

Virtual Threads are a game-changer for I/O-bound Java applications:

| Aspect | Platform Threads | Virtual Threads |
|--------|-----------------|-----------------|
| Memory per thread | ~1MB | ~few KB |
| Max practical count | ~10,000 | Millions |
| Programming model | Blocking or reactive | Blocking |
| Spring Boot support | Yes | Yes (3.2+) |
| CPU-bound work | Yes | Not better |

If you're on Spring Boot 3.2+ and Java 21+, enable virtual threads. You get WebFlux-level concurrency with blocking code simplicity.
