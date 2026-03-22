---
title: "Kubernetes Deployments: Rolling Updates, Health Checks, and Zero Downtime"
date: "2024-07-12"
description: "A practical guide to Kubernetes Deployments — configuring rolling updates, liveness/readiness probes, resource limits, and achieving genuine zero-downtime deploys."
tags: ["Kubernetes", "DevOps", "Containers", "Deployment"]
---

# Kubernetes Deployments: Rolling Updates, Health Checks, and Zero Downtime

Kubernetes Deployments are the standard way to run stateless applications. Understanding their configuration deeply is what separates reliable production deployments from fragile ones.

## Anatomy of a Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api-server
        image: myregistry/api-server:1.2.0
        ports:
        - containerPort: 8080
```

This is the baseline. The defaults will get you running, but they won't give you zero downtime or production resilience.

## Rolling Update Strategy

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods above desired count during update
      maxUnavailable: 0  # Zero unavailable = zero downtime
```

With `maxUnavailable: 0`, Kubernetes will not terminate an old pod until a new pod is fully ready. This guarantees zero downtime.

`maxSurge: 1` allows one extra pod during the transition, so you temporarily run `replicas + 1` pods. Tune this based on resource headroom.

## Health Checks: Liveness vs Readiness

This is where most teams go wrong.

### Liveness Probe

"Is this container still alive, or should Kubernetes restart it?"

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
```

Your liveness endpoint should only fail if the application is genuinely stuck (deadlocked, corrupted state). **Do not** check external dependencies here — if your database is down, you don't want Kubernetes restarting all your pods in a loop.

### Readiness Probe

"Is this container ready to receive traffic?"

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 2
```

Your readiness endpoint *can* check external dependencies. If the database connection pool is exhausted, mark the pod as not-ready. Kubernetes will remove it from the Service's endpoint list, stopping new traffic from reaching it.

### Startup Probe

For slow-starting applications (JVM apps, Python apps loading large models):

```yaml
startupProbe:
  httpGet:
    path: /health/live
    port: 8080
  failureThreshold: 30   # 30 * 10s = 5 minutes to start
  periodSeconds: 10
```

`startupProbe` gives the container time to start up before liveness kicks in, preventing premature restarts.

## Resource Requests and Limits

Always set both:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

- **requests**: What Kubernetes uses for scheduling decisions
- **limits**: Hard cap — container is OOM-killed if it exceeds memory limit

A container without `requests` will be scheduled on any node regardless of available resources, causing noisy-neighbor issues. A container without `limits` can consume all node resources.

## Graceful Shutdown

Kubernetes sends `SIGTERM` before killing a pod. Your application must handle this gracefully:

```yaml
spec:
  terminationGracePeriodSeconds: 60
  containers:
  - name: api-server
    lifecycle:
      preStop:
        exec:
          command: ["/bin/sleep", "5"]
```

The `preStop` sleep is a practical trick: it gives the load balancer time to remove the pod from rotation before the app starts shutting down, preventing in-flight requests from failing.

## Pod Disruption Budget

Protect against too many pods being unavailable simultaneously (e.g., during node maintenance):

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-server-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api-server
```

This ensures at least 2 pods are always available during voluntary disruptions.

## Zero Downtime Deploy Checklist

- [ ] `maxUnavailable: 0` in rolling update strategy
- [ ] Readiness probe configured (not just liveness)
- [ ] `preStop` hook with a short sleep
- [ ] `terminationGracePeriodSeconds` > app shutdown time
- [ ] Resource requests and limits defined
- [ ] `PodDisruptionBudget` in place for critical services

Kubernetes gives you the tools for zero-downtime deployments — but they don't work by default. You have to configure them explicitly.
