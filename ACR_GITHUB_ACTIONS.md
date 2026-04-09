# GitHub Actions To Alibaba Cloud ACR

## What this workflow does

This repository now includes:

- `.github/workflows/publish-acr-image.yml`

It automatically:

1. Uses GitHub OIDC to obtain short-lived Alibaba Cloud STS credentials.
2. Exchanges STS credentials for a temporary ACR password.
3. Builds the Docker image with Buildx and GHA cache.
4. Pushes the image to Alibaba Cloud Container Registry (ACR).
5. Publishes `main` and `dev` to different image repositories.

## Why this design is safer

This workflow intentionally avoids storing long-lived credentials in GitHub:

- no Alibaba Cloud AccessKey secret is stored in GitHub Secrets
- no permanent ACR username/password is stored in GitHub Secrets
- the ACR password is fetched just-in-time and is temporary
- all third-party actions are pinned to immutable commit SHAs
- the workflow only has the minimum GitHub permissions it needs: `contents: read` and `id-token: write`
- the workflow only auto-pushes on `main` and `dev`

## Branch to environment mapping

The workflow binds branches to GitHub Environments:

- `main` -> `production`
- `dev` -> `development`

Because of this, `Environment variables` are now available to the job and can hold branch-specific frontend build values.

## Required GitHub repository variables

Create these in `Settings -> Secrets and variables -> Actions -> Variables`:

- `ACR_LOGIN_SERVER`
  Example: `your-instance-registry.cn-beijing.cr.aliyuncs.com`
- `ACR_REGION_ID`
  Example: `cn-beijing`
- `ACR_INSTANCE_ID`
  Example: `cri-xxxxxxxx`
- `ACR_NAMESPACE`
  Example: `mushan`
- `ACR_REPOSITORY`
  Example: `mushan-blog`
  The workflow will automatically use:
  `mushan-blog` for `main`
  and `mushan-blog-dev` for `dev`
- `ALIYUN_OIDC_PROVIDER_ARN`
  Example: `acs:ram::<account-id>:oidc-provider/github-actions`
- `ALIYUN_ROLE_ARN`
  Example: `acs:ram::<account-id>:role/github-actions-acr-pusher`

Optional variables:

- `ALIYUN_OIDC_AUDIENCE`
  Default is `sts.aliyuncs.com`
- `ACR_API_ENDPOINT`
  Default is `cr.<region>.aliyuncs.com`

## Required GitHub environment variables

Create two environments first:

- `production`
- `development`

Then configure variables in `Settings -> Environments -> <environment> -> Variables`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_OSS_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL` (optional, can be empty)

For example:

- In `production`: `NEXT_PUBLIC_SITE_URL=https://your-prod-domain`
- In `development`: `NEXT_PUBLIC_SITE_URL=https://your-dev-domain`

If the same variable exists in both repository and environment scopes, the environment-scoped value is used for that environment job.

## Alibaba Cloud setup

### 1. Create an OIDC provider in RAM

Create an OIDC provider for GitHub Actions with:

- Issuer URL: `https://token.actions.githubusercontent.com`
- Client ID: `sts.aliyuncs.com`
  Or use the same custom audience value that you put into `ALIYUN_OIDC_AUDIENCE`.

### 2. Create a RAM role for GitHub Actions

Use a trust policy that only allows this repository and the `main` / `dev` branches to assume the role.

Example:

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Federated": ["acs:ram::<account-id>:oidc-provider/github-actions"]
      },
      "Condition": {
        "StringEquals": {
          "oidc:iss": "https://token.actions.githubusercontent.com",
          "oidc:aud": "sts.aliyuncs.com",
          "oidc:sub": "repo:<github-owner>/<github-repo>:ref:refs/heads/main"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Federated": ["acs:ram::<account-id>:oidc-provider/github-actions"]
      },
      "Condition": {
        "StringEquals": {
          "oidc:iss": "https://token.actions.githubusercontent.com",
          "oidc:aud": "sts.aliyuncs.com",
          "oidc:sub": "repo:<github-owner>/<github-repo>:ref:refs/heads/dev"
        }
      }
    }
  ]
}
```

If you later want to publish from tags or another branch, explicitly extend the trust policy. Do not widen it to all repositories.

### 3. Attach a least-privilege RAM policy

If you know the exact target repositories, scope permissions to those repository ARNs instead of `*`.

Example:

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["cr:GetAuthorizationToken"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["cr:PushRepository", "cr:PullRepository"],
      "Resource": [
        "acs:cr:<region-id>:<account-id>:repository/<instance-id>/<namespace>/<repository>",
        "acs:cr:<region-id>:<account-id>:repository/<instance-id>/<namespace>/<repository>-dev"
      ]
    }
  ]
}
```

Create the ACR namespace and both repositories in advance:

- `<ACR_REPOSITORY>`
- `<ACR_REPOSITORY>-dev`

## How the workflow names and tags images

On `main`, the workflow pushes to:

```text
<ACR_LOGIN_SERVER>/<ACR_NAMESPACE>/<ACR_REPOSITORY>
```

Tags:

- `latest`
- `main`
- `sha-<commit>`

On `dev`, the workflow pushes to:

```text
<ACR_LOGIN_SERVER>/<ACR_NAMESPACE>/<ACR_REPOSITORY>-dev
```

Tags:

- `latest`
- `dev`
- `sha-<commit>`

## Notes

- `NEXT_PUBLIC_*` values are baked into the image at build time. If they change, rerun the workflow to rebuild the image.
- Manual runs with `workflow_dispatch` should use the `main` or `dev` branch, otherwise the RAM trust policy example above will reject the role assumption.
- If you must temporarily use AccessKey-based authentication, create a dedicated RAM user with only the minimum ACR permissions and store the credentials as GitHub Secrets. This is less safe than OIDC and is not the default workflow here.
