---
title: "Kubernetes Networking Demystified: Services, Ingress, and Network Policies"
date: "2024-06-20"
description: "Kubernetes networking can feel like black magic. This article unpacks Services, Ingress controllers, and Network Policies with concrete examples."
tags: ["Kubernetes", "Networking", "DevOps", "Ingress"]
---

# Kubernetes Networking Demystified: Services, Ingress, and Network Policies

Kubernetes networking has a reputation for complexity, but the core concepts are logical once you understand the abstractions at each layer.

## The Problem Kubernetes Networking Solves

Pods are ephemeral — they get created and destroyed constantly, with new IP addresses each time. You can't hardcode pod IPs. Kubernetes networking layers solve this with stable abstractions.

## Services: Stable Endpoints for Pods

A Service provides a stable IP and DNS name that routes traffic to matching pods via `selector`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api-server
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

### Service Types

**ClusterIP** (default): Internal-only. Accessible within the cluster at `api-service.namespace.svc.cluster.local`.

**NodePort**: Exposes the service on each node's IP at a static port. Useful for development, not production.

**LoadBalancer**: Provisions an external load balancer (cloud provider specific). One LB per service = expensive at scale.

**ExternalName**: Maps a service to an external DNS name. Useful for accessing external services from within the cluster.

## DNS in Kubernetes

Every Service gets a DNS entry. From within a pod:

```bash
# Full DNS name
curl http://api-service.production.svc.cluster.local

# Within the same namespace
curl http://api-service

# Cross-namespace
curl http://api-service.production
```

kube-dns (or CoreDNS) handles all of this automatically.

## Ingress: HTTP Routing at the Edge

Instead of a LoadBalancer per service (expensive), use a single Ingress controller that routes based on hostnames and paths:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

### TLS with cert-manager

```yaml
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls-cert
  rules:
  - host: api.example.com
    # ...
```

With `cert-manager` and Let's Encrypt, TLS certificates are provisioned and renewed automatically.

## Network Policies: Zero-Trust Networking

By default, all pods can communicate with all other pods. Network Policies let you enforce microsegmentation:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-server-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api-server
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

This policy restricts the `api-server` to only accept traffic from `frontend` pods and only send traffic to `database` pods.

### Default Deny Policy

Start with a default deny and explicitly allow what you need:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}   # Matches all pods
  policyTypes:
  - Ingress
  - Egress
```

Apply this to a namespace, then add allow policies for legitimate traffic flows.

## Common Networking Checklist

- [ ] Services use `ClusterIP` internally — expose externally via Ingress only
- [ ] Ingress controller deployed (nginx, Traefik, or cloud-native)
- [ ] TLS configured via cert-manager
- [ ] Network Policies defined for all production workloads
- [ ] Default-deny policy in production namespaces

Kubernetes networking is a layered system — understand each layer in isolation, and the complete picture becomes much clearer.
