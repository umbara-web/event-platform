# Deployment & DevOps Strategy

## Infrastructure

Kami merekomendasikan pendekatan **Containerized (Docker)** untuk konsistensi antara Development, Staging, dan Production.

### Environment Requirements

- **Node.js Runtime:** v18 Alpine (Lightweight)
- **Database:** Managed PostgreSQL (AWS RDS / Supabase / Neon) untuk automated backup & maintenance.
- **Redis:** Managed Redis (Upstash / AWS ElastiCache).

## CI/CD Pipeline (GitHub Actions / GitLab CI)

1.  **Check Stage:**
    - Linting (ESLint)
    - Type Checking (TSC)
    - Unit Tests (Jest) - _Block deploy jika gagal._

2.  **Build Stage:**
    - Build Docker Images untuk `api`, `customer-web`, `admin-web`, `worker`.
    - Push ke Container Registry (ECR / Docker Hub).

3.  **Deploy Stage:**
    - **Backend:** Rolling Update (Zero Downtime).
    - **Frontend:** Vercel (untuk Next.js) atau Static Hosting S3/CloudFront (untuk React Admin).
    - **Migrations:** Jalankan `prisma migrate deploy` sebelum container baru aktif.

## Container Orchestration

Untuk skala besar, gunakan **Kubernetes (K8s)** atau **AWS ECS**.

### Service Separation

Dalam `docker-compose.prod.yml`:

```yaml
services:
  api:
    image: my-app/api
    replicas: 3 # Horizontal Scaling
    environment:
      - ROLE=API

  worker:
    image: my-app/api
    replicas: 2
    environment:
      - ROLE=WORKER # Hanya memproses Queue
```

## Monitoring & Alerting

- Logs: Centralized logging (ELK Stack atau Datadog).
- Metrics: Prometheus + Grafana untuk memantau CPU, RAM, dan Response Time API.
- APM: Sentry untuk tracking error real-time.
