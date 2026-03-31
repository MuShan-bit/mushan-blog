# Container Deployment

## Docker

This project includes:

- `Dockerfile`: production image for Next.js standalone output
- `docker-compose.yaml`: local or single-host deployment
- `k8s/`: Kubernetes manifests

## Build the image

The public site variables are used during `next build`, so pass them as build args:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://blog.example.com \
  --build-arg NEXT_PUBLIC_OSS_BASE_URL=https://image-blog-mushan.oss-cn-beijing.aliyuncs.com \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co \
  -t mushan-blog:latest .
```

## Run with Docker Compose

If your variables are already stored in `.env.local`:

```bash
docker compose --env-file .env.local up --build -d
```

Then open:

- `http://localhost:3000`

## Run on Kubernetes

1. Build and push your image:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://blog.example.com \
  --build-arg NEXT_PUBLIC_OSS_BASE_URL=https://image-blog-mushan.oss-cn-beijing.aliyuncs.com \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co \
  -t your-registry.example.com/mushan-blog:latest .

docker push your-registry.example.com/mushan-blog:latest
```

2. Update these files:

- `k8s/deployment.yaml`: replace image address
- `k8s/configmap.yaml`: replace domain and public env vars
- `k8s/secret.yaml`: replace `SUPABASE_SERVICE_ROLE_KEY`
- `k8s/ingress.yaml`: replace host and TLS secret name

3. Apply manifests:

```bash
kubectl apply -k k8s
```

## Important note about `NEXT_PUBLIC_*`

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_OSS_BASE_URL`, and `NEXT_PUBLIC_SUPABASE_URL` are used at build time for static content and metadata.

That means:

- changing them in a running container will not fully update already built static output
- when these public values change, rebuild the image and redeploy

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are still provided at runtime.
