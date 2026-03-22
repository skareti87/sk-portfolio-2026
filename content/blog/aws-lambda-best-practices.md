---
title: "AWS Lambda Best Practices: Cold Starts, Memory, and Architecture"
date: "2024-05-14"
description: "Practical patterns for writing Lambda functions that are fast, cost-effective, and production-ready — covering cold starts, memory tuning, and when not to use Lambda."
tags: ["AWS", "Lambda", "Serverless", "Cloud"]
---

# AWS Lambda Best Practices: Cold Starts, Memory, and Architecture

AWS Lambda is powerful and cost-efficient, but naive usage leads to slow cold starts, unnecessary costs, and brittle architectures. This guide covers the practices that matter in production.

## Understanding Cold Starts

A cold start happens when Lambda initializes a new execution environment. This involves:
1. Downloading your deployment package
2. Starting the runtime (JVM, Node.js, Python, etc.)
3. Executing your initialization code

For Node.js, cold starts are typically 100-500ms. For Java (JVM), they can be 2-10 seconds without mitigation.

### What Runs Outside the Handler

Code outside the handler function runs only on cold start:

```javascript
// Runs ONCE per cold start — put expensive init here
const db = new DatabaseClient({ host: process.env.DB_HOST });
const secretsCache = await getSecrets();

// Runs on EVERY invocation
export const handler = async (event) => {
  const result = await db.query('SELECT * FROM users');
  return result;
};
```

Move connection initialization, SDK client creation, and secret loading outside the handler. These connections are reused across warm invocations.

### Reducing Cold Starts for Java

Use Lambda SnapStart for Java 21+ runtimes:

```yaml
# serverless.yml / SAM template
Functions:
  ApiFunction:
    SnapStart:
      ApplyOn: PublishedVersions
```

SnapStart takes a snapshot of the initialized execution environment, reducing Java cold starts to under 1 second.

For Python and Node.js, keep your deployment package small. Every megabyte adds cold start time.

## Memory Configuration and Performance

Lambda allocates CPU proportionally to memory. More memory = more CPU = faster execution:

| Memory | vCPU | Notes |
|--------|------|-------|
| 128 MB | 0.07 | Slowest, cheapest |
| 1792 MB | 1 | Full vCPU |
| 3008 MB | 2 | Good for CPU-intensive work |
| 10240 MB | 6 | Maximum |

**The counterintuitive truth:** Increasing memory often *decreases total cost* because the function runs faster, resulting in fewer GB-second charges.

Use [AWS Lambda Power Tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning) to find the optimal memory for your function automatically.

## Environment Variables and Secrets

```javascript
// Bad: fetching secrets on every invocation
export const handler = async () => {
  const secret = await secretsManager.getSecretValue({ SecretId: '/prod/db' });
  // ...
};

// Good: cache secrets in module scope
let cachedSecret;
const getSecret = async () => {
  if (!cachedSecret) {
    const response = await secretsManager.getSecretValue({ SecretId: '/prod/db' });
    cachedSecret = JSON.parse(response.SecretString);
  }
  return cachedSecret;
};

export const handler = async () => {
  const secret = await getSecret(); // Only hits Secrets Manager on cold start
  // ...
};
```

## Handling Timeouts Gracefully

```javascript
export const handler = async (event, context) => {
  // Check remaining time before starting expensive work
  const remainingMs = context.getRemainingTimeInMillis();

  if (remainingMs < 5000) {
    console.warn('Insufficient time remaining, aborting');
    return { statusCode: 503, body: 'Service Unavailable' };
  }

  // Proceed with work...
};
```

## Concurrency and Throttling

Lambda scales concurrency automatically, but there are limits:

- **Account concurrency limit**: 1,000 per region (soft limit, can be raised)
- **Reserved concurrency**: Guarantees a fixed concurrency for a function
- **Provisioned concurrency**: Pre-warms environments to eliminate cold starts

```yaml
# Reserve 100 concurrent executions for critical functions
ReservedConcurrentExecutions: 100
```

**Important**: Reserved concurrency also *caps* the function. Setting `ReservedConcurrentExecutions: 100` means the function will throttle if it tries to run more than 100 concurrent invocations.

## When NOT to Use Lambda

Lambda is not universally appropriate:

| Avoid Lambda When | Use Instead |
|------------------|-------------|
| Long-running processes (>15 min) | ECS / EKS |
| Persistent WebSocket connections | EC2 / ECS |
| CPU-intensive, sustained workloads | EC2 (compute-optimized) |
| Sub-millisecond latency required | EC2 with provisioned capacity |
| Large dependency trees (>250MB) | Container-based Lambda or ECS |

## Architecture Pattern: Fan-Out with SQS

```
API Gateway → Lambda (orchestrator) → SQS → Lambda workers (parallel)
```

```javascript
// Orchestrator function
export const handler = async (event) => {
  const items = event.items;

  await sqs.sendMessageBatch({
    QueueUrl: process.env.QUEUE_URL,
    Entries: items.map((item, i) => ({
      Id: `${i}`,
      MessageBody: JSON.stringify(item),
    })),
  });
};
```

This decouples the request from processing, handles backpressure automatically via SQS, and scales each worker independently.

## Lambda Best Practices Summary

- [ ] Initialize SDK clients and DB connections outside the handler
- [ ] Use AWS Lambda Power Tuning to optimize memory
- [ ] Cache secrets — don't call Secrets Manager per invocation
- [ ] Set timeouts explicitly (don't rely on the 15-minute default)
- [ ] Use reserved concurrency for critical functions
- [ ] Use provisioned concurrency to eliminate cold starts for latency-sensitive functions
- [ ] Keep deployment packages lean — tree-shake or use Lambda Layers
