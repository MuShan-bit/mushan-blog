# Container Deployment

## Docker

This project includes:

- `Dockerfile`: production image for Next.js standalone output
- `docker-compose.yaml`: local or single-host deployment
- `k8s/base`: base Kubernetes manifests
- `k8s/overlays/local`: local Kubernetes overlay

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

- `k8s/base/deployment.yaml`: replace image address
- `k8s/base/configmap.yaml`: replace domain and public env vars
- `k8s/base/secret.yaml`: replace `SUPABASE_SERVICE_ROLE_KEY`
- `k8s/base/ingress.yaml`: replace host and TLS secret name

3. Apply manifests:

```bash
kubectl apply -k k8s
```

## Local Kubernetes quick start

If you are using a local cluster such as OrbStack and do not have an ingress controller installed, use the local overlay:

```bash
docker build -t mushan-blog:local .
kubectl apply -k k8s/overlays/local
kubectl -n mushan-blog rollout status deployment/mushan-blog
kubectl -n mushan-blog get pods,svc
kubectl -n mushan-blog port-forward svc/mushan-blog 3000:80
```

Then open:

- `http://127.0.0.1:3000`
- `http://127.0.0.1:3000/api/health`

The local overlay does three things for easier local validation:

- removes the `Ingress` resource because the current local cluster may not have any `IngressClass`
- switches the image to `mushan-blog:local`
- clears Supabase runtime secrets so the site can start in degraded mode without a real Supabase backend

## Validate the Kubernetes deployment

For local validation:

```bash
kubectl -n mushan-blog rollout status deployment/mushan-blog
kubectl -n mushan-blog get pods,svc,endpoints -o wide
kubectl -n mushan-blog port-forward svc/mushan-blog 3000:80
```

Then in another terminal:

```bash
curl http://127.0.0.1:3000/api/health
```

If the deployment is healthy, the API should return JSON like:

```json
{ "status": "ok", "timestamp": "2026-04-08T16:12:09.234Z" }
```

## Important note about `NEXT_PUBLIC_*`

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_OSS_BASE_URL`, and `NEXT_PUBLIC_SUPABASE_URL` are used at build time for static content and metadata.

That means:

- changing them in a running container will not fully update already built static output
- when these public values change, rebuild the image and redeploy

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are still provided at runtime.
