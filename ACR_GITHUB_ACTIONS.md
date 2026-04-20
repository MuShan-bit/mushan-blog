# GitHub Actions To Alibaba Cloud ACR

## What this workflow does

This repository includes:

- `.github/workflows/publish-acr-image.yml`

On push to `main` or `dev`, it will:

1. Build the Docker image with Buildx and GHA cache.
2. Log in to Alibaba Cloud Container Registry (ACR) using fixed credentials from GitHub Secrets.
3. Push images to different repositories by branch:
- `main` -> `<ACR_REPOSITORY>`
- `dev` -> `<ACR_REPOSITORY>-dev`
4. Trigger Yunxiao Flow pipeline webhook after image push succeeds.

## Why this design

- Works for personal ACR editions that do not support STS token exchange.
- Keeps sensitive login password in GitHub Secrets, not repository variables.
- Keeps workflow permissions minimal (`contents: read`).
- Pins all third-party actions to immutable commit SHAs.

## Branch to environment mapping

The workflow binds branches to GitHub Environments:

- `main` -> `Production`
- `dev` -> `Preview`

Because of this mapping, frontend build vars can differ between production and preview.

## Required GitHub repository variables

Create these in `Settings -> Secrets and variables -> Actions -> Variables`:

- `ACR_LOGIN_SERVER`
  Example: `your-instance-registry.cn-beijing.cr.aliyuncs.com`
- `ACR_NAMESPACE`
  Example: `mushan`
- `ACR_REPOSITORY`
  Example: `mushan-blog`
  The workflow will automatically use:
  `mushan-blog` for `main`
  and `mushan-blog-dev` for `dev`

## Required GitHub environment variables

Create two environments first:

- `Production`
- `Preview`

Then configure variables in `Settings -> Environments -> <environment> -> Variables`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CN_SITE_URL`
- `NEXT_PUBLIC_GLOBAL_SITE_URL`
- `NEXT_PUBLIC_DEPLOY_REGION` (`cn` or `global`)
- `NEXT_PUBLIC_OSS_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL` (optional, can be empty)

Example:

- In `Production`: `NEXT_PUBLIC_SITE_URL=https://your-prod-domain`
- In `Production`: `NEXT_PUBLIC_CN_SITE_URL=https://your-cn-domain`
- In `Production`: `NEXT_PUBLIC_GLOBAL_SITE_URL=https://your-global-domain`
- In `Production`: `NEXT_PUBLIC_DEPLOY_REGION=cn`
- In `Preview`: `NEXT_PUBLIC_SITE_URL=https://your-preview-domain`
- In `Preview`: `NEXT_PUBLIC_CN_SITE_URL=https://your-cn-domain`
- In `Preview`: `NEXT_PUBLIC_GLOBAL_SITE_URL=https://your-global-domain`
- In `Preview`: `NEXT_PUBLIC_DEPLOY_REGION=global`

If the same variable exists in both repository and environment scopes, the environment-scoped value is used.

## Yunxiao webhook variables

The workflow resolves webhook URLs by branch:

- `main` -> `YUNXIAO_WEBHOOK_PRODUCTION`
- `dev` -> `YUNXIAO_WEBHOOK_PREVIEW`

You can store them in either:

- GitHub Environment `Secrets` (recommended)
- GitHub Environment `Variables`

When both exist, the workflow prefers `Secrets`.

Recommended setup:

- `Production` environment: `YUNXIAO_WEBHOOK_PRODUCTION`
- `Preview` environment: `YUNXIAO_WEBHOOK_PREVIEW`

## Required GitHub Secrets

Create these in `Settings -> Secrets and variables -> Actions -> Secrets`:

- `ACR_USERNAME`
- `ACR_PASSWORD`

Use the username/password that can run `docker login` against your `ACR_LOGIN_SERVER`.
For security, prefer a dedicated low-privilege ACR account if your edition supports sub-accounts or tokens.

## ACR prerequisites

Create the ACR namespace and both repositories in advance:

- `<ACR_REPOSITORY>`
- `<ACR_REPOSITORY>-dev`

## How the workflow names and tags images

On `main`, pushes to:

```text
<ACR_LOGIN_SERVER>/<ACR_NAMESPACE>/<ACR_REPOSITORY>
```

Tags:

- `latest`
- `main`
- `sha-<commit>`

On `dev`, pushes to:

```text
<ACR_LOGIN_SERVER>/<ACR_NAMESPACE>/<ACR_REPOSITORY>-dev
```

Tags:

- `latest`
- `dev`
- `sha-<commit>`

## Notes

- `NEXT_PUBLIC_*` values are baked at build time. If changed, rerun workflow.
- `workflow_dispatch` should run from `main` or `dev`.
- If login fails, first verify `ACR_USERNAME`/`ACR_PASSWORD` by running local `docker login <ACR_LOGIN_SERVER>`.
- Yunxiao webhook is triggered with `POST` and JSON body `{}` after image push succeeds.
